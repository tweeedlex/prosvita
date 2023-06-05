import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "./Modal";
import modalStyles from "./css/Modal.module.css";
import { Context } from "../index";
import { login } from "../http/userAPI";
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = observer(({ isOpened, setIsOpened }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useContext(Context);

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const credentials = await signInWithEmailAndPassword(
        user.auth,
        email,
        password
      );
      const data = await login(credentials.user.uid, email);
      user.setRole(data.role);
      setIsOpened(false);
      setEmail("");
      setPassword("");
    } catch (e) {
      console.log(e);
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
        <button className={modalStyles.action} onClick={(e) => loginHandler(e)}>
          Вхід
        </button>
      </form>
    </Modal>
  );
});
