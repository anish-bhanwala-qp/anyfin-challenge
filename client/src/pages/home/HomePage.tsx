import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useMemo, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { COUNTRIES_CACHE_EXPIRY } from "../../config";
import { useLocalStorageCache } from "../../hooks/useLocalStorageCache";
import { Country, CountryCache } from "../../typings";
import { CountrySelector } from "./countries/CountrySelector";
import { ExchangeRateConverter } from "./exchangeRate/ExchangeRateConverter";

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

const checkTimestampExpiry = (countryCache: CountryCache) => {
  const lastUpdatedTs = countryCache?.lastUpdatedTs;
  return (
    lastUpdatedTs != null && Date.now() - lastUpdatedTs > COUNTRIES_CACHE_EXPIRY
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
    <>
      <CountrySelector
        countries={availableCountries}
        onCountrySelected={countrySelectedHandler}
      />

      <ExchangeRateConverter
        countries={selectedCountries}
        onCountryRemoved={countryRemovedHandler}
      />
    </>
  );
  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = <ErrorMessage message={error.message} />;
  }

  return <div>{content}</div>;
};
