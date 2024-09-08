import styles from "./style.module.scss";

export function Wrapper({
  children,
  radius = 32,
  className,
}: {
  children: React.ReactNode;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={{ borderRadius: `${radius}px` }}
    >
      {children}
    </div>
  );
}
