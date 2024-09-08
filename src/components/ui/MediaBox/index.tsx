import styles from "./style.module.scss";

export const MediaBox = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.mediabox}>{children}</div>;
};
