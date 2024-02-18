import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvent,
} from "react-leaflet";

import { useGeolocation } from "../hooks/useGeolocation";

import { useCities } from "../contexts/CitesContext";

import styles from "./Map.module.css";
import Button from "./Button";

export default function Map() {
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition ? (
        <Button
          type='position'
          className={styles.geolocationButton}
          onClick={getPosition}
          disabled={isLoadingPosition}>
          {isLoadingPosition ? "Loading..." : "Use my location 📍"}
        </Button>
      ) : null}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        // center={[mapLat || 40, mapLng || 0]}
        zoom={6}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={geolocationPosition || mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent("click", (e) => {
    // navigate to the form with the lat and lng as query params
    const { lat, lng } = e.latlng;
    navigate(`form?lat=${lat}&lng=${lng}`);
    // navigate(`form`);
  });
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}
