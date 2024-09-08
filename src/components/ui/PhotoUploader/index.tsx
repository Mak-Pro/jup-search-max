import Image from "next/image";
import { Button } from "@/components";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";

interface PhotoUploaderProps {
  url: string;
  callBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUploader = ({ url, callBack }: PhotoUploaderProps) => {
  return (
    <div className={styles.uploader}>
      <input type="file" onChange={callBack} accept="image/*" />
      <div className={styles.uploader__picture}>
        <Image src={url ? url : "/images/avatar-stub.webp"} fill alt="avatar" />
      </div>
      <button className={styles.uploader_btn} type="button">
        <Image src="/icons/pen-line.svg" width={20} height={20} alt="edit" />{" "}
        Edit
      </button>
    </div>
  );
};
