import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { context } from "./context";
import { applyMiddleware } from "graphql-middleware";
import { createRateLimiterMiddleware } from "./middlewares/rateLimiterMiddleware";
import resolvers from "./resolvers";
import typeDefs from "./typedefs";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(
  schema,
  createRateLimiterMiddleware(),
);

export const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context,
});
