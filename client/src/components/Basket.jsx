import React, { useEffect, useState } from "react";
import styles from "./css/Basket.module.css";
import { BasketItem } from "./BasketItem";
import { Modal } from "./Modal";
import { OrderForm } from "./OrderForm";
import { Context } from "../index";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

export const Basket = observer(({ isOpened, setIsOpened }) => {
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  const { item } = useContext(Context);

  useEffect(() => {
    item.setBasket(JSON.parse(localStorage.getItem("basket")));
  }, [isOpened]);

  const [orderPrice, setOrderPrice] = useState(0);

  const prepareToBuy = async () => {
    setBuyModalVisible(true);

    let result = 0;
    const basket = JSON.parse(localStorage.getItem("basket"));

    basket.forEach((item) => {
      result += item.price * item.amount;
    });

    setOrderPrice(result);
  };

  const clearBasket = async () => {
    item.setBasket([]);
    localStorage.setItem("basket", JSON.stringify([]));
  };

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <div
        className={
          styles.basket + " " + (item.basket?.length !== 0 && styles.oxh)
        }
      >
        <h2>Кошик</h2>
        {item.basket && item.basket.length !== 0 && (
          <div>
            <div className={styles.buttons}>
              <button
                className="button-transparent "
                onClick={() => clearBasket()}
              >
                Очистити
              </button>
              <button
                className="button-transparent "
                onClick={() => prepareToBuy()}
              >
                Замовити
              </button>
            </div>
            <OrderForm
              buyModalVisible={buyModalVisible}
              setBuyModalVisible={setBuyModalVisible}
              orderPrice={orderPrice}
              clearBasket={clearBasket}
            />
          </div>
        )}
        <div className={styles.items}>
          {item.basket && item.basket?.length !== 0 ? (
            item.basket.map((item) => (
              <BasketItem
                setBasketModalVisible={setIsOpened}
                key={item.id}
                item={item}
              />
            ))
          ) : (
            <p className={styles.p}>Ваш кошик пустий</p>
          )}
        </div>
      </div>
    </Modal>
  );
});
