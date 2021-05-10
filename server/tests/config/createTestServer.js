import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import { applyMiddleware } from "graphql-middleware";
import { context } from "../../src/context";
import { createRateLimiterMiddleware } from "../../src/middlewares/rateLimiterMiddleware";
import resolvers from "../../src/resolvers";
import typeDefs from "../../src/typedefs";

const createTestServer = (customSchema = {}, middlewares) => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    ...customSchema,
  });

  const customMiddlewares = middlewares || [createRateLimiterMiddleware()];
  const schemaWithMiddleware = applyMiddleware(schema, ...customMiddlewares);

  const customContext = customSchema.context || context;

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    context: customContext,
  });

  return createTestClient(server);
};

export default createTestServer;
