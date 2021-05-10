import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    countries: [Country]!
    exchangeRates: ExchangeRatePayload!
    userProfile: userProfilePayload!
  }

  type Mutation {
    login(data: LoginInput!): AuthPayload!
  }

  type Country {
    name: String!
    population: Int!
    currencies: [Currency!]!
  }

  type Currency {
    code: String!
    name: String!
    symbol: String!
    exchangeRate: Float!
  }

  type AuthPayload {
    token: String!
  }

  type ExchangeRatePayload {
    rates: [ExchangeRate!]!
  }

  type ExchangeRate {
    name: String!
    rate: Float!
  }

  type userProfilePayload {
    email: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ExchangeRatesInput {
    currencyCodes: [String]!
  }
`;

export default typeDefs;
