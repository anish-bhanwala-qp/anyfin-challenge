import { createTestClient } from "apollo-server-testing";
import jwt from "jsonwebtoken";
import config from "config";
import createTestServer from "../../tests/config/createTestServer";
import { context } from "../context";
import { CountryService } from "../services/CountryService";
import { UserModel } from "../models/UserModel";

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

describe("countries query", () => {
  test("fetches all countries list", async () => {
    const countryService = new CountryService();
    const { query } = createTestServer({
      context: {
        countryService,
      },
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

  test("authenticated", async () => {
    const jwtPayload = { email: "a@a.com" };
    const secret = config.get("jwt.accessTokenSecretKey");
    const token = jwt.sign(jwtPayload, secret);

    UserModel.findByEmail.mockReturnValueOnce(jwtPayload);

    const reqMock = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const contextPipeline = () => context({ req: reqMock });

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
});
