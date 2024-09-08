import Image from "next/image";
import styles from "./style.module.scss";

interface AddonStatusBoxProps {
  status: "pending" | "success" | "error";
  title?: string;
  text?: string;
  callBack?: () => void;
}

export const AddonStatusBox = ({
  status,
  title,
  text,
  callBack,
}: AddonStatusBoxProps) => {
  return (
    <div
      className={`${styles.status__box} ${
        status === "success"
          ? styles.status__box_success
          : status === "error"
          ? styles.status__box_error
          : ""
      }`}
    >
      {(status === "success" || status === "error") && (
        <button className={styles.status__box_close} onClick={callBack}>
          <Image
            src="/icons/addon-close-icon.svg"
            width={20}
            height={20}
            alt="close"
          />
        </button>
      )}
      <div className={styles.status__box_content}>
        <div className={styles.status__box_icon}>
          {status === "success" && (
            <Image
              src="/icons/addon-status-icon-success-alt.svg"
              width={32}
              height={32}
              alt="success"
            />
          )}
        </div>
        <div className={styles.status__box_text}>
          {title && (
            <h6>
              {status !== "error" ? title : "Oops... Something went wrong."}
            </h6>
          )}
          {text && <p>{text}</p>}
        </div>
      </div>
    </div>
  );
};
