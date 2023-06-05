import React, { useState, useContext } from "react";
import { Modal } from "./Modal";
import modalStyles from "./css/Modal.module.css";
import axios from "axios";
import { SERVER_URL } from "../config";
import logo from "../images/header/logo P.png";
import { Context } from "../index";

export const OrderForm = ({
  buyModalVisible,
  setBuyModalVisible,
  orderPrice,
  clearBasket,
}) => {
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendOnVerifiedEmail, setSendOnVerifiedEmail] = useState(false);
  const { user } = useContext(Context);

  const formEmailBody = (order) => {
    let email = `
    <!DOCTYPE html>
      <html>
        <body style="background-color: #12451e; margin: 0; padding: 20px; font-family: 'Montserrat', sans-serif; font-size: 20px; line-height: 1.5; color: #fff;">
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td>
                <header>
                  <a href="prosvita.netlify.app" style="text-align: center; display: block;">
                    <img src="${logo}" style="vertical-align: middle;" />
                    <span style="margin-left: -20px; color:#fff;">Просвіта</span>
                  </a>
                </header>
              </td>
            </tr>
            <tr>
              <td>
                <p style="text-align: center; color:#fff;">Добрий день! Ваше замовлення #${
                  order.id
                } прийняте. Дякуємо за покупку!</p>
                <p style="text-align: center; color:#fff;">Замовлені товари:</p>
                <hr />
                <table style="width: 100%;" cellpadding="0" cellspacing="0">
                  ${JSON.parse(localStorage.getItem("basket"))
                    .map(
                      (basketItem) => `
                      <tr>
                        <td style="width: 115px; height: 150px; background: url(${
                          basketItem.img
                        }) 100% 0px / contain no-repeat;"></td>
                        <td style="padding-left: 20px;">
                          <p style="color: #fff;">${basketItem.name}</p>
                          <div style="margin-top: 10px;">
                            <div style="margin-right: 30px;">
                              <p style="color: #fff;">${
                                basketItem.type.name
                              }</p>
                              <p style="color: #fff;">${
                                basketItem.brand.name
                              }</p>
                            </div>
                            <p style="margin-right: 30px; color: #fff;">Кількість: ${
                              basketItem.amount
                            } шт.</p>
                            <p style="margin-right: 30px; color: #fff;">Вартість: ${
                              basketItem.amount * basketItem.price
                            } грн (${basketItem.price} грн x ${
                        basketItem.amount
                      } шт.)</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 20px;">
                          <hr style="border-top: 1px solid #fff;">
                        </td>
                      </tr>
                    `
                    )
                    .join("")}
                </table>
                <footer style="margin: 20px; text-align: center;">До сплати: ${orderPrice}₴</footer>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    return email;
  };

  const buy = async () => {
    const items = JSON.parse(localStorage.getItem("basket")).map((item) => {
      return {
        id: item.id,
        amount: item.amount,
      };
    });

    const data = {
      items,
      telegram,
      email,
      phone,
    };

    const { data: order } = await axios.post(SERVER_URL + "/api/order", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user-token"),
      },
    });

    const emailBody = formEmailBody(order);
    window.Email.send({
      SecureToken: "ce8fa461-3977-4d13-8256-4c27e3542214",
      To: sendOnVerifiedEmail ? user.user.email : email,
      From: "prosvita.magazyn@gmail.com",
      Subject: "E-store Prosvita",
      Body: emailBody,
    }).then((message) => {
      if (message === "OK") {
        alert(
          `Ваше замовлення в обробці.\nНа вказану пошту було відправлено квитанцію про замовлення.\nПеревірте папку "Спам"`
        );
      } else {
        return alert("Помилка при відправці повідомлення на пошту");
      }
    });

    clearBasket();
  };

  const icon = document.querySelector(".icon");
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  if (icon) {
    tooltip.textContent = icon.dataset.tooltip;
    icon.appendChild(tooltip);
  }

  return (
    <Modal
      isOrder={true}
      zIndex={5}
      visible={buyModalVisible}
      setVisible={setBuyModalVisible}
    >
      <p
        style={{ fontSize: "24px", textAlign: "center", marginBottom: "10px" }}
      >
        Дані для покупки
      </p>
      <div className={modalStyles.formDefault} style={{ padding: "10px 0" }}>
        <input
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          type="text"
          placeholder="Telegram для зв'язку..."
          className={modalStyles.input}
        />
        <div className={modalStyles.required}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Телефон..."
            className={modalStyles.input + " " + modalStyles.fullWidth}
          />
        </div>
        <div className={modalStyles.required}>
          <input
            value={(sendOnVerifiedEmail ? user?.user?.email : "") || email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email..."
            className={
              modalStyles.input +
              " " +
              modalStyles.fullWidth +
              ` ${sendOnVerifiedEmail ? modalStyles.disabled : ""}`
            }
            readOnly={sendOnVerifiedEmail}
          />
        </div>
        <div>
          {user?.user?.emailVerified && (
            <div
              className={modalStyles.row}
              style={{ gap: "10px", marginTop: "10px" }}
            >
              <input
                type="checkbox"
                id="verified"
                value={sendOnVerifiedEmail}
                onChange={(e) => setSendOnVerifiedEmail(e.target.checked)}
                className={modalStyles.checkbox}
              />
              <label htmlFor="verified" className={modalStyles.label}>
                Відправити квитанцію на прив'язану пошту
              </label>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className={modalStyles.fwrap}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button onClick={() => buy()} className={modalStyles.action}>
            Замовити
          </button>
          <div
            className="icon"
            data-tooltip="Рекомендується використовувати пошту Gmail"
          >
            i
          </div>
        </div>
        <p>До сплати: {orderPrice}₴</p>
      </div>
    </Modal>
  );
};
