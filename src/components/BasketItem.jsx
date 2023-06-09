import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import actionCart from "../utils/actionCart";
import axios from "axios";
import { SERVER_URL } from "../config";
import styles from "./css/Basket.module.css";
import cartImage from "../images/catalog/cart.png";

export const BasketItem = observer(
  ({ item, setBasketModalVisible, value, setValue }) => {
    const [brand, setBrand] = useState("");
    const [type, setType] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [itemInBasket, setItemInBasket] = useState(true)

    useEffect(() => {
      if (localStorage.getItem("user-token")) {
        setIsAuth(true);
      }

      loadItem().then(() => setIsLoading(false));

      loadAmount();
    }, []);

    const loadItem = async () => {
      try {
        const { data: itemInfo } = await axios.get(
          SERVER_URL + `/api/item/itemInfo?itemId=${item.id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("user-token"),
            },
          }
        );
        setBrand(itemInfo.brand);
        setType(itemInfo.type);
      } catch (e) {
        console.log(e);
      }
    };

    const loadAmount = async () => {
      try {
        const { data: amount } = await axios.get(
          SERVER_URL + `/api/basket/amount?itemId=${item.id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("user-token"),
            },
          }
        );
        setAmount(amount);
      } catch (e) {
        console.log(e);
      }
    };

    const [amount, setAmount] = useState(1);

    const updateAmount = async (action) => {
      if (action === "+" && amount < 9999) {
        setAmount(amount + 1);
      } else if (action === "-" && amount > 1) {
        setAmount(amount - 1);
      }

      await axios.put(
        SERVER_URL +
          `/api/basket?itemId=${item.id}&amount=${
            action === "+" && amount < 9999
              ? amount + 1
              : amount > 1
              ? amount - 1
              : amount
          }`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        }
      );
    };

    const removeFromCart = async (item) => { 
      await actionCart("remove", item)
      .then(res => console.log(res))
      .then(() => setItemInBasket(false));      
    }

    return (
      <div>
        {isLoading ? (
          <div key={item.id} className={"loading"}>
            <div className="loader"></div>
          </div>
        ) : (
          itemInBasket &&
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
                {item.name}
              </Link>
              <div className={styles.itemActions}>
                <div className={styles.categories}>
                  <Link
                    onClick={() => setBasketModalVisible(false)}
                  >
                    {brand}
                  </Link>
                  <Link
                    onClick={() => setBasketModalVisible(false)}
                  >
                    {type}
                  </Link>
                </div>
                <div className={styles.amount}>
                  <div>
                    <button onClick={() => updateAmount("+")}>+</button>
                    <p>{amount}</p>
                    <button onClick={() => updateAmount("-")}>-</button>
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
  }
);
