import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import actionCart from "../utils/actionCart";
import axios from "axios";
import { SERVER_URL } from "../config";

import styles from "./css/Item.module.css";
import cartImage from "../images/catalog/cart.png";
import checkImage from "../images/catalog/check.png";

export const Item = observer(({ item, classN }) => {
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [itemInBasket, setItemInBasket] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user-token")?.length) {
      setIsAuth(true);
    }

    loadItem().then(() => setIsLoading(false));
    if (location.pathname === "/basket") {
      setItemInBasket(true);
    }
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
      setItemInBasket(itemInfo.itemInBasket);
      setBrand(itemInfo.brand);
      setType(itemInfo.type);
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = async (item) => {
    await actionCart("add", item)
      .then((e) => (e ? alert("Авторизуйтесь") : null))
      .then(() => setItemInBasket(true));
  };
  const removeFromCart = async (item) =>
    await actionCart("remove", item).then(() => setItemInBasket(false));

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
            {isAuth ? (
              itemInBasket ? (
                <button className={styles.inCart} onClick={() => removeFromCart(item)}>
                  <img src={cartImage} alt="cart" />
                </button>
              ) : (
                <button onClick={() => addToCart(item)}>
                  <img src={cartImage} alt="cart" />
                </button>
              )
            ) : (
              <button onClick={() => alert("Авторизуйтесь")}>
                <img src={cartImage} alt="cart" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
});
