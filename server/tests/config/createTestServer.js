import { ApolloServer } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import { context } from "../../src/context";
import resolvers from "../../src/resolvers";
import typeDefs from "../../src/typedefs";

const createTestServer = (options = {}) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    ...options,
  });
  return createTestClient(server);
};

export default createTestServer;
