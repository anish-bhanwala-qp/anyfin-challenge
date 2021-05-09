import { ApolloServer } from "apollo-server";
import { context } from "./context";
import resolvers from "./resolvers";
import typeDefs from "./typedefs";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});
