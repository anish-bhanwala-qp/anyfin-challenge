export const Query = {
  async countries(parent, args, { countryService }, info) {
    return countryService.fetchAll();
  },
  async exchangeRates(parent, args, { exchngeRateService }, info) {
    return exchngeRateService.getRatesFor(args.currencies);
  },

  async userProfile(parent, args, { user }, info) {
    return user;
  },
};
