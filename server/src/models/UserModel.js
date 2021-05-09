const users = [
  {
    email: "a@a.com",
    password: "$2b$10$CxkqtGJ5K9N84IGA38iHIetyDNaRiiB8C.M/90NDL9YYdpMJ4BNTq",
  },
];

export class UserModel {
  static findByEmail(email) {
    return users.find((user) => user.email === email);
  }
}
