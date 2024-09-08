"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { useTelegram } from "@/providers/telegram";
import { Button } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import styles from "./style.module.scss";
import { BoardProps } from "@/Types";
import { userAxios } from "@/api";

export const Board = ({
  icon,
  avatar,
  title,
  text,
  value,
  button,
  done,
  progress,
  taskId,
  onClick,
  onClickAlt,
}: BoardProps) => {
  const { user } = useTelegram();
  const [statusDone, setStatusDone] = useState(false);

  const handleCompleteTask = () => {
    const token = sessionStorage.getItem("token");
    if (user && button?.link && taskId) {
      userAxios
        .post(
          `/users/${user?.id}/tasks/complete`,
          { taskId },
          {
            headers: {
              "Authorization": token,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setStatusDone(true);
            onClickAlt && onClickAlt();
          }
        })
        .catch((error) => console.log(error.message));
    }
  };

  return (
    <div
      className={`${styles.board} ${onClick ? styles.board__interactive : ""}`}
      onClick={onClick ? onClick : () => {}}
    >
      <div className={styles.board__left}>
        {(icon || avatar) && (
          <div
            className={`${styles.board__media} ${
              icon
                ? styles.board__media_icon
                : avatar
                ? styles.board__media_avatar
                : ""
            }`}
          >
            {icon && (
              <Image src={`${icon}`} width={20} height={20} alt="icon" />
            )}
            {avatar && <Image src={`${avatar}`} fill alt="avatar" />}
          </div>
        )}
      </div>
      <div className={styles.board__right}>
        <div className={styles.board__right_top}>
          <div className={styles.board__right_top_side}>
            {title && <h6 className={styles.board__title}>{parse(title)}</h6>}
            {text && <div className={styles.board__text}>{text}</div>}
          </div>
          <div className={`${styles.board__right_top_side}`}>
            {value && <span className={styles.board__value}>{value}</span>}
            {button && !statusDone && (
              <Button
                type="medium"
                variant="outlined"
                color={cssVariables.green}
                onClick={handleCompleteTask}
              >
                <Link href={button!.link} target="_blank">
                  link
                </Link>
                Start
              </Button>
            )}
            {(done || statusDone) && (
              <Image
                src="/icons/check-icon.svg"
                width={24}
                height={24}
                alt="done"
                style={{ marginRight: 20 }}
              />
            )}
          </div>
        </div>
        <div className={styles.board__right_bottom}>
          {progress && (
            <div className={styles.board__progress}>
              <span
                className={styles.board__progress_bar}
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              ></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
