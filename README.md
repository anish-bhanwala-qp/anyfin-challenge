## Server 
#### Requirements
  Node version: 14+ ( I have tested on v14.16.1)

- Starting app command: `npm start`
- The server runs on port: 4001

#### Configuration options 
- Mock user data is used instead of a database. Refer UseModel.js.
- Configuration is in development.json.

#### Backend cache
- Exchange Rates
  - The exchange rates are fetched on the first request and cached.
  - The cache is refreshed every 1 hour (exchangeRateRefreshInterval)
- Countries
  - The countries are fetched on the first request and cached.
  - The countries are not refreshed after that.

## Client
#### Requirements
  Node version: 12+ ( I have tested on v12.14.1)

- Start command: `npm start`
- The app runs on port: 3000

#### Frontend cache
- Countries
  - The data is cached in localStorage with a 1-day expiry (config.js).
  - The cache expiry is checked only on page reload.
- Exchange rates
  - The data is cached in localStorage with a 1-minute expiry (config.js).
  - The cache expiry is checked only on page reload.

#### Login/Logout
  - *Email* `a@a.com` and *password*: `12345678`
  - To log out clear local storage. 
