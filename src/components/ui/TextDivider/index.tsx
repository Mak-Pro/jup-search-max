import styles from './style.module.scss';

export const TextDivider = ({ text }: { text: string }) => {
    return (
        <h6 className={styles.divider}>
            <span>{text}</span>
        </h6>
    );
};
