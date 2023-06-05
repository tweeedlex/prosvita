import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./css/Item.module.css";
import cartImage from "../images/catalog/cart.png";

import { Context } from "../index";

export const Item = observer(({ item }) => {
  const [itemInBasket, setItemInBasket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, item: itemContext } = useContext(Context);

  useEffect(() => {
    setIsLoading(false);
    loadItem();
  }, [user.user, itemContext.basket]);

  const loadItem = async () => {
    setItemInBasket(false);
    const basket = JSON.parse(localStorage.getItem("basket"));
    if (basket) {
      basket.find((basketItem) => basketItem.id === item.id) &&
        setItemInBasket(true);
    }
    setIsLoading(false);
  };

  const toggleInCart = () => {
    if (itemInBasket) {
      localStorage.setItem(
        "basket",
        JSON.stringify(
          JSON.parse(localStorage.getItem("basket")).filter(
            (basketItem) => basketItem.id !== item.id
          )
        )
      );
      setItemInBasket(false);
    } else {
      item.amount = 1;
      localStorage.setItem(
        "basket",
        JSON.stringify([...JSON.parse(localStorage.getItem("basket")), item])
      );
      setItemInBasket(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <div key={item.id} className={"loading " + styles.card}>
          <div className="loader"></div>
        </div>
      ) : (
        <div key={item.id} className={styles.card}>
          <Link to={`/item/${item.id}`}>
            <div
              className={styles.image}
              style={{
                background: `url(${item.img}) 50% 50%/contain no-repeat`,
              }}
            ></div>
          </Link>
          <Link className={styles.name} to={`/item/${item.id}`}>
            <p>
              {item.name.length < 44
                ? item.name
                : `${item.name.substr(0, 44)}..`}
            </p>
          </Link>

          <div className={styles.bottom}>
            <p>{item.price}₴</p>
            <button
              className={
                (itemInBasket ? styles.inCart : "") + " " + styles.cart
              }
              onClick={() => toggleInCart()}
            >
              <img src={cartImage} alt="cart" />
            </button>
          </div>
        </div>
      )}
    </>
  );
});
