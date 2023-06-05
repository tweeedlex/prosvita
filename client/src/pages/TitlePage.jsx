import React, { useContext } from "react";
import styles from "./css/TitlePage.module.css";
import boardImage from "../images/hero/board.png";
import teacherImage from "../images/hero/teacher.png";
import transition from "../images/transition.png";
import transition2 from "../images/transition2.png";
import groupImage from "../images/about/group.png";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

export const TitlePage = observer(() => {
  const navigate = useNavigate();
  const { item } = useContext(Context);

  return (
    <>
      <section className={styles.hero}>
        <div className={"container " + styles.container}>
          <div className={styles.text}>
            <h1 className={styles.h1}>Здобувай знання легше</h1>
            <p className={styles.subtitle}>
              Освітні товари та послуги від найкращих викладачів
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className={styles.view}
            >
              Переглянути
            </button>
          </div>
        </div>
        <div className={styles.media}>
          <img className={styles.board} src={boardImage} alt="Desk" />
          <img className={styles.teacher} src={teacherImage} alt="Teacher" />
        </div>
      </section>
      <img className={styles.transition} src={transition} alt="" />

      <section className={styles.catalog}>
        <div className={"catalog__container" + " " + styles.catalogContainer}>
          <h2 className={styles.h2}>Широкий асортимент товарів</h2>
          <div className={styles.cards}>
            <Link
              to={`/catalog#${
                item.types?.find((type) => type.name === "ЗНО")?.id
              }`}
              className={styles.card + " " + styles.card1}
            >
              <p className={styles.caption}>ЗНО</p>
            </Link>
            <Link
              to={`/catalog#${
                item.types?.find((type) => type.name === "Курси")?.id
              }`}
              className={styles.card + " " + styles.card2}
            >
              <p className={styles.caption}>КУРСИ</p>
            </Link>
            <Link
              to={`/catalog#${
                item.types?.find((type) => type.name === "Канцелярія")?.id
              }`}
              className={styles.card + " " + styles.card3}
            >
              <p className={styles.caption}>КАНЦЕЛЯРІЯ</p>
            </Link>
          </div>
        </div>
      </section>
      <img
        className={styles.transition + " " + styles.transition2}
        src={transition2}
        alt=""
      />

      <section id="about" className={styles.about}>
        <div className={"about__container" + " " + styles.aboutContainer}>
          <h2 className={styles.h2}>Про нас</h2>
          <div className={styles.aboutContent}>
            <p className={styles.p}>
              "Просвіта" - це інтернет-магазин освітніх товарів та послуг, який
              пропонує вам легкий доступ до широкого асортименту продукції за
              допомогою зручного замовлення з дому.
              <br />
              <br />
              Ми віддаємо перевагу ефективності та швидкості, тому ваше
              замовлення буде оброблено швидко та надійно.
              <br />
              <br />
              Довірте нам свої освітні потреби та отримайте кращі товари та
              послуги в одному місці!
            </p>
            <div className={styles.aboutMedia}>
              <img src={groupImage} alt="pencils" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
});
