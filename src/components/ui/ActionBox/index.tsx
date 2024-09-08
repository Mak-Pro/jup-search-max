"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import styles from "./style.module.scss";

interface ActionBoxProps {
  icon?: string;
  title?: string;
  button?: {
    type: "link" | "button";
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export const ActionBox = ({ icon, title, button }: ActionBoxProps) => {
  return (
    <div className={styles.actionbox}>
      {icon && (
        <div className={styles.actionbox__icon}>
          <Image src={icon} width={98} height={98} alt="icon" />
        </div>
      )}
      <div className={styles.actionbox__content}>
        {title && <h6 className={styles.actionbox__content_title}>{title}</h6>}
        {button && (
          <Button
            onClick={button.onClick ? button.onClick : () => {}}
            type="medium"
            variant="outlined"
            color={cssVariables.green}
          >
            {" "}
            {button.href && <Link href={button.href}>link</Link>} {button.text}
          </Button>
        )}
      </div>
    </div>
  );
};
