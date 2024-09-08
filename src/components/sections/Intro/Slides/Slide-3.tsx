"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Countdown, { CountdownRenderProps } from "react-countdown";
import styles from "./style.module.scss";
import { Button } from "@/components";
import { cssVariables } from "@/assets/styles/variables";

export const IntroSlide3 = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) => {
  const targetDate = new Date("2024-09-06T19:00:00");
  const [isClient, setIsClient] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const timer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      setTimerEnd(true);
      return null;
    } else {
      return (
        <div className={styles.slide__counter_timer}>
          <div>
            <span>{days}</span> <span>Days</span>
          </div>
          <div>
            <span>{hours}</span> <span>Hours</span>
          </div>
          <div>
            <span>{minutes}</span> <span>Minutes</span>
          </div>
          {/* <div>
            <span>{seconds}</span> <span>Seconds</span>
          </div> */}
        </div>
      );
    }
  };

  return (
    <>
      <div className={styles.slide}>
        <div className={styles.slide__counter}>
          <Image
            src="/images/counter-bg.png"
            fill
            alt="counter"
            className={styles.slide__counter_bg}
          />
          <h2 className={styles.slide__title}>{title}</h2>
          {isClient && <Countdown date={targetDate} renderer={timer} />}

          <div className={styles.slide__counter_note}>
            <Image
              src="/icons/bell-icon-green.svg"
              width={20}
              height={20}
              alt="note"
            />
            Fri, 6 September, 19:00
          </div>
        </div>

        <div className={styles.slide__text}>
          <p>
            {
              "Soon, we’ll unlock the possibility for you to trade coins. Which means Lambo -> soon."
            }
          </p>
          <p>
            At the moment, <strong>you can make up to $120 in JUP</strong> every
            day simply by completing daily tasks.
          </p>
          <p>
            And don’t forget to invite your frens, and increase{" "}
            <strong>your income x2!</strong>
          </p>
        </div>

        <div className={styles.slide__actions}>
          <h5>See you on the other side!</h5>
          <div className={styles.slide__actions_buttons}>
            <Button variant="outlined" type="large" color={cssVariables.green}>
              <Link href="https://x.com/jupbot_sol">x</Link>
              <Image
                src="/icons/x-logo-green.svg"
                width={24}
                height={24}
                alt="x"
              />{" "}
              X.com
            </Button>
            <Button variant="outlined" type="large" color={cssVariables.green}>
              <Link href="https://t.me/jupfast_bot">telegram</Link>
              <Image
                src="/icons/telegram-logo-green.svg"
                width={24}
                height={24}
                alt="telegram"
              />{" "}
              Telegram
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
