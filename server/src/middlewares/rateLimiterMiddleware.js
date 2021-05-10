import { getGraphQLRateLimiter } from "graphql-rate-limit";

/* 
    This helps with testing by reinitialize rateLimiter between test 
    cases/
*/
export const createRateLimiterMiddleware = (params) => {
  const rateLimiter = getGraphQLRateLimiter({
    identifyContext: (ctx) => ctx.user?.email,
  });

  return async (resolve, parent, args, ctx, info) => {
    /*  
        Only applied to authenticated routes as identity (user.email) 
        is required.
    */
    if (ctx.user) {
      const errorMessage = await rateLimiter(
        { parent, args, context: ctx, info },
        { max: 30, window: "30s" },
      );

      if (errorMessage) throw new Error(errorMessage);
    }

    return await resolve(parent, args, ctx, info);
  };
};
