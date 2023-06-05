import axios from "axios";
import React, { useState } from "react";
import { SERVER_URL } from "../../config";
import styles from "../../pages/css/AdminPage.module.css";
import modalStyles from "../css/Modal.module.css";
import { separate } from "../../utils/separate";
import { Modal } from "../Modal";

export const Delete = ({ types, brands, loadTypes, loadBrands, headers }) => {
  const [typeToDelete, setTypeToDelete] = useState(-1);
  const [brandToDelete, setBrandToDelete] = useState(-1);
  const [itemTypeToDelete, setItemTypeToDelete] = useState(-1);
  const [itemBrandToDelete, setItemBrandToDelete] = useState(-1);
  const [itemToDelete, setItemToDelete] = useState(0);

  const deleteType = async () => {
    try {
      await axios.delete(SERVER_URL + "/api/type/" + typeToDelete, headers);
      loadTypes();
      alert("You deleted this type");
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const deleteBrand = async () => {
    try {
      await axios.delete(SERVER_URL + "/api/brand/" + brandToDelete, headers);
      loadBrands();
      alert("You deleted this brand");
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const deleteItemById = async () => {
    try {
      await axios.delete(SERVER_URL + "/api/item/" + itemToDelete, headers);
      alert("You deleted item with id " + itemToDelete);
    } catch (e) {
      console.log(e.response.data);
    }
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  return (
    <div>
      <div className={styles.delete}>
        <button
          className={styles.button}
          onClick={() => setDeleteModalVisible(true)}
        >
          Видалення
        </button>
        <Modal visible={deleteModalVisible} setVisible={setDeleteModalVisible}>
          <div className={styles.deleteModal}>
            <div className={modalStyles.row}>
              <select
                onChange={(e) => setTypeToDelete(separate(e.target.value))}
                className={modalStyles.select}
                name="deleteType"
              >
                <option value="">Оберіть тип</option>
                {types.map((type) => (
                  <option key={type.id} className={styles.option}>
                    {type.name} {type.id}
                  </option>
                ))}
              </select>
              <div className={modalStyles.selectCheck}></div>
              <button
                className={modalStyles.action}
                onClick={() => deleteType()}
              >
                Видалити
              </button>
            </div>
            <div className={modalStyles.row}>
              <select
                onChange={(e) => setBrandToDelete(separate(e.target.value))}
                className={modalStyles.select}
                name="deleteBrand"
              >
                <option value="">Оберіть викладача / заклад</option>
                {brands.map((brand) => (
                  <option key={brand.id} className={styles.option}>
                    {brand.name} {brand.id}
                  </option>
                ))}
              </select>
              <div className={modalStyles.selectCheck}></div>
              <button
                className={modalStyles.action}
                onClick={() => deleteBrand()}
              >
                Видалити
              </button>
            </div>
            <div className={modalStyles.row}>
              <input
                value={itemToDelete}
                onChange={(e) => setItemToDelete(e.target.value)}
                className={modalStyles.input}
                placeholder="Введіть ID товару..."
              />
              <button
                onClick={() => deleteItemById()}
                className={modalStyles.action}
              >
                Видалити
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
