import { useEffect, useState } from "react";

type Decoder<T> = (value: string) => T;
type Encoder<T> = (value: T) => string;
type ExpiryChecker<T> = (data: T) => boolean;

interface Props<T> {
  key: string;
  cacheExpiryCheker: ExpiryChecker<T>;
  decoder?: Decoder<T>;
  encoder?: Encoder<T>;
}

type ReturnType<T> = [T | null, (value: T) => void];

function loadValueFromLocalStorage<T>(
  key: string,
  cacheExpiryCheker: ExpiryChecker<T>,
  decoder: Decoder<T>,
) {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      const decoded = decoder(value);
      if (cacheExpiryCheker(decoded)) {
        localStorage.removeItem(key);
        return null;
      }
      return decoded;
    } catch (err) {
      console.log("Error parsing localStorage value", err);
      // This value may be corrupt, remove it
      localStorage.removeItem(key);
    }
  }

  return null;
}

export function useLocalStorageCache<T>({
  key,
  cacheExpiryCheker,
  decoder = JSON.parse,
  encoder = JSON.stringify,
}: Props<T>): ReturnType<T> {
  const initialValue = loadValueFromLocalStorage(
    key,
    cacheExpiryCheker,
    decoder,
  );
  const [value, setValue] = useState<T | null>(initialValue);
  useEffect(() => {
    const value = loadValueFromLocalStorage(key, cacheExpiryCheker, decoder);
    setValue(value);
  }, [key]);

  const setValueHandler = (value: T) => {
    localStorage.setItem(key, encoder(value));
    setValue(value);
  };

  return [value, setValueHandler];
}
