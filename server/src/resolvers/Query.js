import { authenticate } from "../utils";

export const Query = {
  countries: authenticate(async (parent, args, { countryService }, info) => {
    return countryService.fetchAll();
  }),
  exchangeRates: authenticate(
    async (parent, args, { exchangeRateService }, info) => {
      return exchangeRateService.getRatesFor(args.currencies);
    },
  ),
  userProfile: authenticate(async (parent, args, { user }, info) => {
    return user;
  }),
};
