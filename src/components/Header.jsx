import React, { useState } from "react";
import styles from "./css/Header.module.css";
import logoLetter from "../images/header/logo P.png";
import searchIcon from "../images/header/search.png";
import cartIcon from "../images/header/cart.png";
import profileIcon from "../images/header/profile.png";
import { Link, useLocation } from "react-router-dom";
import { Login } from "./Login";
import { Registration } from "./Registration";
import { Basket } from "./Basket";

export const Header = (props) => {
  const location = useLocation();

  const [isBasketOpened, setIsBasketOpened] = useState(false);
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState();
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);

  let body = document.querySelector("body");

  const togglePopup = () => {
    setIsPopUpOpened(!isPopUpOpened);
    const body = document.querySelector("body");
    isPopUpOpened
      ? body.classList.remove("locked")
      : body.classList.add("locked");
  };

  const logOut = () => {
    localStorage.setItem("user-token", "");
    props.setEmail(undefined);
    props.setIsAdmin(false);
    props.setIsManager(false);
  };

  const toggleMenu = () => {
    isMenuActive
      ? body.classList.remove("locked")
      : body.classList.add("locked");
    if (isMenuActive) {
      return setIsMenuActive(false);
    }
    setIsMenuActive(true);
  };

  return (
    <header className={styles.header}>
      <div className={"header__container " + styles.container}>
        <Link className={styles.logo} to="/">
          <img src={logoLetter} />
          <span>росвіта</span>
        </Link>

        <div
          className={
            styles.inMobileMenu + " " + (isMenuActive ? styles.active : "")
          }
        >
          <div className={styles.search}>
            <input placeholder="Пошук товарів..." type="text" />
            <button>
              <img src={searchIcon} alt="Search" />
            </button>
          </div>

          <nav className={styles.navigation}>
            <ul>
              <li className={location.pathname === "/" ? styles.active : ""}>
                <Link to="/">Головна</Link>
                <span className={styles.hoverline}></span>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className={
                    location.pathname === "/catalog" ? styles.active : ""
                  }
                >
                  Каталог
                </Link>
                <span className={styles.hoverline}></span>
              </li>

              {location.pathname === "/" && (
                <li>
                  <a
                    onClick={() =>
                      document.getElementById("about").scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    Про нас
                  </a>
                  <span className={styles.hoverline}></span>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.actions}>
          <button onClick={() => setIsBasketOpened(true)}>
            <img src={cartIcon} alt="basket" />
          </button>
          <button onClick={togglePopup}>
            <img src={profileIcon} alt="profile" />
          </button>
          <button
            onClick={() => toggleMenu()}
            className={
              styles.burger + " " + (isMenuActive ? styles.active : "")
            }
          >
            <span></span>
          </button>
          {isPopUpOpened && (
            <div className={styles.popUp} onClick={togglePopup}>
              {props.email ? (
                <div className={styles.popUpContent}>
                  <p>{props.email}</p>
                  <a href="/">Мої замовлення</a>
                  {props.isAdmin && <Link to="/admin">Адмін-панель</Link>}
                  {props.isManager && <Link to="/orders">Замовлення</Link>}
                  <a onClick={() => logOut()}>Вийти</a>
                </div>
              ) : (
                <div className={styles.popUpContentUnlogined}>
                  <a onClick={() => setIsRegistrationOpened(true)}>
                    Реєстрація
                  </a>
                  <a onClick={() => setIsLoginOpened(true)}>Вхід</a>
                </div>
              )}
            </div>
          )}
        </div>
        <Basket isOpened={isBasketOpened} setIsOpened={setIsBasketOpened} />
        <Login
          isOpened={isLoginOpened}
          setIsOpened={setIsLoginOpened}
          getEmail={props.getEmail}
          getRole={props.getRole}
        />
        <Registration
          isOpened={isRegistrationOpened}
          setIsOpened={setIsRegistrationOpened}
        />
      </div>
    </header>
  );
};
