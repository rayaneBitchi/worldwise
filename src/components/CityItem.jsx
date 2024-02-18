import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitesContext";

import styles from "./CityItem.module.css";

export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const { id, cityName, emoji, date, position } = city;
  const isActive = currentCity?.id === id;

  const handlClick = (e) => {
    e.preventDefault();
    deleteCity(id);
  };
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          isActive ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handlClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}
