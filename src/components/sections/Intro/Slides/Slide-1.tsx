"use client";
import Image from "next/image";
import { Button, Board } from "@/components";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";

export const IntroSlide1 = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className={styles.slide}>
        <h2 className={styles.slide__title}>{title}</h2>
        <p className={styles.slide__note}>
          Watch the video and get your first{" "}
          <Image
            src="/icons/coin-star-icon-white.svg"
            width={20}
            height={20}
            alt="jup"
          />{" "}
          JUP!
        </p>

        <div className={styles.slide__media}>
          <Image
            src="/images/slide-media-bg.png"
            fill
            alt="media"
            className={styles.slide__media_bg}
          />
          <div className={styles.slide__media_content}>
            <div className={styles.slide__media_icon}>
              <Image src="/images/jup-logo-alt.png" fill alt="jup" />
            </div>
            <h6 className={styles.slide__media_title}>Jup Welcome Video</h6>
            <Button
              variant="outlined"
              type="medium"
              color={cssVariables.green}
              onClick={onClick}
            >
              Watch
            </Button>
          </div>
        </div>

        <div className={styles.slide__boards}>
          <h6 className={styles.slide__boards_title}>
            Make things easier than ever!
          </h6>
          <div className={styles.slide__boards_list}>
            <Board
              icon="/icons/basket-icon.svg"
              title="Farm Real Coins, <br/> Buy Low and Sell High"
              text="Become an early adopter of profitable coins, all in one place."
            />
            <Board
              icon="/icons/wallet-icon.svg"
              title="No Wallet or <br/> Sign-Up Needed"
              text="Stay free on our Jup side and feel free to manage your money easily."
            />
          </div>
        </div>
      </div>
    </>
  );
};
