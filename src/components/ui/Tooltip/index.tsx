import styles from "./style.module.scss";

export const Tooltip = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltip__text}>{text}</span>
      {children}
    </div>
  );
};
