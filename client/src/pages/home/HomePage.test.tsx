import { render, screen } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { COUNTRIES_QUERY, HomePage, KEY_COUNTRIES } from "./HomePage";
import { Country } from "../../typings";

const renderHomePage = (mocks: Array<MockedResponse> = []) => {
  render(
    <MockedProvider mocks={mocks}>
      <HomePage />
    </MockedProvider>,
  );
};

const countriesDummyData: Array<Country> = [];

describe("App", () => {
  test("doesn't do API call if countries are already populated in localStorage cache", async () => {
    localStorage.setItem(
      KEY_COUNTRIES,
      JSON.stringify({
        lastUpdatedTs: Date.now(),
        countries: countriesDummyData,
      }),
    );

    const mocks = [
      {
        request: {
          query: COUNTRIES_QUERY,
        },
        error: new Error("Should not do API call as data is in cache"),
      },
    ];

    renderHomePage(mocks);
  });

  test("renders error message when API call fails", async () => {
    const mocks = [
      {
        request: {
          query: COUNTRIES_QUERY,
        },
        error: new Error("Should not do API call as data is in cache"),
      },
    ];

    renderHomePage(mocks);

    const errorElement = await screen.findByTestId("error-message");
    expect(errorElement).toHaveTextContent(
      "Should not do API call as data is in cache",
    );
  });

  /* test("renders error message for validation error", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: validUserCredentials,
        },
        result: { errors: [new GraphQLError("Invalid email or password")] },
      },
    ];

    renderLoginPage(mocks);

    await submitValidForm();

    const errorElement = await screen.findByTestId("error-message");
    expect(errorElement).toHaveTextContent("Invalid email or password");
  }); */
});
