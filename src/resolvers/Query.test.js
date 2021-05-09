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

describe("Query", () => {
  test("countries:query fetches all countries list", async () => {
    const jwtPayload = { email: "a@a.com" };
    UserModel.findByEmail.mockReturnValueOnce(jwtPayload);
    const requestMock = getAuthenticatedRequestMock(jwtPayload);

    const contextPipeline = () => {
      return { ...context({ req: requestMock }), countryService };
    };

    const countryService = new CountryService();
    const { query } = createTestServer({
      context: contextPipeline,
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
      UserModel.findByEmail.mockReturnValueOnce(jwtPayload);
      const requestMock = getAuthenticatedRequestMock(jwtPayload);

      const contextPipeline = () => context({ req: requestMock });

      const { query } = createTestServer({
        context: contextPipeline,
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
});
