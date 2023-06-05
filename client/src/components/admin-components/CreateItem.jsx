import React, { useState } from "react";
import styles from "../../pages/css/AdminPage.module.css";
import modalStyles from "../css/Modal.module.css";
import { Modal } from "../Modal";
import axios from "axios";
import { SERVER_URL } from "../../config";
import { separate } from "../../utils/separate";

export const CreateItem = ({ types, brands }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [itemBrand, setItemBrand] = useState("");
  const [itemType, setItemType] = useState("");

  const [itemInfo, setItemInfo] = useState([]);
  const [infoField, setInfoField] = useState("");
  const [infoValue, setInfoValue] = useState("");

  const addField = () => {
    if (infoField.length && infoValue.length) {
      setItemInfo([...itemInfo, { field: infoField, value: infoValue }]);

      setInfoField("");
      setInfoValue("");
    }
  };

  const clearItemInputs = () => {
    setItemName("");
    setItemPrice("");
    setItemImage("");
    setItemInfo([]);
  };

  const createItem = async () => {
    try {
      if (!itemName.length || !itemBrand || !itemType) {
        return alert("Enter correct data");
      }

      const body = new FormData();
      body.append("name", itemName);
      body.append("price", itemPrice);
      body.append("info", JSON.stringify(itemInfo));
      body.append("img", itemImage);
      body.append("typeId", itemType);
      body.append("brandId", itemBrand);

      const response = await axios.post(SERVER_URL + "/api/item", body, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
          "Content-Type": "multipart/form-data",
        },
      });
      alert("You created item");
      clearItemInputs();
    } catch (e) {
      console.log(e);
      alert("Invalid data");
    }
  };

  const [itemModalVisible, setItemModalVisible] = useState(false);

  return (
    <div className={styles.createItem}>
      <button
        className={styles.button}
        onClick={() => setItemModalVisible(true)}
      >
        Створити новий товар
      </button>
      <Modal visible={itemModalVisible} setVisible={setItemModalVisible}>
        <div className={modalStyles.formDefault}>
          <div className={modalStyles.required}>
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Назва нового товару..."
              type="text"
              className={modalStyles.input + " " + modalStyles.fullWidth}
            />
          </div>

          <div className={modalStyles.required}>
            <input
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Ціна..."
              type="text"
              className={modalStyles.input + " " + modalStyles.fullWidth}
            />
          </div>
          <input
            value={itemImage}
            onChange={(e) => setItemImage(e.target.value)}
            placeholder="Посилання на зображення..."
            type="text"
            className={modalStyles.input + " " + modalStyles.fullWidth}
          />

          <div
            className={modalStyles.selectWrapper + " " + modalStyles.required}
          >
            <select
              onChange={(e) => setItemType(separate(e.target.value))}
              className={modalStyles.select + " " + modalStyles.fullWidth}
              name="type"
            >
              <option value="">Оберіть тип</option>
              {types.map((type) => (
                <option key={type.id} className={styles.option}>
                  {type.name} {type.id}
                </option>
              ))}
            </select>
            <div className={modalStyles.selectCheck}></div>
          </div>
          <div
            className={modalStyles.selectWrapper + " " + modalStyles.required}
          >
            <select
              onChange={(e) => setItemBrand(separate(e.target.value))}
              className={modalStyles.select + " " + modalStyles.fullWidth} 
              name="brand"
            >
              <option value="">Оберіть викладача / заклад</option>
              {brands.map((brand) => (
                <option key={brand.id} className={styles.option}>
                  {brand.name} {brand.id}
                </option>
              ))}
            </select>
            <div className={modalStyles.selectCheck}></div>
          </div>
          <div className={styles.infoField}>
            <input
              placeholder="Поле"
              value={infoField}
              onChange={(e) => setInfoField(e.target.value)}
              type="text"
              className={modalStyles.input}
            />
            <input
              placeholder="Значення"
              value={infoValue}
              onChange={(e) => setInfoValue(e.target.value)}
              type="text"
              className={modalStyles.input}
            />
          </div>
          <button className={styles.addField} onClick={() => addField()}>
            Додати поле інформації
          </button>
          <div className={styles.info}>
            {itemInfo.map((item) => (
              <p key={item.field}>
                {item.field}: {item.value}
              </p>
            ))}
          </div>

          <button onClick={() => createItem()} className={modalStyles.action}>
            Створити
          </button> 
        </div>
      </Modal>
    </div>
  );
};
