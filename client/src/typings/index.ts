export interface User {
  email: string;
}

export interface Country {
  name: string;
  population: number;
  currencies: Array<Currency>;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryCache {
  lastUpdatedTs: number;
  countries: Array<Country>;
}

export interface ExchnageRate {
  name: string;
  rate: number;
}

export interface ExchangeRateCache {
  lastUpdatedTs: number;
  exchangeRates: Array<ExchnageRate>;
}
