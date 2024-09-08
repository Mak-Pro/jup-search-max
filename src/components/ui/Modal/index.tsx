import styles from "./style.module.scss";

interface ModalProps {
  children?: React.ReactNode;
  show?: boolean;
  closeHandler?: () => void;
  className?: string;
}

export const Modal = ({
  children,
  show,
  closeHandler,
  className,
}: ModalProps) => {
  return (
    <div
      className={`${styles.modal} ${show ? styles.modal__show : ""} ${
        className ? className : ""
      }`}
    >
      <div
        className={styles.modal__overlay}
        onClick={closeHandler ? closeHandler : () => {}}
      ></div>
      <div className={styles.modal__content}>
        <div
          className={`${styles.modal__content_inner} ${
            show ? styles.modal__content_inner_show : ""
          }`}
        >
          {children && children}
        </div>
      </div>
    </div>
  );
};
