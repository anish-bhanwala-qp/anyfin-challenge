import React, { useCallback, useEffect, useState } from "react";
import { Country } from "../../typings";

interface Props {
  countries: Array<Country>;
  onCountrySelected: (country: Country) => void;
}

interface ListItemProps {
  country: Country;
  onClick: (country: Country) => void;
}
const ListItem = ({ country, onClick }: ListItemProps) => {
  const onClickHandler = () => onClick(country);
  return <li onClick={onClickHandler}>{country.name}</li>;
};

export const CountrySelector = ({ countries, onCountrySelected }: Props) => {
  const [filteredCountries, setFilteredCountries] = useState<Array<Country>>(
    [],
  );
  const [query, setQuery] = useState("");

  const countrySelectedHandler = useCallback(
    (country) => {
      onCountrySelected(country);
      setQuery("");
    },
    [onCountrySelected],
  );

  useEffect(() => {
    if (!query) {
      setFilteredCountries([]);
      return;
    }

    setFilteredCountries(
      countries.filter(({ name }) => {
        return name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      }),
    );
  }, [query, countries]);

  const queryInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter country name"
        value={query}
        onChange={queryInputHandler}
      />
      <ul>
        {filteredCountries.map((country) => (
          <ListItem
            key={country.name}
            country={country}
            onClick={countrySelectedHandler}
          />
        ))}
      </ul>
    </div>
  );
};
