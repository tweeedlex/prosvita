import React from 'react'
import { useNavigate } from "react-router-dom"

import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper"

import styles from "./css/Slider.module.css"

export const Slider = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles.slider}
      >
        <SwiperSlide className={styles.slide}>
          <div
            className={styles.slide__block}
            style={{ background: `url(${slide1}) 50% 30%/cover no-repeat`, width: "100%", height: "100%" }}
          >
            <h2 className={styles.h2}>Здобувай знання легше</h2>
            <button style={{color: "#000"}} onClick={() => navigate("/catalog")} className={styles.catalog_button}>Каталог</button>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div
            className={styles.slide__block}
            style={{ background: `url(${slide2}) 50% 50%/cover no-repeat`, width: "100%", height: "100%" }}
          >
            <h2 className={styles.h2}>Підготовка до зно</h2>
            <button style={{color: "#000"}} onClick={() => navigate("/catalog")} className={styles.catalog_button}>Каталог</button>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div
            className={styles.slide__block}
            style={{ background: `url(${slide3}) 50% 50%/cover no-repeat`, width: "100%", height: "100%" }}
          >
            <h2 className={styles.h2}>Актуальні посібники та підручники</h2>
            <button style={{color: "#000"}} onClick={() => navigate("/catalog")} className={styles.catalog_button}>Каталог</button>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div
            className={styles.slide__block}
            style={{ background: `url(${slide4}) 50% 50%/cover no-repeat`, width: "100%", height: "100%" }}
          >
            <h2 className={styles.h2}>Саморозвиток</h2>
            <button style={{color: "#000"}} onClick={() => navigate("/catalog")} className={styles.catalog_button}>Каталог</button>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <div
            className={styles.slide__block}
            style={{ background: `url(${slide5}) 0 0/cover no-repeat`, width: "100%", height: "100%" }}
          >
            <h2 className={styles.h2}>Найкращі репетитори</h2>
            <button style={{color: "#000"}} onClick={() => navigate("/catalog")} className={styles.catalog_button}>Каталог</button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
