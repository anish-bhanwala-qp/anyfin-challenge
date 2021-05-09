import jwt from "jsonwebtoken";
import config from "config";

export const getAuthenticatedRequestMock = (jwtPayload) => {
  const secret = config.get("jwt.accessTokenSecretKey");
  const token = jwt.sign(jwtPayload, secret);

  const reqMock = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  return reqMock;
};
