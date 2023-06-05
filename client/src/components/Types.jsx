import React, { useContext } from "react";
import {Context} from "../index"

import styles from "./css/Category.module.css";
import { observer } from "mobx-react-lite";

export const Types = observer(({
  setSelectedPage,
  setSearchValue
}) => {
  const { item } = useContext(Context);

  const selectType = async (id) => {
    item.setSelectedType({id});
    setSelectedPage(1);
    setSearchValue("");
  };

  return (
    <ul className={styles.items}>
      {item.types.map((type) => (
        <li
          key={type.id}
          className={`${styles.item} ${
            type.id === item.selectedType?.id ? styles.selected : ""
          }`}
        >
          <button
            onClick={() => selectType(type.id)}
          >
            {type.name.length < 20 ? type.name : `${type.name.substr(0, 20)}..`}
          </button>
        </li>
      ))}
    </ul>
  );
});
