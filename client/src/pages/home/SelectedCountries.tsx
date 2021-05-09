import React, { useCallback, useEffect, useState } from "react";
import { Country } from "../../typings";

interface Props {
  selectedCountries: Array<Country>;
  onCountryRemoved: (country: Country) => void;
}

interface ListItemProps {
  country: Country;
  onClick: (country: Country) => void;
}
const ListItem = ({ country, onClick }: ListItemProps) => {
  const onClickHandler = () => onClick(country);
  return (
    <li>
      {country.name}{" "}
      <button type="button" onClick={onClickHandler}>
        Remove
      </button>
    </li>
  );
};

export const SelectedCountries = ({
  selectedCountries,
  onCountryRemoved,
}: Props) => {
  const countryRemovedHandler = useCallback(
    (country) => {
      onCountryRemoved(country);
    },
    [onCountryRemoved],
  );

  return (
    <div>
      <ul>
        {selectedCountries.map((country) => (
          <ListItem
            key={country.name}
            country={country}
            onClick={countryRemovedHandler}
          />
        ))}
      </ul>
    </div>
  );
};
