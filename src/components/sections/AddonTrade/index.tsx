"use client";
import { useState } from "react";
import Image from "next/image";
import { Button, Tooltip, TradeActions } from "@/components";
import { AddonTradeHeader } from "./AddonTradeHeader";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
// @ts-ignore
import MiddleEllipsis from "react-middle-ellipsis";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";

import { useRouter } from "next/navigation";

export const AddonTrade = ({ alternative }: { alternative?: boolean }) => {
  const router = useRouter();
  const [shortcutEdit, setShortcutEdit] = useState(false);
  const [theme, setTheme] = useState("light");
  const [priceDirection, setPricedirection] = useState("up");

  return (
    <div className={styles.trade}>
      {/* <div className={styles.trade__signals}>
        <div className={styles.trade__signals_close}>
          <Image
            src="/icons/addon-close-icon.svg"
            width={18}
            height={18}
            alt="close"
          />
        </div>
        <div className={styles.trade__signals_icon}>
          <Image
            src="/icons/addon-bell-icon.svg"
            width={24}
            height={24}
            alt="notification"
          />
        </div>
        <h5>No recent signals for buy/sell Bonk</h5>
        <Button
          variant="filled"
          type="medium"
          color={cssVariables.green}
          borderRadius={10}
          onClick={() => router.replace("/support")}
        >
          <Image
            src="/icons/addon-telegram-icon.svg"
            width={21}
            height={20}
            alt="telegram"
          />
          Notify Me
        </Button>
      </div> */}
      <div className={styles.trade__header}>
        <div className={styles.trade__token}>
          <div
            className={`${styles.trade__token_top} ${
              alternative ? styles.trade__token_top_alt : ""
            }`}
          >
            <div className={styles.trade__token_avatar}>
              <Image
                src="/images/addon-token-avatar-stub.png"
                width={58}
                height={58}
                alt="avatar"
              />
            </div>
            <div className={styles.trade__token_info}>
              <div className={styles.trade__token_title}>
                Bonk <span>Bonk</span>
              </div>
              <div className={styles.trade__token_address}>
                <CopyToClipboard
                  text={"6iSxupoCQyiGwufKpvxjwntpxDCvmhnizBN3JYECpump"}
                  onCopy={() => {
                    toast.success("Address is copied!", {
                      id: "address_copy",
                    });
                  }}
                >
                  <button>
                    <Image
                      src="/icons/addon-copy-icon.svg"
                      width={18}
                      height={18}
                      alt="copy"
                    />
                  </button>
                </CopyToClipboard>
                <div className={styles.trade__token_address_line}>
                  <MiddleEllipsis>
                    <span>
                      {"6iSxupoCQyiGwufKpvxjwntpxDCvmhnizBN3JYECpump"}
                    </span>
                  </MiddleEllipsis>
                </div>
                <Image
                  src="/icons/addon-verify-icon.svg"
                  width={18}
                  height={18}
                  alt="verify"
                />
              </div>
            </div>
            {!alternative && (
              <div
                className={`${styles.trade__token_switcher} ${
                  theme === "dark" ? styles.trade__token_switcher_dark : ""
                }`}
                onClick={() =>
                  theme === "light" ? setTheme("dark") : setTheme("light")
                }
              >
                <div className={styles.trade__token_switcher_state}>
                  <Image
                    src="/icons/addon-moon-icon.svg"
                    width={18}
                    height={18}
                    alt="dark"
                  />
                </div>
                <div className={styles.trade__token_switcher_state}>
                  <Image
                    src="/icons/addon-sun-icon.svg"
                    width={18}
                    height={18}
                    alt="light"
                  />
                </div>
              </div>
            )}
          </div>
          <div className={styles.trade__token_bottom}>
            <div className={styles.trade__token_price}>
              <h3>$0.0021</h3>
              <div
                className={`${styles.trade__token_price_direction} ${
                  priceDirection === "up"
                    ? styles.trade__token_price_direction_up
                    : priceDirection === "down"
                    ? styles.trade__token_price_direction_down
                    : ""
                }`}
              >
                {priceDirection === "up" && (
                  <Image
                    src="/icons/addon-price-up-icon.svg"
                    width={16}
                    height={16}
                    alt="price direction"
                  />
                )}
                {priceDirection === "down" && (
                  <Image
                    src="/icons/addon-price-down-icon.svg"
                    width={16}
                    height={16}
                    alt="price direction"
                  />
                )}
                63.11%
              </div>
            </div>
            <div className={styles.trade__token_stats}>
              <div>
                MCAP
                <span>$108.64B</span>
              </div>
              <div>
                Volume
                <span>1.43M</span>
              </div>
              <div>
                Liquidity
                <span>620k</span>
              </div>
              <div>
                New holders 24h
                <span>+3 214</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.trade__body}>{/* <TradeActions /> */}</div>
      <div className={styles.trade__footer}>
        {!alternative && (
          <div className={styles.trade__shortcuts}>
            <div className={styles.trade__shortcuts__header}>
              <h6>Shortcuts</h6>
              <div className={styles.trade__edit}>
                {!shortcutEdit && (
                  <Tooltip text="Edit Price">
                    <button
                      className={styles.trade__edit_btn}
                      onClick={() => setShortcutEdit(true)}
                    >
                      <Image
                        src="/icons/addon-edit-icon.svg"
                        width={18}
                        height={18}
                        alt="price edit"
                      />
                    </button>
                  </Tooltip>
                )}
                {shortcutEdit && (
                  <div className={styles.trade__edit_choice}>
                    <button onClick={() => setShortcutEdit(false)}>
                      <Image
                        src="/icons/addon-check-icon.svg"
                        width={18}
                        height={18}
                        alt="apply"
                      />
                    </button>
                    <button onClick={() => setShortcutEdit(false)}>
                      <Image
                        src="/icons/addon-close-icon.svg"
                        width={18}
                        height={18}
                        alt="cancel"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.trade__shortcuts__body}>
              <div className={styles.trade__shortcut}>
                <div
                  className={`${styles.trade__shortcut_combination} ${
                    shortcutEdit ? styles.trade__shortcut_combination_edit : ""
                  }`}
                >
                  {!shortcutEdit && "Press"}
                  <div className={styles.trade__shortcut_combination_unit}>
                    <Image
                      src="/icons/addon-cmd-icon.svg"
                      width={16}
                      height={16}
                      alt="icon"
                    />
                    Cmd
                  </div>
                  <div className={styles.trade__shortcut_combination_unit}>
                    <Image
                      src="/icons/addon-shift-icon.svg"
                      width={16}
                      height={16}
                      alt="icon"
                    />
                    Shift
                  </div>
                  <div className={styles.trade__shortcut_combination_unit}>
                    K
                  </div>
                </div>
                to buy for {!shortcutEdit && `$${10}`}
                {shortcutEdit && (
                  <div
                    className={`${styles.trade__shortcut_input} ${styles.trade__shortcut_input_inverted}`}
                  >
                    <input type="text" />
                    <span>$</span>
                    <i></i>
                  </div>
                )}
              </div>
              <div className={styles.trade__shortcut}>
                <div
                  className={`${styles.trade__shortcut_combination} ${
                    shortcutEdit ? styles.trade__shortcut_combination_edit : ""
                  }`}
                >
                  {!shortcutEdit && "Press"}
                  <div className={styles.trade__shortcut_combination_unit}>
                    <Image
                      src="/icons/addon-cmd-icon.svg"
                      width={16}
                      height={16}
                      alt="icon"
                    />
                    Cmd
                  </div>
                  <div className={styles.trade__shortcut_combination_unit}>
                    <Image
                      src="/icons/addon-shift-icon.svg"
                      width={16}
                      height={16}
                      alt="icon"
                    />
                    Shift
                  </div>
                  <div className={styles.trade__shortcut_combination_unit}>
                    L
                  </div>
                </div>
                to sell {!shortcutEdit && `${10}%`}
                {shortcutEdit && (
                  <div className={styles.trade__shortcut_input}>
                    <input type="text" />
                    <span>%</span>
                    <i></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
