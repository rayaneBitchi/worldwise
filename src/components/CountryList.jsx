import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

import { useCities } from "../contexts/CitesContext";

export default function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { contry: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  if (!countries.length) {
    return (
      <Message message='Add your first city by clicling on the city on the map ' />
    );
  }

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.contry} country={country} />
      ))}
    </ul>
  );
}
