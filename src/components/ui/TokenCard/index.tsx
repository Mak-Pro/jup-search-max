"use client";
import Image from "next/image";
import Link from "next/link";
import { Wrapper } from "@/components";
import { DynamicValue } from "../DynamicValue";
import styles from "./style.module.scss";
import { TokenProps } from "@/Types";
import { numberFormatter, priceFormatter } from "@/helpers";

export function TokenCard({
  address,
  fdv: mcap,
  imageUrl: logo,
  priceUsd,
  priceChange,
  volume,
  name,
  symbol,
  size,
}: TokenProps) {
  let bannerUrl = null;
  let cdnLogo = null;
  if (logo) {
    bannerUrl = logo;
  }
  if (logo && logo.includes("dd.")) {
    bannerUrl = null;
    bannerUrl = `${logo.slice(
      0,
      logo.indexOf(`.${logo.split(".").pop()}`)
    )}/header.${logo.split(".").pop()}`;
  }

  if (logo && logo.includes("cdn")) {
    const qualityLogo = logo.split("?");
    cdnLogo = qualityLogo[0].concat("?width=200&height=200&quality=90");
  }

  return (
    <div
      className={`${styles.token__card} ${
        size === "L"
          ? styles.token__card_L
          : size === "M"
          ? styles.token__card_M
          : styles.token__card_S
      }`}
    >
      <Link
        href={`https://jup.bot/${address}`}
        className={styles.token__card_link}
        target="_blank"
      >
        Link
      </Link>
      <Wrapper radius={20} className={styles.token__card_wrapper}>
        <div
          className={`${styles.token__card_inner} ${
            size === "L"
              ? styles.token__card_inner_L
              : size === "M"
              ? styles.token__card_inner_M
              : styles.token__card_inner_S
          }`}
        >
          {size === "L" && (
            <div
              className={`${styles.token__card_banner} ${
                !logo ? styles.token__card_banner_empty : ""
              }`}
            >
              <Image
                src={bannerUrl ? bannerUrl : "/images/token-logo-stub.png"}
                fill
                alt={name}
              />
            </div>
          )}

          <div className={styles.token__card_inner_left}>
            <div
              className={`${styles.token__card_logo} ${
                size === "M"
                  ? styles.token__card_logo_M
                  : size === "S"
                  ? styles.token__card_logo_S
                  : ""
              }`}
            >
              <Image
                src={
                  logo && logo.includes("dd.")
                    ? `${logo}?size=lg`
                    : cdnLogo
                    ? cdnLogo
                    : "/images/token-logo-stub.png"
                }
                width={size === "M" || size === "S" ? 80 : 120}
                height={size === "M" || size === "S" ? 80 : 120}
                alt="logo"
              />
            </div>
            <h5
              className={`${styles.token__card_title} ${
                size === "M"
                  ? styles.token__card_title_M
                  : size === "S"
                  ? styles.token__card_title_S
                  : ""
              }`}
            >
              {symbol}
            </h5>
            <div
              className={`${styles.token__card_values} ${
                size === "M"
                  ? styles.token__card_values_M
                  : size === "S"
                  ? styles.token__card_values_S
                  : ""
              }`}
            >
              <div>
                Vol <span>${numberFormatter(volume.h24)}</span>
              </div>
              <div>
                Price
                <span
                  className={styles.token__card_price}
                  dangerouslySetInnerHTML={{
                    __html: `$${priceFormatter(priceUsd)}`,
                  }}
                ></span>
              </div>
            </div>
          </div>
          <div className={styles.token__card_inner_right}>
            <div
              className={`${styles.token__card_info} ${
                size === "M"
                  ? styles.token__card_info_M
                  : size === "S"
                  ? styles.token__card_info_S
                  : ""
              }`}
            >
              <div className={styles.token__card_info_lead}>
                <i>MCAP</i>
                <span>${numberFormatter(mcap)}</span>
              </div>
              <div>
                5M <DynamicValue value={priceChange.m5} suffix="%" />
              </div>
              <div>
                1H <DynamicValue value={priceChange.h1} suffix="%" />
              </div>
              <div>
                24H <DynamicValue value={priceChange.h24} suffix="%" />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
