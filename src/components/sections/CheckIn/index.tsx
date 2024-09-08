"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup-animate";
import styles from "./style.module.scss";

export const CheckIn = ({ counter }: { counter: number }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div
      className={`${styles.checkin} ${!loading ? styles.checkin_loaded : ""}`}
    >
      <div className={styles.checkin__overlay}></div>
      <div className={styles.checkin__content}>
        <div className={styles.checkin__content_title}>
          <CountUp number={counter} startDelay={1} duration={0.05} />
        </div>
        <h5 className={styles.checkin__content_subtitle}>day check-in</h5>
        <p>Pop into the app every day and snag some awesome bonuses!</p>
      </div>
    </div>
  );
};
