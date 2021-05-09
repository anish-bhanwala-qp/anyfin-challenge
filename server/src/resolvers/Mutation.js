export const Mutation = {
  async login(parent, args, { authService }, info) {
    const { email, password } = args.data;
    return authService.login(email, password);
  },
};
