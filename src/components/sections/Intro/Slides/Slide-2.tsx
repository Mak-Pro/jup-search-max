"use client";
import { Board } from "@/components";
import styles from "./style.module.scss";

export const IntroSlide2 = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className={styles.slide}>
        <h2 className={styles.slide__title} style={{ marginBottom: 30 }}>
          {title}
        </h2>
        <div className={styles.slide__boards}>
          <div className={styles.slide__boards_list}>
            <Board
              icon="/icons/coin-star-icon-white.svg"
              title="Farm Jup Coins every day <br /> in just one click, nothing else needed"
              text="Make up to $120 monthly income with this bot."
            />
            <Board
              icon="/icons/solana-icon.svg"
              title="Trade popular Solana coins <br/> all in one app"
              text="Each transaction brings you profit with our Telegram bot (coming on September 1st)."
            />
            <Board
              icon="/icons/bell-icon.svg"
              title="Get the most effective trade alerts from TOP traders"
              text="Make your move after getting trade alerts."
            />
          </div>
        </div>
      </div>
    </>
  );
};
