import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./css/AdminPage.module.css";
import modalStyles from "../components/css/Modal.module.css";
import { SERVER_URL } from "../config";
import { Modal } from "../components/Modal";
import { CreateItem } from "../components/admin-components/CreateItem";
import { Delete } from "../components/admin-components/Delete";
import { separate } from "../utils/separate";

export const AdminPage = () => {
  const [headers, setHeaders] = useState(undefined);
  useEffect(() => {
    setHeaders({
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });
  }, []);

  // Create

  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);

  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadBrands();
    loadTypes();
  }, []);

  const loadBrands = async () => {
    await axios.get(SERVER_URL + "/api/brand").then((response) => {
      setBrands(response.data);
    });
  };

  const loadTypes = async () => {
    await axios.get(SERVER_URL + "/api/type").then((response) => {
      setTypes(response.data);
    });
  };

  const createType = async () => {
    try {
      if (type.length !== 0) {
        await axios.post(SERVER_URL + "/api/type", { name: type }, headers);
        alert("You created type " + type);
        setType("");
        loadTypes();
      }
    } catch (e) {
      console.log(e.response.data);
      alert("Invalid data");
    }
  };

  const createBrand = async () => {
    try {
      if (brand.length !== 0) {
        await axios.post(SERVER_URL + "/api/brand", { name: brand }, headers);
        alert("You created brand " + brand);
        setBrand("");
        loadBrands();
      }
    } catch (e) {
      console.log(e.response.data);
      alert("Invalid data");
    }
  };

  return (
    <div>
      <h2>Адмін-панель</h2>
      <div className={styles.buttons}>
        <button
          onClick={() => setIsTypeModalVisible(true)}
          className={styles.button}
        >
          Створити новий тип
        </button>
        <Modal visible={isTypeModalVisible} setVisible={setIsTypeModalVisible}>
          <div className={modalStyles.row + " " + styles.categoryRow}>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Назва..."
              className={modalStyles.input + " " + styles.categoryInput}
              type="text"
            />
            <button onClick={() => createType()} className={modalStyles.action}>
              Створити
            </button>
          </div>
        </Modal>

        <button
          onClick={() => setIsBrandModalVisible(true)}
          className={styles.button}
        >
          Створити нового викладача / заклад
        </button>
        <Modal
          visible={isBrandModalVisible}
          setVisible={setIsBrandModalVisible}
        >
          <div className={modalStyles.row + " " + styles.categoryRow}>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Назва..."
              className={modalStyles.input + " " + styles.categoryInput}
              type="text"
            />
            <button
              onClick={() => createBrand()}
              className={modalStyles.action}
            >
              Створити
            </button>
          </div>
        </Modal>

        <CreateItem types={types} brands={brands} />
        <Delete
          types={types}
          brands={brands}
          loadTypes={loadTypes}
          loadBrands={loadBrands}
          headers={headers}
        />
      </div>
    </div>
  );
};
