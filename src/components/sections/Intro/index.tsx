"use client";
import { useId, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { IntroSlide1 } from "./Slides/Slide-1";
import { IntroSlide2 } from "./Slides/Slide-2";
import { IntroSlide3 } from "./Slides/Slide-3";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";

export const Intro = () => {
  const id = useId().replace(/:/g, "");
  const swiperRef = useRef<any>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [media, setMedia] = useState(false);

  const handleClick = () => {
    setMedia(false);
    setTimeout(() => {
      setMedia(true);
    }, 0);
  };

  return (
    <>
      <div className={styles.intro}>
        <Swiper
          className={`${styles.intro__slider}`}
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={15}
          pagination={{
            dynamicBullets: false,
            el: `#pagination-${id}`,
            type: "bullets",
          }}
          loop={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setSlideIndex(swiper.realIndex);
          }}
        >
          <SwiperSlide>
            <IntroSlide1 title="Welcome, Juppie" onClick={handleClick} />
          </SwiperSlide>
          <SwiperSlide>
            <IntroSlide2 title="What is JupTrade?" />
          </SwiperSlide>
          <SwiperSlide>
            <IntroSlide3 title="Wen Lambo?" />
          </SwiperSlide>
        </Swiper>
        <div className={styles.intro__slider_pagination}>
          <div id={`pagination-${id}`}></div>
        </div>
        <div className={styles.intro__actions}>
          <Button
            variant="filled"
            color={cssVariables.green}
            type="large"
            onClick={() => {
              swiperRef && swiperRef.current && swiperRef.current.slideNext();
            }}
          >
            {slideIndex === 2 && <Link href="/register">link</Link>}
            {slideIndex === 0
              ? "I’m In! Claim"
              : slideIndex === 1
              ? "Got It! Claim"
              : "Let Me In! Claim"}{" "}
            <Image
              src="/icons/coin-star-icon.svg"
              width={20}
              height={20}
              alt="star"
            />{" "}
            {slideIndex === 0 ? "30" : slideIndex === 1 ? "10" : "20"}
          </Button>
        </div>
      </div>
      {media && (
        <div className={styles.media__modal}>
          <button
            className={styles.media__modal_close}
            onClick={() => setMedia(false)}
          >
            <Image
              src="/icons/close-icon.svg"
              width={20}
              height={20}
              alt="close"
            />
          </button>
          <div className={styles.media__modal_content}>
            <img
              src={media ? "/images/onboarding.gif" : ""}
              width={518}
              height={292}
              alt="movie"
            />
          </div>
        </div>
      )}
    </>
  );
};
