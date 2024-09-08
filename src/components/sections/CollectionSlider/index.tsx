"use client";
import Image from "next/image";
import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { TokenCard, DynamicValue } from "@/components";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./style.module.scss";
import { CollecttionProps } from "@/Types";
import { numberFormatter } from "@/helpers";
import { TokenCardSize } from "@/Types";

export function CollectionSlider({
  name,
  size,
  totalPriceChange,
  description,
  totalVolume,
  tokens,
  hideHeaderInfo,
}: CollecttionProps) {
  const id = useId().replace(/:/g, "");

  return (
    <section className={styles.collection}>
      <div className={`${styles.collection__inner} container`}>
        <div className={styles.collection__header}>
          <h3 className={styles.collection__title}>{name}</h3>
          {!hideHeaderInfo && (
            <div className={styles.collection__header_info}>
              <div>Total volume</div>
              <div>
                5m:{" "}
                <span>
                  $
                  {totalVolume && totalVolume.m5
                    ? numberFormatter(totalVolume.m5)
                    : "0"}
                </span>
              </div>
              <div>
                1h:{" "}
                <span>
                  $
                  {totalVolume && totalVolume.h1
                    ? numberFormatter(totalVolume!.h1)
                    : "0"}
                </span>
              </div>
              <div>
                6h:{" "}
                <span>
                  $
                  {totalVolume && totalVolume.h6
                    ? numberFormatter(totalVolume!.h6)
                    : "0"}
                </span>
              </div>
              <div>
                24h:{" "}
                <span>
                  $
                  {totalVolume && totalVolume.h24
                    ? numberFormatter(totalVolume!.h24)
                    : "0"}
                </span>
              </div>
            </div>
          )}
          {description && (
            <div className={styles.collection__description}>{description}</div>
          )}
        </div>

        {tokens && tokens.length > 0 && (
          <>
            <div className={styles.collection__body}>
              <Swiper
                className={styles.collection__slider}
                modules={[Navigation, FreeMode]}
                slidesPerView={"auto"}
                spaceBetween={18}
                freeMode={{
                  enabled: true,
                  sticky: false,
                  momentum: true,
                  momentumRatio: 0.5,
                  momentumBounce: false,
                }}
                navigation={{
                  prevEl: `#prev-${id}`,
                  nextEl: `#next-${id}`,
                }}
                breakpoints={{
                  0: { spaceBetween: 12 },
                  1200: { spaceBetween: 18 },
                }}
              >
                {tokens.map((token) => (
                  <SwiperSlide key={token.address} style={{ width: "auto" }}>
                    <TokenCard {...token} size={size as TokenCardSize} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className={styles.collection__footer}>
              <div className={styles.collection__slider_controls}>
                <button type="button" id={`prev-${id}`}>
                  <Image
                    src="/icons/slider-control-angle-left.svg"
                    width={24}
                    height={24}
                    alt="prev"
                  />
                </button>
                <button type="button" id={`next-${id}`}>
                  <Image
                    src="/icons/slider-control-angle-right.svg"
                    width={24}
                    height={24}
                    alt="next"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
