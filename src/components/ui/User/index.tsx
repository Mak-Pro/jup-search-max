import Image from "next/image";
import styles from "./style.module.scss";
import { UserProps } from "@/Types";

export const User = ({ avatarLink, username }: UserProps) => {
  return (
    <div className={styles.user}>
      <div className={styles.user__avatar}>
        <Image src={avatarLink} fill alt={username} />
      </div>
      <h6 className={styles.user__nickname}>{username}</h6>
    </div>
  );
};
