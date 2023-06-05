import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";

import styles from "./css/ItemPage.module.css";
import cartImage from "../images/catalog/cart.png";
import { Context } from "../index";

export const ItemPage = ({ isAdmin }) => {
  const location = useLocation();
  const id = +location.pathname.split("/")[2];

  const [item, setItem] = useState({});
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

  const [itemInBasket, setItemInBasket] = useState(false);

  const { user } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    loadItem();
    if (location.pathname === "/basket") {
      setItemInBasket(true);
    }

    if (localStorage.getItem("basket")) {
      const basket = JSON.parse(localStorage.getItem("basket"));
      if (basket.find((basketItem) => basketItem.id === id)) {
        setItemInBasket(true);
      }
    }
  }, []);

  useEffect(() => {
    if (rating) {
      rateItem();
    }
  }, [rating]);

  const rateItem = async () => {
    if (!user.user?.email) {
      return alert("Авторизуйтесь для оцінки товару");
    }
    try {
      await axios.post(
        SERVER_URL + "/api/item/rate",

        {
          itemId: item.id,
          rating: +rating,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        }
      );
      loadItem();
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const loadItem = async () => {
    const response = await axios.get(SERVER_URL + "/api/item/" + id);
    setItem(response.data);

    try {
      const { data: itemInfo } = await axios.get(
        SERVER_URL + `/api/item/itemInfo?itemId=${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        }
      );
      setAverageRating(Math.round(itemInfo.rating * 10) / 10);
      setRatingsCount(itemInfo.ratingsCount);
      setBrand(itemInfo.brand);
      setType(itemInfo.type);
    } catch (e) {
      console.log(e);
    }
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

  const deleteItem = async () => {
    try {
      await axios.delete(SERVER_URL + "/api/item/" + item.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      });
      alert("Ви видалили цей товар");
      navigate(-1);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  return (
    <div className={styles.itemPage}>
      <div className={styles.container + " item__container"}>
        <div
          className={styles.image}
          style={{ background: `url(${item.img}) 50% 0/contain no-repeat` }}
        ></div>
        <div className={styles.content}>
          <h2 className={styles.h2}>{item.name}</h2>
          <div className={styles.shortInfo}>
            <div className={styles.leftColumn}>
              <Link>
                {brand.length < 18 ? brand : `${brand.substr(0, 18)}..`}
              </Link>
              <Link>{type.length < 18 ? type : `${type.substr(0, 18)}..`}</Link>
              <p className={styles.id}>Ідентифікатор: {item.id}</p>
            </div>
            <div className={styles.centralColumn}>
              <div className={styles.stars}>
                <div className={styles.rating}>
                  <input
                    type="radio"
                    name="rating"
                    value="5"
                    id="5"
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <label for="5">☆</label>
                  <input
                    type="radio"
                    name="rating"
                    value="4"
                    id="4"
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <label for="4">☆</label>
                  <input
                    type="radio"
                    name="rating"
                    value="3"
                    id="3"
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <label for="3">☆</label>
                  <input
                    type="radio"
                    name="rating"
                    value="2"
                    id="2"
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <label for="2">☆</label>
                  <input
                    type="radio"
                    name="rating"
                    value="1"
                    id="1"
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <label for="1">☆</label>
                </div>
              </div>
              <div className={styles.marks}>
                <p>{averageRating ? `${averageRating} / 5` : ""}</p>
                <p>{ratingsCount} оцінок</p>
              </div>
            </div>
            <div className={styles.buy}>
              <p className={styles.price}>{item.price}₴</p>

              <button
                className={itemInBasket ? styles.inCart : ""}
                onClick={() => toggleInCart()}
              >
                <img src={cartImage} alt="cart" />
              </button>
            </div>
          </div>

          {isAdmin && (
            <button onClick={() => deleteItem()} className={styles.delete}>
              Видалити товар
            </button>
          )}
          <div>
            {item.info !== "[]" ? (
              <div>
                <h4 className={styles.h4}>Інформація</h4>
                <div className={styles.info}>
                  {item.info ? (
                    JSON.parse(item.info).map((item) => (
                      <p key={item.field} className={styles.pair}>
                        <span>{item.field}:</span>
                        <span>{item.value}</span>
                      </p>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
