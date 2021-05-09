const users = [{ email: "a@a.com", password: "12345678" }];

export class UserModel {
  static findByEmail(email) {
    return users.find((user) => user.email === email);
  }
}
