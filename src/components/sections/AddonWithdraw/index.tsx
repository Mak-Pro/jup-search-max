"use client";
import { useState, FormEvent } from "react";
import Slider from "rsuite/Slider";
import "rsuite/Slider/styles/index.css";
import styles from "./style.module.scss";
import { numberFormatterSimple } from "@/helpers";
import { useTelegram } from "@/providers/telegram";
import { tradeAxios } from "@/api";
import toast from "react-hot-toast";

export const AddonWithdraw = ({ available }: { available: number }) => {
  const { user, webApp } = useTelegram();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [sliderValue, setSliderValue] = useState(0);
  const [sending, setSending] = useState(false);

  const sliderHandler = (value: number) => {
    setSliderValue(value);
    const calcValue = (available / 100) * value;
    setAmount(calcValue.toFixed(2));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const address = formData.get("address") as string;
    const amount = formData.get("amount") as string;
    const data = {
      recipient: address,
      amount: parseFloat(amount) * 10 ** 9,
    };
    if (webApp) {
      try {
        await tradeAxios.post(
          `${process.env.NEXT_PUBLIC_TRADE_API}/user/wallet/withdraw`,
          data,
          {
            headers: {
              Authorization: webApp.initData,
            },
          }
        );
        toast.success("Successfully Sent!", { id: "withdraw_send" });
      } catch (error) {
        toast.error("Failed to send. Please try again.");
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className={styles.withdraw}>
      <h3 className={styles.withdraw__title}>Send SOL</h3>
      <form className={styles.withdraw__form} onSubmit={submitHandler}>
        <div className={styles.withdraw__form_body}>
          <div className={styles.withdraw__form_control}>
            <label htmlFor="withdraw_address">Address</label>
            <input
              id="withdraw_address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              name="address"
              placeholder="Long press to paste"
            />
          </div>
          <div
            className={`${styles.withdraw__form_control} ${styles.withdraw__form_control_alt}`}
          >
            <label htmlFor="withdraw_amount">Amount to send</label>
            <input
              id="withdraw_amount"
              className={styles.amount}
              type="text"
              value={amount}
              name="amount"
              placeholder="00,00"
              onChange={(e) => {
                const regex = /^\d*\.?\d*$/;
                if (
                  regex.test(e.target.value) &&
                  !e.target.value.startsWith(".") &&
                  +e.target.value <= available
                ) {
                  setAmount(e.target.value);
                }
              }}
            />
            <span className={styles.withdraw__form_control_suffix}>SOL</span>
          </div>
          <div className={styles.withdraw__form_slider}>
            <input type="hidden" name="percent" value={sliderValue} />
            <Slider
              min={0}
              max={100}
              step={25}
              value={sliderValue}
              graduated
              progress
              tooltip={false}
              handleTitle={sliderValue}
              renderMark={(mark) => `${mark}%`}
              onChange={sliderHandler}
            />
          </div>
          <div className={styles.withdraw__form_infoline}>
            <span>Available</span>
            <span>{numberFormatterSimple(available)} SOL</span>
          </div>
        </div>
        <div className={styles.withdraw__form_footer}>
          <button
            type="submit"
            disabled={
              address === "" || amount === "" || amount === "0" || sending
            }
          >
            {sending ? "Processing..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
