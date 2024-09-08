"use client";
import { useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";
import { ButtonProps } from "@/Types";

export const Button = ({
  children,
  type,
  variant,
  color,
  textColor,
  href,
  onClick,
  target,
  className,
  disabled,
  reset,
  submit,
  borderRadius,
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function mousePositionToCustomProp(
    event: MouseEvent<HTMLElement>,
    element: HTMLElement
  ) {
    let rect = event.currentTarget.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    element.style.setProperty("--x", x + "px");
    element.style.setProperty("--y", y + "px");
  }

  useEffect(() => {}, [buttonRef]);

  const ripple = (e: MouseEvent<HTMLElement>) => {
    if (buttonRef && buttonRef.current) {
      mousePositionToCustomProp(
        e as MouseEvent<HTMLElement>,
        buttonRef.current
      );
      buttonRef.current.classList.add(`${styles.pulse}`);
      buttonRef.current.addEventListener(
        "animationend",
        () => {
          buttonRef.current &&
            buttonRef.current.classList.remove(`${styles.pulse}`);
        },
        { once: true }
      );
    }
  };

  return href ? (
    <Link
      href={href}
      target={target ? target : "_self"}
      className={`${styles.button} ${
        type === "small"
          ? styles.button__small
          : type === "large"
          ? styles.button__large
          : styles.button__medium
      } ${
        variant === "filled"
          ? styles.button__filled
          : variant === "outlined"
          ? styles.button__outlined
          : styles.button__text
      } ${className ? className : ""}`}
      style={{
        textDecoration: "none",
        color: color ? color : cssVariables.white,
      }}
    >
      {children}
    </Link>
  ) : (
    <button
      ref={buttonRef}
      type={reset ? "reset" : submit ? "submit" : "button"}
      onClick={onClick}
      onMouseDown={(e) => {
        ripple(e as any);
      }}
      className={`${styles.button} ${disabled ? styles.button__disabled : ""} ${
        type === "small"
          ? styles.button__small
          : type === "large"
          ? styles.button__large
          : styles.button__medium
      } ${
        variant === "filled"
          ? styles.button__filled
          : variant === "outlined"
          ? styles.button__outlined
          : styles.button__text
      } ${className ? className : ""} ${
        disabled ? styles.button__filled_disabled : ""
      }`}
      style={{
        color:
          variant === "outlined" || variant === "text"
            ? color
            : textColor
            ? textColor
            : cssVariables.black,
        backgroundColor: variant === "filled" ? color : "transparent",
        borderColor:
          variant === "outlined" || variant === "filled"
            ? color
            : "transparent",
        borderRadius: borderRadius ? borderRadius : 100,
      }}
    >
      {children}
    </button>
  );
};
