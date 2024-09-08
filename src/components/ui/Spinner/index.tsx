import Spinner from "/public/icons/spinner.svg";

import styles from "./style.module.scss";

export function SpinnerLoader({ className }: { className?: string }) {
  return (
    <div className={`${styles.spinner} ${className} spinner`}>
      <Spinner />
    </div>
  );
}
