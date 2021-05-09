import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectedCountries } from "./SelectedCountries";

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

const renderSelectedCountries = (onCountryRemoved = () => {}) => {
  render(
    <SelectedCountries
      selectedCountries={countriesMockData}
      onCountryRemoved={onCountryRemoved}
    />,
  );
};

describe("SelectedCountries", () => {
  test("renders countries list with remove button", async () => {
    renderSelectedCountries();

    const totalCountries = countriesMockData.length;

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(totalCountries);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(totalCountries);
  });

  test("does onCountryRemoved callback when remove button is clicked", async () => {
    const mockCallback = jest.fn();
    renderSelectedCountries(mockCallback);

    const algeriaListItem = screen.getByText("Algeria");
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
