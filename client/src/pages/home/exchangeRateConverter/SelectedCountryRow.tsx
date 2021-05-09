import { Country, Currency } from "../../../typings";
import styles from "./SelectedCountryRow.module.css";

interface Props {
  country: Country;
  convertedRates: Array<{ amount: number; currency: Currency }>;
  onClick: (country: Country) => void;
}
export const SelectedCountryRow = ({
  country,
  onClick,
  convertedRates,
}: Props) => {
  const onClickHandler = () => onClick(country);
  return (
    <li className={styles.container}>
      <div className={styles.row}>
        {country.name}{" "}
        <button className={styles.btn} type="button" onClick={onClickHandler}>
          Remove
        </button>
      </div>

      <ul className={styles.ratesList}>
        {convertedRates.map(({ amount, currency: { code, symbol } }) => {
          return (
            <li key={code}>
              {code}:{" "}
              <strong>
                {symbol} {amount.toFixed(2)}
              </strong>
            </li>
          );
        })}
      </ul>
    </li>
  );
};
