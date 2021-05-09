import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { loginUser } from "./services/AuthService";
import { LOGIN_MUTATION } from "./pages/login/LoginPage";
import { COUNTRIES_QUERY } from "./pages/home/HomePage";

const validJWt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5jb20iLCJpYXQiOjE1" +
  "MTYyMzkwMjJ9.4IQO5G5d_SJuWM8l80GiORMIK8mR8epLhN-tS0ozmko";

const countriesQueryMock = {
  request: {
    query: COUNTRIES_QUERY,
  },
  result: { data: { countries: [] } },
};

const renderApp = (mocks: Array<MockedResponse> = [countriesQueryMock]) => {
  render(
    <MockedProvider mocks={mocks}>
      <App />
    </MockedProvider>,
  );
};

describe("App", () => {
  beforeEach(() => localStorage.clear());

  test("renders login form when user is not logged in", async () => {
    renderApp();

    await screen.findByLabelText("Email");
    screen.getByLabelText("Password");
  });

  test("redirects to home page when a valid access token is found in localStorage", async () => {
    loginUser(validJWt);
    renderApp();

    await waitFor(async () => {
      return await screen.findByPlaceholderText(/Enter country name/i);
    });
  });

  test("renders country selection page on successfull login", async () => {
    const loginResponse = { token: validJWt };
    const expectedCredentials = { email: "a@a.com", password: "12345678" };
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: expectedCredentials,
        },
        result: { data: { login: loginResponse } },
      },
      countriesQueryMock,
    ];

    renderApp(mocks);

    const emailInput = await screen.findByLabelText("Email");
    const passwordInput = await screen.findByLabelText("Password");

    userEvent.type(emailInput, "a@a.com");
    userEvent.type(passwordInput, "12345678");

    const submitBtn = screen.getByRole("button", { name: /login/i });
    userEvent.click(submitBtn);

    await waitFor(async () => {
      return await screen.findByPlaceholderText(/Enter country name/i);
    });
  });
});
