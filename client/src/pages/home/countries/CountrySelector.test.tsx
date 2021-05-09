import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CountrySelector } from "./CountrySelector";

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
    name: "Åland Islands",
    population: 28875,
    currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
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
  {
    name: "American Samoa",
    population: 57100,
    currencies: [
      {
        code: "USD",
        name: "United State Dollar",
        symbol: "$",
      },
    ],
  },
  {
    name: "Andorra",
    population: 78014,
    currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
  },
];

const renderCountrySelector = (onCountrySelected = () => {}) => {
  render(
    <CountrySelector
      countries={countriesMockData}
      onCountrySelected={onCountrySelected}
    />,
  );
};

describe("CountrySelector", () => {
  test("renders countries list if name matches", async () => {
    renderCountrySelector();

    const nameInput = screen.getByPlaceholderText(/enter country name/i);

    userEvent.type(nameInput, "Al");
    const listItemsWithAl = screen.getAllByRole("listitem");
    expect(listItemsWithAl).toHaveLength(2);
  });

  test("renders all countries input is cleared", async () => {
    renderCountrySelector();
    const nameInput = screen.getByPlaceholderText(/enter country name/i);

    userEvent.type(nameInput, "Al");
    const listItemsWithAl = screen.getAllByRole("listitem");
    expect(listItemsWithAl).toHaveLength(2);

    // Clearing
    userEvent.clear(nameInput);
    const allListItems = screen.getAllByRole("listitem");
    expect(allListItems).toHaveLength(countriesMockData.length);
  });

  test("does callback with selected country and resets input", async () => {
    const mockCallback = jest.fn();
    renderCountrySelector(mockCallback);

    const nameInput = screen.getByPlaceholderText(/enter country name/i);
    userEvent.type(nameInput, "Albania");
    const listItem = screen.getByRole("listitem");
    userEvent.click(listItem);

    const Albania = countriesMockData.find(({ name }) => name === "Albania");
    expect(mockCallback).toHaveBeenCalledWith(Albania);

    expect(nameInput).toHaveValue("");
  });
});
