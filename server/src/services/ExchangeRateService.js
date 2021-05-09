import axios from "axios";

const API_KEY = "06fb673a3339452272808d5c3b44935d";
const BASE_CURRENCY = "EUR";

const sample = {
  success: true,
  timestamp: 1620501604,
  base: "EUR",
  date: "2021-05-08",
  rates: { GBP: 0.870389, JPY: 132.074698, EUR: 1, SEK: 10.104924 },
};

export class ExchangeRateService {
  #exchangeRatesCache = {
    lastUpdatedTs: 0,
    rates: [],
  };

  constructor(cacheInterval = 1000) {
    this.cacheInterval = cacheInterval;
  }

  #formatApiResponse(data) {
    return Object.entries(data.rates).map(([currency, rate]) => {
      return { name: currency, rate };
    });
  }

  isCacheExpired() {
    const currentTs = Date.now();
    const { lastUpdatedTs } = this.#exchangeRatesCache;
    return currentTs - lastUpdatedTs > this.cacheInterval;
  }

  #filterByCurrencies(currencies) {
    return {
      base: BASE_CURRENCY,
      rates: this.#exchangeRatesCache.rates
        .filter(({ name }) => {
          if (!currencies) {
            return true;
          }

          return currencies.includes(name);
        })
        .map((rate) => ({ ...rate })),
    };
  }

  getRatesFor(currencies) {
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

        return this.#filterByCurrencies(currencies);
      });
  }
}

const ALL = {
  success: true,
  timestamp: 1620501604,
  base: "EUR",
  date: "2021-05-08",
  rates: {
    AED: 4.46781,
    AFN: 93.52,
    ALL: 122.95,
    AMD: 629.469998,
    ANG: 2.1669,
    AOA: 795.613389,
    ARS: 113.2256,
    AUD: 1.550644,
    AWG: 2.189689,
    AZN: 2.072581,
    BAM: 1.95583,
    BBD: 2.4374,
    BDT: 102.3008,
    BGN: 1.9558,
    BHD: 0.4551,
    BIF: 2384.469993,
    BMD: 1.216325,
    BND: 1.6072,
    BOB: 8.3234,
    BRL: 6.3693,
    BSD: 1.2072,
    BTC: 0.000020538476,
    BTN: 88.6737,
    BWP: 13.1214,
    BYN: 3.0586,
    BYR: 23839.969933,
    BZD: 2.4333,
    CAD: 1.476047,
    CDF: 2430.217783,
    CHF: 1.095388,
    CLF: 0.030654,
    CLP: 845.837161,
    CNY: 7.824016,
    COP: 4591.999987,
    CRC: 744.269998,
    CUC: 1.216325,
    CUP: 32.232612,
    CVE: 110.265,
    CZK: 25.63557,
    DJF: 214.899999,
    DKK: 7.435643,
    DOP: 68.639,
    DZD: 162.268,
    EGP: 19.061,
    ERN: 18.247199,
    ETB: 50.9327,
    EUR: 1,
    FJD: 2.466226,
    FKP: 0.883508,
    GBP: 0.870389,
    GEL: 4.165962,
    GGP: 0.883508,
    GHS: 6.9653,
    GIP: 0.883508,
    GMD: 62.280527,
    GNF: 11915.899967,
    GTQ: 9.3132,
    GYD: 252.559999,
    HKD: 9.445834,
    HNL: 28.973,
    HRK: 7.533435,
    HTG: 105.325,
    HUF: 358.427122,
    IDR: 17188.496689,
    ILS: 3.957448,
    IMP: 0.883508,
    INR: 89.101284,
    IQD: 1761.249995,
    IRR: 51213.36441,
    ISK: 150.707309,
    JEP: 0.883508,
    JMD: 183.427999,
    JOD: 0.862423,
    JPY: 132.074698,
    KES: 128.8643,
    KGS: 103.110794,
    KHR: 4888.999986,
    KMF: 492.308009,
    KPW: 1094.692731,
    KRW: 1353.733698,
    KWD: 0.366297,
    KYD: 1.006,
    KZT: 514.979999,
    LAK: 11377.499968,
    LBP: 1820.399995,
    LKR: 237.810499,
    LRD: 209.208323,
    LSL: 17.101994,
    LTL: 3.591492,
    LVL: 0.735743,
    LYD: 5.421,
    MAD: 10.7158,
    MDL: 21.4874,
    MGA: 4560.359987,
    MKD: 61.615,
    MMK: 1880.151895,
    MNT: 3467.319751,
    MOP: 9.6576,
    MRO: 434.227815,
    MUR: 49.51,
    MVR: 18.889045,
    MWK: 957.881997,
    MXN: 24.214724,
    MYR: 5.002141,
    MZN: 70.650285,
    NAD: 17.101988,
    NGN: 462.816194,
    NIO: 42.16,
    NOK: 9.996493,
    NPR: 141.878,
    NZD: 1.67181,
    OMR: 0.4683,
    PAB: 1.2072,
    PEN: 4.6095,
    PGK: 4.2929,
    PHP: 58.12,
    PKR: 183.584899,
    PLN: 4.552158,
    PYG: 8192.299977,
    QAR: 4.428686,
    RON: 4.926486,
    RSD: 117.6,
    RUB: 89.706892,
    RWF: 1208.309997,
    SAR: 4.561675,
    SBD: 9.688011,
    SCR: 18.167077,
    SDG: 488.963062,
    SEK: 10.104924,
    SGD: 1.611149,
    SHP: 0.883508,
    SLL: 12449.086752,
    SOS: 711.550535,
    SRD: 17.21591,
    STD: 25213.368745,
    SVC: 10.563,
    SYP: 1529.610674,
    SZL: 17.1936,
    THB: 37.755177,
    TJS: 13.7677,
    TMT: 4.269301,
    TND: 3.335776,
    TOP: 2.747253,
    TRY: 10.018995,
    TTD: 8.2022,
    TWD: 33.716047,
    TZS: 2799.399992,
    UAH: 33.5063,
    UGX: 4293.899988,
    USD: 1.216325,
    UYU: 53.254,
    UZS: 12667.309964,
    VEF: 260087044454.52032,
    VND: 27842.999922,
    VUV: 133.234857,
    WST: 3.079403,
    XAF: 655.956998,
    XAG: 0.044301,
    XAU: 0.000664,
    XCD: 3.28718,
    XDR: 0.842,
    XOF: 655.956998,
    XPF: 119.81239,
    YER: 304.572155,
    ZAR: 17.104637,
    ZMK: 10948.38893,
    ZMW: 27.0054,
    ZWL: 391.656886,
  },
};