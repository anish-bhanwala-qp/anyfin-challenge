import React, { useCallback, useEffect, useState } from "react";
import { Country } from "../../../typings";
import styles from "./CountrySelector.module.css";

interface Props {
  countries: Array<Country>;
  onCountrySelected: (country: Country) => void;
}

interface ListItemProps {
  country: Country;
  onClick: (country: Country) => void;
}
const ListItem = ({ country, onClick }: ListItemProps) => {
  const onClickHandler = () => {
    onClick(country);
  };
  return <li onClick={onClickHandler}>{country.name}</li>;
};

export const CountrySelector = ({ countries, onCountrySelected }: Props) => {
  const [filteredCountries, setFilteredCountries] = useState<Array<Country>>(
    [],
  );
  const [query, setQuery] = useState("");
  const [displayList, setDisplayList] = useState(false);

  const countrySelectedHandler = useCallback(
    (country) => {
      onCountrySelected(country);
      setQuery("");
      setDisplayList(false);
    },
    [onCountrySelected],
  );

  useEffect(() => {
    if (!query) {
      setFilteredCountries(countries);
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

  const onFocusHandler = () => {
    setDisplayList(true);
  };

  const onBlurHandler = () => {
    setTimeout(() => {
      setDisplayList(false);
    }, 100);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.queryInput}
        type="text"
        placeholder="Enter country name"
        value={query}
        autoFocus
        onChange={queryInputHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
      <div
        className={styles.listContainer}
        style={{ display: displayList ? "block" : "none" }}
      >
        <ul className={styles.list}>
          {filteredCountries.map((country) => (
            <ListItem
              key={country.name}
              country={country}
              onClick={countrySelectedHandler}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
