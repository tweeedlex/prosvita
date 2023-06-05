import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./animations.css";
import "./pagination.css";
import "./swiper.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserStore from "./store/UserStore";
import ItemStore from "./store/ItemStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      item: new ItemStore(),
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>
);
