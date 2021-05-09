import createTestServer from "../../tests/config/createTestServer";
import { context } from "../context";
import { CountryService } from "../services/CountryService";
import { UserModel } from "../models/UserModel";
import { getAuthenticatedRequestMock } from "../../tests/testUtil";

jest.mock("../models/UserModel");

const LOGIN_MUTATE = `
    mutation($email: String!, $password: String!) {
        login(data: {email: $email, password: $password}) {
            token
        }
    }
`;

const user = {
  email: "a@a.com",
  password: "$2b$10$uC7yK3Gjrlblf7Lr2B/p9udoqqUdMWChV3l.zM6.4KZnjChW4l06m",
};

describe("Mutation", () => {
  describe("login:mutation", () => {
    test("returns token for valid email and password", async () => {
      UserModel.findByEmail.mockReturnValueOnce(user);

      const { mutate } = createTestServer();

      const response = await mutate({
        mutation: LOGIN_MUTATE,
        variables: { email: user.email, password: "12345678" },
      });

      expect(response.data.login.token).toBeDefined();
    });

    test("returns validation error for invalid password", async () => {
      UserModel.findByEmail.mockReturnValueOnce(user);

      const { mutate } = createTestServer();

      const invalidPassword = "123456789";

      const response = await mutate({
        mutation: LOGIN_MUTATE,
        variables: { email: user.email, password: invalidPassword },
      });

      expect(response.errors[0].message).toBe("Invalid email or password");
    });

    test("returns validation error when email is not found", async () => {
      UserModel.findByEmail.mockReturnValueOnce(null);

      const { mutate } = createTestServer();

      const response = await mutate({
        mutation: LOGIN_MUTATE,
        variables: { email: user.email, password: user.password },
      });

      expect(response.errors[0].message).toBe("Invalid email or password");
    });
  });
});
