import axios from "axios";
import { ExchangeRateService } from "./ExchangeRateService";
import config from "config";

jest.mock("axios");

const apiResponse = {
  data: {
    base: "EUR",
    rates: { GBP: 0.8, JPY: 132, EUR: 1, SEK: 10 },
  },
};

const expectedRatesData = {
  base: "SEK",
  rates: [
    { name: "GBP", rate: 0.08 },
    { name: "JPY", rate: 13.2 },
    { name: "EUR", rate: 0.1 },
    { name: "SEK", rate: 1 },
  ],
};

const exchangeRateRefreshInterval = config.get("exchangeRateRefreshInterval");

describe("ExchangeRateService", () => {
  let exchangeRateService;

  beforeEach(() => {
    axios.get.mockReset();
    exchangeRateService = new ExchangeRateService();
  });

  describe("isCacheExpired", () => {
    test("isCacheExpired should return true for new instance", () => {
      expect(exchangeRateService.isCacheExpired()).toBeTruthy();
    });

    test("isCacheExpired should return false after data is fetched", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));

      await exchangeRateService.getRatesFor();

      expect(exchangeRateService.isCacheExpired()).toBeFalsy();
    });

    test("isCacheExpired should return false after time since last data fetched is > cacheInterval", async (done) => {
      const CACHE_INTERVAL = 100;
      exchangeRateService = new ExchangeRateService(CACHE_INTERVAL);

      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      await exchangeRateService.getRatesFor();
      expect(exchangeRateService.isCacheExpired()).toBeFalsy();

      // Check after CACHE_INTERVAL time i.e. 100ms
      setTimeout(() => {
        expect(exchangeRateService.isCacheExpired()).toBeTruthy();
        done();
      }, 200);
    });
  });

  describe("getRatesFor", () => {
    test("getRatesFor doesn't call fixer-API if data is already cached", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      await exchangeRateService.getRatesFor();

      const mockGet = jest.fn(() => Promise.resolve(apiResponse));
      axios.get.mockImplementationOnce(mockGet);
      await exchangeRateService.getRatesFor();

      expect(mockGet.mock.calls).toHaveLength(0);
    });

    test("getRatesFor returns data in correct format", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      const rates = await exchangeRateService.getRatesFor();

      expect(rates).toEqual(expectedRatesData);
    });

    test("getRatesFor multiple calls return data in correct format from cache", async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      await exchangeRateService.getRatesFor();

      axios.get.mockImplementationOnce(() =>
        Promise.reject("Should hit cache"),
      );
      const rates = await exchangeRateService.getRatesFor();
      expect(rates).toEqual(expectedRatesData);
    });

    test("getRatesFor doesn't cache error response", async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject({ rates: { EUR: 1 } }),
      );
      try {
        await exchangeRateService.getRatesFor();
      } catch (err) {
        // Ignore
      }

      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      const rates = await exchangeRateService.getRatesFor();
      expect(rates).toEqual(expectedRatesData);
    });

    test("getRatesFor doesn't cache error response", async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject({ rates: { EUR: 1 } }),
      );
      try {
        await exchangeRateService.getRatesFor();
      } catch (err) {
        // Ignore
      }

      axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
      const rates = await exchangeRateService.getRatesFor();
      expect(rates).toEqual(expectedRatesData);
    });
  });

  test("service refreshes cache after every'exchangeRateRefreshInterval'", async (done) => {
    jest.useFakeTimers();
    exchangeRateService = new ExchangeRateService();

    axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
    await exchangeRateService.getRatesFor();

    // advance the timer by exchangeRateRefreshInterval to force cache refresh
    const mockGet = jest.fn(() => Promise.resolve(apiResponse));
    axios.get.mockImplementationOnce(mockGet);
    expect(mockGet).not.toBeCalled();
    jest.advanceTimersByTime(exchangeRateRefreshInterval + 1000);

    expect(mockGet).toHaveBeenCalled();
    done();
  });
});
