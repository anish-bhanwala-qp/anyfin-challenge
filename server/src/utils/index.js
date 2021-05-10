import { AuthenticationError } from "apollo-server-errors";

export const authenticate = (func) => {
  return async (parent, args, ctx, info) => {
    if (!ctx.user) {
      throw new AuthenticationError("You must be logged in");
    }
    return func(parent, args, ctx, info);
  };
};
