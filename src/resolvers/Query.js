import { protectResolver } from "../utils";

export const Query = {
  countries: protectResolver(async (parent, args, { countryService }, info) => {
    return countryService.fetchAll();
  }),
  exchangeRates: protectResolver(
    async (parent, args, { exchngeRateService }, info) => {
      return exchngeRateService.getRatesFor(args.currencies);
    },
  ),
  userProfile: protectResolver(async (parent, args, { user }, info) => {
    return user;
  }),
};
