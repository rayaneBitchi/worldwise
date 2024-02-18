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

  const countries = cities.reduce((accumulator, currentCity) => {
    // const newArr = [...accumulator].map(el => el.country)
    if (!accumulator.map((city) => city.country).includes(currentCity.country))
      return [
        ...accumulator,
        { country: currentCity.country, emoji: currentCity.emoji },
      ];
    else return accumulator;
  }, []);

  if (!countries.length) {
    return (
      <Message message='Add your first city by clicling on the city on the map ' />
    );
  }

  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem key={index} country={country} />
      ))}
    </ul>
  );
}
