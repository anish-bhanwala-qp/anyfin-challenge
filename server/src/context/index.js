import { CountryService } from "../services/CountryService";
import { AuthService } from "../services/auth/AuthService";
import { ExchangeRateService } from "../services/ExchangeRateService";

const contextData = {
  countryService: new CountryService(),
  exchangeRateService: new ExchangeRateService(),
  authService: new AuthService(),
};

export const context = ({ req }) => {
  const { authService } = contextData;
  const user = authService.authenticate(req);
  if (user) {
    return { ...contextData, user };
  }
  return { ...contextData };
};
