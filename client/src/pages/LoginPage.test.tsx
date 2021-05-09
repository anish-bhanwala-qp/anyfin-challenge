import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { LoginPage, LOGIN_MUTATION } from "./LoginPage";
import { getAccessToken, loginUser } from "../services/AuthService";
import { GraphQLError } from "graphql";

const validJWt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5jb20iLCJpYXQiOjE1" +
  "MTYyMzkwMjJ9.4IQO5G5d_SJuWM8l80GiORMIK8mR8epLhN-tS0ozmko";
const validUserCredentials = { email: "a@a.com", password: "12345678" };

const onLoginMock = jest.fn();

const renderLoginPage = (mocks: Array<MockedResponse> = []) => {
  render(
    <MockedProvider mocks={mocks}>
      <LoginPage onLogin={onLoginMock} />
    </MockedProvider>,
  );
};

const submitValidForm = async ({ email, password } = validUserCredentials) => {
  const emailInput = await screen.findByLabelText("Email");
  userEvent.type(emailInput, email);
  const passwordInput = await screen.findByLabelText("Password");
  userEvent.type(passwordInput, password);
  const submitBtn = screen.getByRole("button", { name: /login/i });
  userEvent.click(submitBtn);
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    onLoginMock.mockReset();
  });

  test("valid login calls onLogin callback", async () => {
    const loginResponse = { token: validJWt };

    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: validUserCredentials,
        },
        result: { data: { login: loginResponse } },
      },
    ];

    renderLoginPage(mocks);

    await submitValidForm();

    await waitFor(() => {
      return onLoginMock.mock.calls.length > 0;
    });

    expect(onLoginMock).toHaveBeenCalledWith(validJWt);
  });

  test("renders error message for validation error", async () => {
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
  });

  test("renders error message for network error or server error", async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: validUserCredentials,
        },
        error: new Error("Unable to connect to the server"),
      },
    ];

    renderLoginPage(mocks);

    await submitValidForm();

    const errorElement = await screen.findByTestId("error-message");
    expect(errorElement).toHaveTextContent("Unable to connect to the server");
  });
});
