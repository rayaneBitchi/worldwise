import { Outlet } from "react-router-dom";

import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWide. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
