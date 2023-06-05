import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SERVER_URL } from '../config'
import styles from "./css/Menu.module.css"

export const Menu = ({ isAdmin, isManager, email, logOut }) => {
  const [isMenuActive, setIsMenuActive] = useState(false)

  let body = document.querySelector("body")

  const toggleMenu = () => {
    if (isMenuActive) {
      setIsMenuActive(false)
      return body.classList = "lock"
    }
    setIsMenuActive(true)
    body.classList = ("")
  }

  
  return (
    <div className={styles.header__menu}>
      <button onClick={() => toggleMenu()} className={`${styles.burger} ${isMenuActive && styles.active}`}>
        <span></span>
      </button>

      <div onClick={() => setIsMenuActive(false)} className={`${styles.menu__background} ${isMenuActive && styles.active}`}>
        <div onClick={(e) => e.stopPropagation()} className={`${styles.menu} ${isMenuActive && styles.active}`}>
          <div id="logo" style={{ margin: "20px 0 0 0" }}>Prosvita</div>
          <button onClick={() => setIsMenuActive(false)} className="close"></button>

          <div className={styles.menu__content}>
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              {
                email
                  ?
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <span className="email">{email}</span>
                    <button onClick={() => logOut()} className="log-out">Вийти</button>
                  </div>
                  :
                  <div className="header__links">
                    <Link onClick={() => setIsMenuActive(false)} className="header__link" to="/login">Вхід</Link>
                    <Link onClick={() => setIsMenuActive(false)} className="header__link" to="/registration">Реєстрація</Link>
                  </div>
              }

              {
                isAdmin && <Link onClick={() => setIsMenuActive(false)} className="admin-link" to="/admin">Адмін панель</Link>
              }

              {
                isManager && <Link onClick={() => setIsMenuActive(false)} className="admin-link" to="/orders">Замовлення</Link>
              }

            </div>
            <Link to={"/catalog"}>Каталог</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
