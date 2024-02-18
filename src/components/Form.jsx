// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitesContext";

import BackButton from "./BackButton";

import Button from "./Button";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const { createCity, isLoading } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!lat || !lng) {
      return;
    }

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError("");
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();

        if (
          !data.countryCode ||
          !data.countryName ||
          !data.city ||
          !data.locality ||
          !data.localityInfo ||
          !data.localityInfo.administrative
        ) {
          throw new Error(
            "That doesn't look like a valid city, click somewhere else on the map. 🗺️"
          );
        }

        setCityName(data.city || data.locality || "Unknown city");
        setCountry(data.countryName);
        console.log(country);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGeocodingError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(event) {
    event.preventDefault();

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app");
  }

  if ((!lat, !lng)) {
    return <Message message='Start by clicking on the map 🗺️' />;
  }

  if (isLoadingGeocoding) {
    return <Spinner />;
  }

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }

  return (
    <form className={`${styles.form} ${isLoading ? "loading" : ""}`}>
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>

        <DatePicker
          id='date'
          selected={date}
          dateFormat='dd/MM/yyyy'
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary' onClick={handleSubmit}>
          Add
        </Button>
        <BackButton to={-2} />
      </div>
    </form>
  );
}

export default Form;
