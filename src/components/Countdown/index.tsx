"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import { Button } from "@/components";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";
import { CounterStatusType } from "@/Types";
import { timeFormatter } from "@/helpers";
import { userAxios, headers } from "@/api";
import { gtagEvent } from "@/helpers";

export const CountdownBox = ({
  startTime,
  totalTime,
  status,
  userId,
  claim,
  className,
  initialPoints,
  prevPoints,
  startClick,
  claimClick,
  stopClick,
  resetClick,
  home,
}: {
  startTime: string;
  totalTime: number;
  status: CounterStatusType;
  userId: string;
  initialPoints: number;
  prevPoints: number;
  claim: boolean;
  className?: string;
  startClick?: () => void;
  claimClick?: (
    status: "READY" | "FARMING",
    points: number,
    userJupbotPoints: number
  ) => void;
  stopClick?: (val: number) => void;
  resetClick?: () => void;
  home?: boolean;
}) => {
  const [points, setPoints] = useState("0");
  const [percent, setPercent] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [processing, setProcessing] = useState(status);
  const [timeLeft, setTimeLeft] = useState(totalTime / 1000);

  const startCounter = useCallback(
    (endTimeInMinutes: number, start: string) => {
      const endTimeInSeconds = endTimeInMinutes * 60;
      const increment = endTimeInMinutes / endTimeInSeconds;
      let counter = 0;
      const startTime = start ? Date.parse(start) : Date.now();
      setCompleted(false);

      const updateCounter = () => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        counter = elapsedTime * increment;

        const counterSplit = String(Math.round(counter * 1000) / 1000).split(
          "."
        );
        const formattedCoins = parse(
          `${new Intl.NumberFormat("en-En")
            .format(Math.round(+counterSplit[0] * 1000) / 1000)
            .replace(".", ",")}${
            counterSplit[1] !== undefined ? `,<i>${counterSplit[1]}</i>` : ""
          }`
        );

        setPoints(formattedCoins as string);
        setTimeLeft(Math.max(totalTime / 1000 - elapsedTime, 0));
        setPercent(
          100 - Math.min((elapsedTime / (totalTime / 1000)) * 100, 100)
        );

        if (elapsedTime >= endTimeInSeconds) {
          const token = sessionStorage.getItem("token");
          userAxios
            .post(
              `/games/claim`,
              { telegramId: userId },
              { headers: { ...headers, "Authorization": token } }
            )
            .then((res) => {
              const {
                data: { clickerStatus, points, userJupbotPoints },
              } = res;
              setCompleted(true);
              setProcessing(clickerStatus);
              setPoints(String(points));
              claimClick && claimClick(clickerStatus, points, userJupbotPoints);
            });
        } else {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
    },
    [claimClick, totalTime, userId]
  );

  const start = useCallback(() => {
    startClick && startClick();
  }, [startClick]);

  useEffect(() => {
    setProcessing(status);
    if (status === "FARMING") {
      startCounter(totalTime / 1000 / 60, startTime);
    }
  }, [status, startCounter, totalTime, startTime]);

  return (
    <div className={`${styles.countdown} ${className ? className : ""}`}>
      {!claim && !home && (
        <div className={styles.countdown__header}>
          <Image
            src="/icons/coin-star-icon-white.svg"
            width={28}
            height={28}
            alt="points"
          />
          <span>{initialPoints}</span>
        </div>
      )}

      <div className={styles.countdown__body}>
        {processing === "READY" && !claim && (
          <Button
            type="large"
            variant="filled"
            color={cssVariables.green}
            onClick={() => {
              start();
              gtagEvent({
                action: "click",
                category: "button",
                label: "start_jupping",
                value: 1,
              });
            }}
          >
            Start Jupping
          </Button>
        )}
        {processing === "READY" && claim && (
          <Button
            type="large"
            variant="filled"
            color={cssVariables.green}
            onClick={resetClick && resetClick}
            className={styles.claim}
          >
            Claim{" "}
            <Image
              src="/icons/coin-star-icon.svg"
              width={20}
              height={20}
              alt="coins"
            />{" "}
            {points}
          </Button>
        )}
        {!home && (
          <div
            className={`${styles.countdown__bar} ${
              status === "READY" || completed
                ? styles.countdown__bar_hidden
                : ""
            }`}
          >
            <div className={styles.countdown__bar_info}>
              <span
                className={styles.countdown__bar_info_overlay}
                style={{ transform: `translateX(-${percent}%` }}
              ></span>
              <span className={styles.countdown__bar_info_title}>
                Jupping...
              </span>
              <span className={styles.countdown__bar_info_farmed}>
                {status === "FARMING" ? points : initialPoints}
              </span>
              <span className={styles.countdown__bar_info_passed}>
                {timeFormatter(timeLeft)}
              </span>
            </div>
            <div
              className={styles.countdown__bar_progress}
              style={{ transform: `translateX(-${percent}%` }}
            ></div>
            <div
              className={styles.countdown__bar_progress_lines}
              style={{ transform: `translateX(-${percent}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
