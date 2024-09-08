import Image from "next/image";
import styles from "./style.module.scss";
import { hideText, numberFormatterSimple } from "@/helpers";
import { AddonCoinProps } from "@/Types";
import { cssVariables } from "@/assets/styles/variables";

export const AddonCoin = ({
  avatar,
  name,
  ballance,
  hiddenPrice,
  active,
  selected,
  callBack,
  strategy,
}: AddonCoinProps) => {
  return (
    <div
      className={`${styles.coin} ${active ? styles.coin__active : ""} ${
        selected ? styles.coin__selected : ""
      }`}
      onClick={callBack ? () => callBack(name) : () => {}}
    >
      {strategy && (
        <span
          className={styles.coin_line}
          style={{
            backgroundColor:
              strategy === "Balanced"
                ? cssVariables.green40
                : strategy === "Careful"
                ? cssVariables.orange
                : strategy === "Degen"
                ? cssVariables.violet
                : cssVariables.gray40,
          }}
        ></span>
      )}
      <div
        className={`${styles.coin_avatar} ${
          selected ? styles.coin_avatar_selected : ""
        }`}
      >
        {selected ? (
          <Image
            src="/icons/addon-check-icon-black.svg"
            width={20}
            height={20}
            alt="checked"
          />
        ) : (
          <Image src={avatar} fill alt={name} />
        )}
      </div>
      <div className={styles.coin_info}>
        <h6 className={styles.coin_name}>{name}</h6>
        <div className={styles.coin_ballance}>
          <span>{numberFormatterSimple(ballance.usd)}</span>
        </div>
      </div>
      <div className={styles.coin_price}>
        <span className={styles.coin_price_ratio}>
          $
          {hiddenPrice
            ? numberFormatterSimple(ballance.usd)
            : hideText(numberFormatterSimple(ballance.usd), "•")}{" "}
          /{" "}
          {hiddenPrice
            ? ballance.ui.toFixed(4)
            : hideText(numberFormatterSimple(ballance.ui), "•")}{" "}
          <span style={{ textTransform: "uppercase" }}>{name}</span>
        </span>
      </div>
    </div>
  );
};
