import jwt from "jsonwebtoken";
const SECRET = "vulnerabilities";

const generateToken = (email) => {
  return jwt.sign({ email }, SECRET, { expiresIn: "1 day" });
};

const decodeToken = (token) => {
  return jwt.verify(token, SECRET);
};
