export const Mutation = {
  async login(parent, args, { loginService }, info) {
    const { email, password } = args;
    return loginService.authenticate(email, password);
  },
};
