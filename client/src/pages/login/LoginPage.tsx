import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
    }
  }
`;

interface Props {
  onLogin: (accessToken: string) => void;
}

export const LoginPage = ({ onLogin }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      onLogin(data.login.token);
    },
  });

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    login({ variables: { email, password } }).catch((error) => {
      // Ignore
    });
  };

  let status = <p></p>;
  if (loading) {
    status = <p>Loading...</p>;
  }
  if (error) {
    status = <ErrorMessage message={error.message} />;
  }

  return (
    <div>
      {status}
      <form onSubmit={submitHandler}>
        <label htmlFor="login-email">
          Email
          <input
            autoFocus
            id="login-email"
            type="email"
            name="email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            name="password"
            required={true}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div>
          <button type="submit" disabled={loading}>
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
};
