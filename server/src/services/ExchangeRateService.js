import axios from "axios";
import config from "config";

const exchangeRateRefreshInterval = config.get("exchangeRateRefreshInterval");
const API_KEY = config.get("fixerApiKey");
const SEK_CODE = "SEK";

/* 
  API response example:
  {
    success: true,
    timestamp: 1620501604,
    base: "EUR",
    date: "2021-05-08",
    rates: { GBP: 0.870389, JPY: 132.074698, EUR: 1, SEK: 10.104924 },
  }; 
*/

/* 
  The ExchangeRateService service caches exchange-rates received from
  fixer api. Right now cache is refershed in two ways:
    1. Whenever a client calls we check if cache is expired
      - This approach is no longer required as cache is refreshed 
        using setInterval right now. Just keeping it here to show 
        alternative approach.      
    2. Use setInterval to refresh it every 'exchangeRateRefreshInterval'
       which is set in development.json or test.json.
*/
export class ExchangeRateService {
  #exchangeRatesCache = {
    lastUpdatedTs: 0,
    rates: [],
  };

  constructor(cacheInterval = 1000) {
    this.cacheInterval = cacheInterval;

    setInterval(this.#forceRefreshCache, exchangeRateRefreshInterval).unref();
  }

  #forceRefreshCache = async () => {
    this.#exchangeRatesCache.lastUpdatedTs = 0;
    await this.getRatesFor();
  };

  #formatApiResponse(data) {
    const sekPrice = data.rates[SEK_CODE];
    if (sekPrice == null) {
      throw new Error("SEK currency not found");
    }
    /* 
      Fixer api base currency is EUR, so convert all rates
      to SEK for easy conversion on client-side.
     */
    const adjustRate = ([currency, rate]) => {
      return [currency, rate / sekPrice];
    };

    return Object.entries(data.rates)
      .map(adjustRate)
      .map(([currency, rate]) => {
        return { name: currency, rate };
      });
  }

  isCacheExpired() {
    const currentTs = Date.now();
    const { lastUpdatedTs } = this.#exchangeRatesCache;
    return currentTs - lastUpdatedTs > this.cacheInterval;
  }

  /* 
    The currencies is not passed right now but earlier I 
    had designed to get exchange rate only for selected countries.
  */
  #filterByCurrencies(currencies) {
    return Promise.resolve({
      base: SEK_CODE,
      rates: this.#exchangeRatesCache.rates
        .filter(({ name }) => {
          if (!currencies) {
            return true;
          }

          return currencies.includes(name);
        })
        .map((rate) => ({ ...rate })),
    });
  }

  async getRatesFor(currencies) {
    if (!this.isCacheExpired()) {
      return this.#filterByCurrencies(currencies);
    }

    return axios
      .get("http://data.fixer.io/api/latest", {
        params: {
          access_key: API_KEY,
        },
      })
      .then(({ data }) => {
        this.#exchangeRatesCache = {
          lastUpdatedTs: Date.now(),
          rates: this.#formatApiResponse(data),
        };

        // Here I would use Subscription (pubSub) to refresh client side cache.

        return this.#filterByCurrencies(currencies);
      });
  }
}
