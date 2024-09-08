import styles from "./style.module.scss";

export const Chip = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.chip}>{children}</div>;
};
