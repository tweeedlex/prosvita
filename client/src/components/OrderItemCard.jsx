import React from "react";
import { Link } from "react-router-dom";
import styles from "../pages/css/OrdersPage.module.css";

export const OrderItemCard = ({ item, amounts }) => {
  return (
    <div className={styles.item}>
      <div
        className={styles.itemImage}
        style={{
          background: `url(${item.img}) center center/contain no-repeat`,
        }}
      ></div>
      <div className={styles.itemInfo}>
        <Link to={"/item/" + item.id}>
          {item.name.length < 44 ? item.name : `${item.name.substr(0, 44)}..`}
        </Link>
        <span>
          Кількість:{" "}
          {amounts.find((amountItem) => amountItem.id === item.id).amount}
        </span>
        <span>Код: {item.id}</span>
        <span>Ціна: {item.price}₴</span>
      </div>
    </div>
  );
};
