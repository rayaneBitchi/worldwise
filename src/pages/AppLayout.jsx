import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
// import AppNav from "../components/AppNav";

import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}
