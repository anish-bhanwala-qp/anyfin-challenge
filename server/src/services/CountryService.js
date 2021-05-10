import axios from "axios";

export class CountryService {
  #countriesCache = null;

  /* 
    For some countries the currency values have some field null.
    Discard these currencies.
   */
  #sanitizeApiResponse(data) {
    return data.map(({ name, population, currencies }) => {
      const sanitizedCurrencies = currencies.filter((currency) => {
        return currency.name && currency.symbol && currency.code;
      });
      return { name, population, currencies: sanitizedCurrencies };
    });
  }

  async fetchAll() {
    if (this.#countriesCache !== null) {
      return this.#countriesCache.map((country) => ({
        ...country,
      }));
    }

    const timeout = axios.defaults.timeout || 10000;

    // TODO: Graceful error handling failed api response
    const response = await axios.get("https://restcountries.eu/rest/v2/all", {
      timeout,
    });
    this.#countriesCache = this.#sanitizeApiResponse(response.data);

    return this.#countriesCache.map((country) => ({
      ...country,
    }));
  }
}
