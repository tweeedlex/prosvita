import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../../config";
import { Modal } from "../Modal";
import { OrderItemCard } from "../OrderItemCard";
import styles from "../../pages/css/OrdersPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Keyboard, Pagination, Navigation } from "swiper";

export const Order = ({ order }) => {
  const [itemsModalVisible, setItemsModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState(false);
  let sum = 0;

  let itemIds = order.items.map((item) => item?.id);

  const loadItems = async () => {
    const response = await axios.get(
      SERVER_URL + "/api/item?itemList=" + itemIds
    );
    return response.data;
  };

  const setOrderCompleted = async () => {
    await axios.put(
      SERVER_URL + "/api/order?id=" + order.id,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      }
    );
    setCompleted(true);
    setCompletedModalVisible(false);
  };

  const openModal = () => {
    setItemsModalVisible(true);
    loadItems().then((data) => setItems(data));
  };

  return (
    <div className={styles.order} key={order.id}>
      <div className={styles.orderInfo}>
        <p>ID замовлення: {order.id}</p>
        <p>{order.phone}</p>
        <p>{order.telegram}</p>
        <p>{order.email}</p>
        <div className={styles.orderButtons}>
          <button
            className={"button-transparent " + styles.orderButton}
            onClick={() => openModal()}
          >
            Замовлені товари
          </button>
          {order.completed || completed ? (
            <p>Виконано</p>
          ) : (
            <button
              className={"button-transparent " + styles.orderButton}
              onClick={() => setCompletedModalVisible(true)}
            >
              Позначити як виконане ✔
            </button>
          )}
        </div>
      </div>

      <div>
        <Modal visible={itemsModalVisible} setVisible={setItemsModalVisible}>
          <p className={styles.sum}>
            Сума замовлення: {items.forEach((item) => (sum += item.price))}
            {sum}₴
          </p>

          <Swiper
            slidesPerView={5}
            spaceBetween={30}
            keyboard={{
              enabled: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Keyboard, Pagination, Navigation]}
            className={styles.slider}
          >
            {items.map((item) => (
              <SwiperSlide className={styles.slide}>
                <OrderItemCard
                  key={item.id}
                  item={item}
                  amounts={order.items}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>

        <Modal
          visible={completedModalVisible}
          setVisible={setCompletedModalVisible}
        >
          <div className={styles.confirm}>
            <p>Ви впевнені, що це завмовлення виконане?</p>
            <div className={styles.buttons}>
              <button
                className="button-transparent"
                onClick={() => setOrderCompleted()}
              >
                Так
              </button>
              <button
                className="button-transparent"
                onClick={() => setCompletedModalVisible(false)}
              >
                Ні
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
