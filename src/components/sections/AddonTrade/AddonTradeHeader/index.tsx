"use client";
import { useState } from "react";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
// @ts-ignore
import MiddleEllipsis from "react-middle-ellipsis";
import { numberFormatter, numberFormatterSimple } from "@/helpers";
import styles from "./style.module.scss";

interface AddonTradeHeaderProps {
  alternative: boolean;
  token: {
    logo: string;
    name: string;
    symbol: string;
    address: string;
    price: number;
    priceChange24hPercent: number;
    mcap: number;
    volume: number;
    liquidity: number;
    holders: number;
  };
  chartCallback?: () => void;
}

export const AddonTradeHeader = ({
  alternative,
  token,
  chartCallback,
}: AddonTradeHeaderProps) => {
  const [theme, setTheme] = useState("light");
  const [showChart, setShowChart] = useState(false);

  return (
    <div className={styles.trade__header}>
      <div className={styles.trade__token}>
        <div
          className={`${styles.trade__token_top} ${
            alternative ? styles.trade__token_top_alt : ""
          }`}
        >
          <div className={styles.trade__token_avatar}>
            <Image src={token.logo} width={58} height={58} alt="avatar" />
          </div>
          <div className={styles.trade__token_info}>
            <div className={styles.trade__token_title}>
              {token.symbol} <span>{token.symbol}</span>
            </div>
            <div className={styles.trade__token_address}>
              <CopyToClipboard
                text={token.address}
                onCopy={() => {
                  toast.success("Address is copied!", {
                    id: "address_copy",
                  });
                }}
              >
                <button>
                  <Image
                    src="/icons/addon-copy-icon.svg"
                    width={18}
                    height={18}
                    alt="copy"
                  />
                </button>
              </CopyToClipboard>
              <div className={styles.trade__token_address_line}>
                <MiddleEllipsis>
                  <span>{token.address}</span>
                </MiddleEllipsis>
              </div>
              <Image
                src="/icons/addon-verify-icon.svg"
                width={18}
                height={18}
                alt="verify"
              />
            </div>
          </div>
          {!alternative && (
            <div
              className={`${styles.trade__token_switcher} ${
                theme === "dark" ? styles.trade__token_switcher_dark : ""
              }`}
              onClick={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            >
              <div className={styles.trade__token_switcher_state}>
                <Image
                  src="/icons/addon-moon-icon.svg"
                  width={18}
                  height={18}
                  alt="dark"
                />
              </div>
              <div className={styles.trade__token_switcher_state}>
                <Image
                  src="/icons/addon-sun-icon.svg"
                  width={18}
                  height={18}
                  alt="light"
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.trade__token_bottom}>
          <div className={styles.trade__token_price}>
            <h3>${token.price}</h3>
            <div
              className={`${styles.trade__token_price_direction} ${
                token.priceChange24hPercent > 0
                  ? styles.trade__token_price_direction_up
                  : token.priceChange24hPercent < 0
                  ? styles.trade__token_price_direction_down
                  : ""
              }`}
            >
              {token.priceChange24hPercent > 0 && (
                <Image
                  src="/icons/addon-price-up-icon.svg"
                  width={16}
                  height={16}
                  alt="price direction"
                />
              )}
              {token.priceChange24hPercent < 0 && (
                <Image
                  src="/icons/addon-price-down-icon.svg"
                  width={16}
                  height={16}
                  alt="price direction"
                />
              )}
              {numberFormatterSimple(token.priceChange24hPercent)}%
            </div>
          </div>
          <div className={styles.trade__token_stats}>
            <div>
              MCAP
              <span>${numberFormatter(token.mcap)}</span>
            </div>
            <div>
              Volume
              <span>{numberFormatter(token.volume)}</span>
            </div>
            <div>
              Liquidity
              <span>{numberFormatter(token.liquidity)}</span>
            </div>
            {!alternative && (
              <div>
                New holders 24h
                <span>+{numberFormatter(token.holders)}</span>
              </div>
            )}
            {alternative && (
              <button
                className={styles.trade__token_chart_btn}
                onClick={() => {
                  chartCallback && chartCallback();
                  setShowChart((prev) => !prev);
                }}
              >
                {showChart ? "Hide" : "Show"} Chart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
