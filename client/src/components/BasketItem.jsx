import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./css/Basket.module.css";
import cartImage from "../images/catalog/cart.png";

export const BasketItem = ({ item, setBasketModalVisible }) => {
  const [itemInBasket, setItemInBasket] = useState(true);
  const [amount, setAmount] = useState(item.amount);

  const updateAmount = async (action) => {
    let basket = JSON.parse(localStorage.getItem("basket"));
    const localItem = basket.find((basketItem) => basketItem.id === item.id);

    if (action === "+" && amount < 999) {
      setAmount(amount + 1);
      localItem.amount = amount + 1;
    } else if (action === "-" && amount > 1) {
      setAmount(amount - 1);
      localItem.amount = amount - 1;
    }

    localStorage.setItem("basket", JSON.stringify(basket));
  };

  const removeFromCart = async (item) => {
    let basket = JSON.parse(localStorage.getItem("basket"));
    basket = basket.filter((basketItem) => basketItem.id !== item.id);
    localStorage.setItem("basket", JSON.stringify(basket));
    setItemInBasket(false);
  };

  return (
    <div>
      {itemInBasket && (
        <div className={styles.item} key={item.id}>
          <Link
            onClick={() => setBasketModalVisible(false)}
            to={`/item/${item.id}`}
          >
            <div
              className={styles.image}
              style={{ background: `url(${item.img}) 50% 50%/cover` }}
            ></div>
          </Link>

          <div className={styles.itemInfo}>
            <Link
              onClick={() => setBasketModalVisible(false)}
              to={`/item/${item.id}`}
              className={styles.itemName}
            >
              {item?.name}
            </Link>
            <div className={styles.itemActions}>
              <div className={styles.categories}>
                <p>{item.brand?.name}</p>
                <p>{item.type?.name}</p>
              </div>
              <div className={styles.amount}>
                <div>
                  <button
                    className={styles.amountChange}
                    onClick={() => updateAmount("+")}
                  >
                    +
                  </button>
                  <p>{amount}</p>
                  <button
                    className={styles.amountChange}
                    onClick={() => updateAmount("-")}
                  >
                    -
                  </button>
                </div>
              </div>
              <div className={styles.money}>
                <button onClick={() => removeFromCart(item)}>
                  <img src={cartImage} alt="" />
                </button>
                <p className={styles.price}>{item.price}₴</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
