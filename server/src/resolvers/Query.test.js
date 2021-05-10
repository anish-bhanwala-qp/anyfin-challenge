import createTestServer from "../../tests/config/createTestServer";
import { context } from "../context";
import { CountryService } from "../services/CountryService";
import { UserModel } from "../models/UserModel";
import { getAuthenticatedRequestMock } from "../../tests/testUtil";

jest.mock("../models/UserModel");

const COUNTRIES_QUERY = `
    query {
      countries {
        name
        population
      }
    }
`;

const USER_PROFILE_QUERY = `
    query {
      userProfile {
        email
      }
    }
`;

const createMockLoginTestServer = ({
  user = { email: "a@a.com" },
  services = {},
} = {}) => {
  UserModel.findByEmail.mockReturnValueOnce(user);
  const requestMock = getAuthenticatedRequestMock(user);

  const contextPipeline = () => {
    return { ...context({ req: requestMock }), ...services };
  };

  return createTestServer({
    context: contextPipeline,
  });
};

describe("Query", () => {
  test("countries:query fetches all countries list", async () => {
    const countryService = new CountryService();
    const { query } = createMockLoginTestServer({
      services: { countryService },
    });

    const mockFetchAll = jest.spyOn(countryService, "fetchAll");
    mockFetchAll.mockReturnValueOnce([{ name: "India", population: 100 }]);
    const response = await query({
      query: COUNTRIES_QUERY,
    });

    expect(response.data).toEqual({
      countries: [
        {
          name: "India",
          population: 100,
        },
      ],
    });
  });

  describe("Authentication for queries", () => {
    test("userProile:query query should succeed for authenticated user", async () => {
      const jwtPayload = { email: "a@a.com" };
      const { query } = createMockLoginTestServer({
        user: jwtPayload,
      });

      const response = await query({
        query: USER_PROFILE_QUERY,
      });

      expect(response.data).toEqual({
        userProfile: jwtPayload,
      });
    });

    test("userProile:query query should fail for unauthenticated user", async () => {
      const { query } = createTestServer();

      const response = await query({
        query: USER_PROFILE_QUERY,
      });

      expect(response.errors[0].message).toEqual("You must be logged in");
    });
  });

  describe("rate limiting queries", () => {
    test("userProile:query return error message if more then 30 queries are sent in a minute", async () => {
      const { query } = createMockLoginTestServer();

      for (let i = 0; i < 30; i++) {
        await query({
          query: USER_PROFILE_QUERY,
        });
      }

      const response = await query({
        query: USER_PROFILE_QUERY,
      });
      expect(response.errors[0].message).toBe(
        "You are trying to access 'userProfile' too often",
      );
    });

    test("userProile:query does not rate limit if 30 queries are sent in a minute", async () => {
      const { query } = createMockLoginTestServer();

      for (let i = 0; i < 28; i++) {
        await query({
          query: USER_PROFILE_QUERY,
        });
      }

      const response = await query({
        query: USER_PROFILE_QUERY,
      });
      expect(response.data).toEqual({ userProfile: { email: "a@a.com" } });
    });
  });
});
