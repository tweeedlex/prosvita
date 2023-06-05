import React, { useContext, useEffect, useState } from "react";
import { Brands } from "../components/Brands";
import { Item } from "../components/Item";
import axios from "axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SERVER_URL } from "../config";
import { Types } from "../components/Types";
import { useLocation } from "react-router-dom";
import searchIcon from "../images/header/search.png";
import crossIcon from "../images/close.png";

import styles from "./css/MainPage.module.css";
import { fetchItems } from "../http/itemAPI";

import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { countAndSetPages } from "../utils/countAndSetPages";

export const MainPage = observer(() => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const { item } = useContext(Context);

  const location = useLocation();
  const hash = location.hash.substring(1);

  useEffect(() => {
    if (hash) {
      item.setSelectedType({ id: +hash });
    }
  }, [hash, item]);

  useEffect(() => {
    fetchItems(
      item.selectedType?.id,
      item.selectedBrand?.id,
      item.page,
      24
    ).then((data) => {
      item.setItems(data.rows);
      item.setTotalCount(data.count);
      setIsLoading(false);
      countAndSetPages(+data.count, setPages, 24);
    });
  }, [item.page, item.selectedType, item.selectedBrand]);

  const resetFilters = () => {
    fetchItems(
      item.selectedType?.id,
      item.selectedBrand?.id,
      item.page,
      24
    ).then((data) => {
      item.setItems(data.rows);
      item.setTotalCount(data.count);
    });
    item.setSelectedBrand(null);
    item.setSelectedType(null);
    setSearchValue("");
    window.location.hash = "";
  };

  const changePage = async (page) => {
    setSelectedPage(page);
    const response = await axios.get(
      `${SERVER_URL}/api/item?page=${page}&limit=24` +
        (item.selectedBrand?.id ? `&brandId=${item?.selectedBrand?.id}` : "") +
        (item.selectedType?.id ? `&typeId=${item?.selectedType?.id}` : "")
    );
    item.setItems(response.data.rows);
    window.scroll(0, 0);
  };

  const [areFiltersActive, setAreFiltersActive] = useState(false);

  let body = document.querySelector("body");

  const toggleFilters = () => {
    if (areFiltersActive) {
      return setAreFiltersActive(false);
    }
    setAreFiltersActive(true);
  };

  const search = async () => {
    const response = await axios.get(`
        ${SERVER_URL}/api/item/search?item=${searchValue}
      `);
    item.setItems(response.data?.rows);
    item.setTotalCount(response.data?.count);
    countAndSetPages(response.data?.count, setPages, 24);
  };

  return (
    <div className={styles.catalog}>
      <button
        className={styles.toggleFilters + " button-transparent"}
        onClick={toggleFilters}
      >
        Фільтрація
      </button>
      <div className={"catalog__container " + styles.container}>
        <div
          className={
            styles.filters + " " + (areFiltersActive ? styles.visible : "")
          }
          onClick={(e) => (areFiltersActive ? e.stopPropagation() : null)}
        >
          <button className={styles.closeFilters}>
            <img
              src={crossIcon}
              alt="Close"
              width={24}
              onClick={() => setAreFiltersActive(false)}
            />
          </button>
          <div className={styles.search}>
            <input
              placeholder="Пошук товарів..."
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button>
              <img src={searchIcon} alt="Search" onClick={() => search()} />
            </button>
          </div>
          <div className={styles.category}>
            <h3>Типи</h3>
            <Types
              setSearchValue={setSearchValue}
              setSelectedPage={setSelectedPage}
              setPages={setPages}
            />
          </div>
          <div className={styles.category}>
            <h3>Викладачі</h3>
            <Brands
              setSearchValue={setSearchValue}
              setSelectedPage={setSelectedPage}
              setPages={setPages}
            />
          </div>
          <button onClick={() => resetFilters()} className={styles.reset}>
            Скинути
          </button>
        </div>
        <div className={styles.items}>
          <div className={styles.cards}>
            {isLoading ? (
              <div className={styles.loading}>
                Триває завантаження даних...
                <br />В окремих випадках це може зайняти декілька хвилин.
                <div className="loading"></div>
              </div>
            ) : item.items?.length ? (
              <TransitionGroup className={styles.cards}>
                {item.items.map((item) => (
                  <CSSTransition key={item.id} timeout={400} classNames="item">
                    <Item item={item} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            ) : (
              <p>Відстуні товари за Вашими фільтрами</p>
            )}
          </div>

          <ul className="pagination">
            {pages.length > 1 &&
              pages.map((page) => (
                <li
                  key={page}
                  className={`page ${page === selectedPage ? "selected" : ""}`}
                >
                  <button onClick={() => changePage(page)}>{page}</button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
