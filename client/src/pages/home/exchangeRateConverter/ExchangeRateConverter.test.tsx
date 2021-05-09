import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ExchangeRateConverter,
  EXCHANGE_RATES_QUERY,
} from "./ExchangeRateConverter";

export const countriesMockData = [
  {
    name: "Afghanistan",
    population: 27657145,
    currencies: [
      {
        code: "AFN",
        name: "Afghan afghani",
        symbol: "؋",
      },
    ],
  },
  {
    name: "Albania",
    population: 2886026,
    currencies: [
      {
        code: "ALL",
        name: "Albanian lek",
        symbol: "L",
      },
    ],
  },
  {
    name: "Algeria",
    population: 40400000,
    currencies: [
      {
        code: "DZD",
        name: "Algerian dinar",
        symbol: "د.ج",
      },
    ],
  },
];

const exchangeRatesData = {
  base: "SEK",
  rates: [
    { name: "GBP", rate: 0.08 },
    { name: "AFN", rate: 9.25 },
    { name: "ALL", rate: 12.16 },
    { name: "JPY", rate: 13.2 },
    { name: "DZD", rate: 16.04 },
    { name: "EUR", rate: 0.1 },
    { name: "SEK", rate: 1 },
  ],
};

const renderExchangeRateConverter = (onCountryRemoved = () => {}) => {
  //   localStorage.setItem(KEY_EXCHANGE_RATES, JSON.stringify(exchangeRatesData));

  const mocks = [
    {
      request: {
        query: EXCHANGE_RATES_QUERY,
      },
      result: {
        data: {
          exchangeRates: exchangeRatesData,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks}>
      <ExchangeRateConverter
        countries={countriesMockData}
        onCountryRemoved={onCountryRemoved}
      />
    </MockedProvider>,
  );
};

describe("ExchangeRateConverter", () => {
  test("renders countries list with remove button", async () => {
    renderExchangeRateConverter();

    const totalCountries = countriesMockData.length;

    await waitFor(async () => {
      return await screen.findAllByRole("listitem");
    });

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(totalCountries);
  });

  test("does onCountryRemoved callback when remove button is clicked", async () => {
    const mockCallback = jest.fn();
    renderExchangeRateConverter(mockCallback);

    const algeriaListItem = await screen.findByText("Algeria");
    const removeButton = algeriaListItem.querySelector("button");
    expect(removeButton).toBeDefined();
    // @ts-ignore
    userEvent.click(removeButton);
    const algeriaCountry = countriesMockData.find(
      ({ name }) => name === "Algeria",
    );
    expect(mockCallback).toHaveBeenCalledWith(algeriaCountry);
  });
});
