"use client";
import { useState, useEffect, useContext } from "react";
import AppContext from "@/providers/context";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { Board, Button } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import styles from "./style.module.scss";
import rewardsAnimation from "@/assets/json/rewards.json";

interface RewardsProps {
  tasks?: number;
}

export const Rewards = ({ tasks }: RewardsProps) => {
  const { dailyReward, unfinishedTasks } = useContext(AppContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className={styles.rewards}>
      <div className={styles.rewards__media}>
        <Lottie
          animationData={rewardsAnimation}
          className={styles.rewards__media_animation}
          loop={true}
        />
      </div>
      <h3 className={`${styles.rewards__title} ${!loading ? styles.show : ""}`}>
        Your Daily Rewards
      </h3>
      <div className={`${styles.rewards__list} ${!loading ? styles.show : ""}`}>
        <div className={styles.rewards__list_body}>
          <Board
            icon="/icons/coin-star-icon-white.svg"
            title="Jupbot Points"
            value={`+${dailyReward}`}
          />
          <Board
            icon="/icons/tasks-icon-white.svg"
            title="Earn Extra Rewards by Completing Tasks"
            value={`${unfinishedTasks}`}
          />
        </div>
        <div
          className={`${styles.rewards__list_footer} ${
            !loading ? styles.show : ""
          }`}
        >
          <p>Come back tomorrow to claim even more rewards!</p>
        </div>
      </div>
      <div
        className={`${styles.rewards__actions} ${!loading ? styles.show : ""}`}
      >
        <Button
          type="large"
          variant="filled"
          color={cssVariables.green}
          onClick={() => router.replace("/")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
