import React from "react";
import styles from "./css/Footer.module.css"
import logoLetter from "../images/header/logo P.png";
import emailIcon from "../images/footer/mail.png";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={"container " + styles.container}>
        <a className={styles.logo} href="/">
          <img src={logoLetter} />
          <span>росвіта</span>
        </a>

        <p className={styles.copyright}>© 2022-2023 Всі права захищені.</p>
        <p className={styles.email}>
          <img src={emailIcon} className={styles.emailIcon} alt="email icon" />
          <span>prosvita.magazyn@gmail.com</span>
        </p>
      </div>
    </footer>
  );
};
