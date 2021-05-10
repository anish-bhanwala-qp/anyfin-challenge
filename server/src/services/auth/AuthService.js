import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import { UserModel } from "../../models/UserModel";
import { ValidationError } from "apollo-server-errors";

const SECRET = config.get("jwt.accessTokenSecretKey");
const EXPIRY = config.get("jwt.accessTokenExpiry");

const generateToken = (email) => {
  return jwt.sign({ email }, SECRET, { expiresIn: EXPIRY });
};

const decodeToken = (token) => {
  return jwt.verify(token, SECRET);
};

export class AuthService {
  async login(email, password) {
    const user = UserModel.findByEmail(email);
    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const isMatch = await brcypt.compare(password, user.password);

    if (!isMatch) {
      throw new ValidationError("Invalid email or password");
    }

    return {
      token: generateToken(email),
    };
  }

  authenticate(request) {
    const authorization = request?.headers?.authorization;
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      try {
        return decodeToken(token);
      } catch (err) {
        // Invalid token
      }
    }

    return null;
  }
}
