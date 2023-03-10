import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config";
import modalStyles from "./css/Modal.module.css";
import { Modal } from "./Modal";

export const Registration = ({ isOpened, setIsOpened }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    try {
      if (password !== repeatedPassword) {
        return alert("Паролі не збігаються");
      }

      const response = await axios.post(SERVER_URL + "/api/user/registration", {
        email,
        password,
      });

      if (response.data.message) {
        alert(response.data.message + `\nАвторизуйтесь через "Вхід"`);
      }
    } catch (e) {
      let message = "";
      for (let error of e.response.data.errors) {
        message += `${
          error.param.charAt(0).toUpperCase() + error.param.slice(1)
        } is invalid\n`;
      }
      alert(
        "Електронна пошта має бути корректною\nПароль має бути від 8 до 16 символів\n\n" +
          message
      );
    }
  };

  return (
    <Modal zIndex={12} visible={isOpened} setVisible={setIsOpened}>
      <form className={modalStyles.formDefault}>
        <input
          placeholder="Електронна пошта"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          className={modalStyles.input}
        />
        <input
          placeholder="Пароль"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
          className={modalStyles.input}
        />
        <input
          placeholder="Повтор паролю"
          onChange={(e) => {
            setRepeatedPassword(e.target.value);
          }}
          value={repeatedPassword}
          type="password"
          className={modalStyles.input}
        />
        <button className={modalStyles.action} onClick={(e) => register(e)}>
          Зареєструватися
        </button>
      </form>
    </Modal>
  );
};
