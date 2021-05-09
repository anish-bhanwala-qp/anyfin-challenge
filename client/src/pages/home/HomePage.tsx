import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { useLocalStorageCache } from "../../hooks/useLocalStorageCache";
import { Country, CountryCache } from "../../typings";
import { CountrySelector } from "./countries/CountrySelector";
import { SelectedCountries } from "./countries/SelectedCountries";
import { ExchangeRateConverter } from "./exchangeRateConverter/ExchangeRateConverter";

export const COUNTRIES_QUERY = gql`
  query GetCountries {
    countries {
      name
      population
      currencies {
        code
        name
        symbol
      }
    }
  }
`;

export const KEY_COUNTRIES = "ac_countries";
// one day expiry
const COUNTRTY_EXPIRY_DURATION = 24 * 60 * 60 * 1000;

const checkTimestampExpiry = (countryCache: CountryCache) => {
  const lastUpdatedTs = countryCache?.lastUpdatedTs;
  return (
    lastUpdatedTs != null &&
    Date.now() - lastUpdatedTs > COUNTRTY_EXPIRY_DURATION
  );
};

export const HomePage = () => {
  const [countryCache, setCountryCache] = useLocalStorageCache<CountryCache>({
    key: KEY_COUNTRIES,
    cacheExpiryCheker: checkTimestampExpiry,
  });
  const { loading, error } = useQuery(COUNTRIES_QUERY, {
    skip: !!countryCache,
    onCompleted: (data) => {
      setCountryCache({
        lastUpdatedTs: Date.now(),
        countries: [...data.countries],
      });
    },
  });
  const [selectedCountries, setSelectedCountries] = useState<Array<Country>>(
    [],
  );

  const countrySelectedHandler = (country: Country) => {
    setSelectedCountries([...selectedCountries, { ...country }]);
  };

  const countryRemovedHandler = (country: Country) => {
    setSelectedCountries(
      selectedCountries.filter((sc) => sc.name !== country.name),
    );
  };

  const availableCountries = useMemo(() => {
    const countries = countryCache?.countries || [];
    const all = countries.filter(
      (c) => !selectedCountries.find((sc) => sc.name === c.name),
    );
    return all;
  }, [selectedCountries, countryCache?.countries]);

  let content = (
    <div>
      <CountrySelector
        countries={availableCountries}
        onCountrySelected={countrySelectedHandler}
      />

      <ExchangeRateConverter
        countries={selectedCountries}
        onCountryRemoved={countryRemovedHandler}
      />
    </div>
  );
  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <ErrorMessage message={error.message} />;
  }

  return <div>{content}</div>;
};
