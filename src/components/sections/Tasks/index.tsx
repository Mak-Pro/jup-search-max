"use client";
import { useState, useEffect, useContext } from "react";
import { Board, Chip } from "@/components";
import { useTelegram } from "@/providers/telegram";
import { userAxios, headers } from "@/api";
import styles from "./style.module.scss";
import { TaskProps } from "@/Types";
import AppContext from "@/providers/context";

export const Tasks = () => {
  const { user } = useTelegram();
  const { loading, loadingHandler } = useContext(AppContext);
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [uncompleted, setUncompleted] = useState(null);

  useEffect(() => {
    loadingHandler(true);
    const token = sessionStorage.getItem("token");
    if (user) {
      userAxios
        .get(`/users/${user?.id}/tasks`, {
          headers: { ...headers, Authorization: token },
        })
        .then((res) => {
          const {
            data: { tasks },
          } = res;
          setTasks(tasks);
          setUncompleted(
            tasks.filter((task: TaskProps) => task.done !== true).length
          );
        })
        .catch((error) => console.log(error.message))
        .finally(() => {
          loadingHandler(false);
        });
    }
  }, [user, uncompleted]);

  return (
    <div className={styles.tasks}>
      <h3 className={styles.tasks__title}>
        Tasks <Chip>{uncompleted && uncompleted}</Chip>
      </h3>
      <p>Complete Tasks to Maximize Your Earnings</p>

      {tasks.length > 0 && (
        <div className={styles.tasks__list}>
          {tasks.map((task) => {
            const {
              taskId,
              type,
              description,
              reward,
              button,
              progress,
              done,
              rewardType,
            } = task;
            let icon = null;
            switch (type) {
              case "DAILY_REWARDS":
                icon = "/icons/DAILY_REWARDS.svg";
                break;
              case "REFERRALS_AMOUNT":
                icon = "/icons/REFERRALS_AMOUNT.svg";
                break;
              case "SOCIAL_NETWORK":
                icon = "/icons/SOCIAL_NETWORK.svg";
                break;
              case "CREATE_WALLET":
                icon = "/icons/CREATE_WALLET.svg";
                break;
              case "BUY_MEMECOIN":
                icon = "/icons/BUY_MEMECOIN.svg";
                break;
              case "MINE_REWARDS":
                icon = "/icons/MINE_REWARDS.svg";
                break;
              case "DEPOSIT":
                icon = "/icons/DEPOSIT.svg";
                break;
              case "ALL_TASKS":
                icon = "/icons/ALL_TASKS.svg";
                break;
              default:
                icon = "/icons/coin-star-icon.svg";
            }
            let percent = null;
            if (typeof progress === "object") {
              percent = progress
                ? (progress.current / progress.total) * 100
                : 0;
            }
            return (
              <Board
                key={taskId}
                icon={icon}
                title={description}
                text={`${
                  rewardType === "POINTS"
                    ? "+"
                    : rewardType === "MULTIPLICATOR"
                    ? "*"
                    : ""
                }${reward} JPP ${
                  description.includes("ALL tasks")
                    ? "x2 multiplier (single use)"
                    : ""
                }`}
                done={done}
                progress={progress}
                button={button ? { link: button.link } : null}
                taskId={taskId}
                onClickAlt={() => {
                  setUncompleted(null);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
