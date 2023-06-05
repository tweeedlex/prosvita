import React, { useContext } from "react";
import { Context } from "../index";

import styles from "./css/Category.module.css";
import { observer } from "mobx-react-lite";

export const Brands = observer(({ setSelectedPage, setSearchValue }) => {
  const { item } = useContext(Context);

  const selectBrand = async (id) => {
    item.setSelectedBrand({ id });
    setSelectedPage(1);
    setSearchValue("");
  };

  return (
    <ul className={styles.items}>
      {item.brands.map((brand) => (
        <li
          key={brand.id}
          className={`${styles.item} ${
            brand.id === item.selectedBrand?.id ? styles.selected : ""
          }`}
        >
          <button onClick={() => selectBrand(brand.id)}>
            {brand.name.length < 33
              ? brand.name
              : `${brand.name.substr(0, 27)}..`}
          </button>
        </li>
      ))}
    </ul>
  );
});
