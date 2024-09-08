import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Button } from "@/components";
import styles from "./style.module.scss";

interface AddonInfoPops {
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  title?: string;
  text?: string;
  marquee?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
  note?: string;
  button?: {
    text: string;
    icon?: string;
    bgcolor: string;
    color: string;
    onClick: () => void;
  };
}

export const AddonInfo = ({
  image,
  title,
  text,
  note,
  button,
  marquee,
}: AddonInfoPops) => {
  return (
    <div className={styles.info}>
      {image && (
        <Image
          src={image.url}
          width={image.width}
          height={image.height}
          alt={image.alt}
          className={styles.info__image}
        />
      )}
      {title && <h2 className={styles.info__title}>{title}</h2>}
      {text && <p className={styles.info__text}>{text}</p>}
      {marquee && (
        <Marquee autoFill className={`addon__marquee`}>
          {marquee.map((logo) => (
            <Image
              src={logo.url}
              key={logo.url}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
            />
          ))}
        </Marquee>
      )}
      <div className={styles.info__footer}>
        {note && <p className={styles.info__note}>{note}</p>}
        {button && (
          <Button
            onClick={button.onClick}
            variant="filled"
            type="large"
            color={button.bgcolor}
            textColor={button.color}
            borderRadius={12}
          >
            {" "}
            {button.icon && (
              <Image src={button.icon} width={21} height={20} alt="icon" />
            )}{" "}
            {button.text}
          </Button>
        )}
      </div>
    </div>
  );
};
