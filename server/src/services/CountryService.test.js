import axios from "axios";
import { CountryService } from "./CountryService";

jest.mock("axios");

const countriesData = [
  {
    name: "Colombia",
    population: 48759958,
    currencies: [
      {
        code: "COP",
        name: "Colombian peso",
        symbol: "$",
      },
    ],
  },
];

const originalTimeout = axios.defaults.timeout;

describe("CountryService", () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.defaults.timeout = originalTimeout;
  });

  test("calling fetchAll fetches list from third-party API", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(countriesData));

    const countries = await new CountryService().fetchAll();

    expect(countries).toEqual(countriesData);
  });

  test("countries list is cached and subsequent calls don't call third-party API", async () => {
    //   Mock first call so data gets cached
    axios.get.mockImplementationOnce(() => Promise.resolve(countriesData));

    const countryService = new CountryService();
    await countryService.fetchAll();

    const mockGet = jest.fn();
    axios.get.mockImplementationOnce(mockGet);

    await countryService.fetchAll();

    expect(mockGet.mock.calls).toHaveLength(0);
  });

  test("data is Not cached if the third-party API call Fails", async () => {
    axios.get.mockImplementationOnce(() => Promise.reject("connection error"));

    const countryService = new CountryService();
    try {
      await countryService.fetchAll();
    } catch (err) {
      // Ignore
    }

    const mockGetSuccess = jest.fn(() => Promise.resolve(countriesData));
    axios.get.mockImplementationOnce(mockGetSuccess);
    try {
      await countryService.fetchAll();
    } catch (err) {
      console.log("error", err);
    }

    expect(mockGetSuccess.mock.calls).toHaveLength(1);
  });
});
