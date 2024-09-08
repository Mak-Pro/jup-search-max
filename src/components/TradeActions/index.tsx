"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cssVariables } from "@/assets/styles/variables";
import { Button } from "../ui/Button";
import { TextDivider } from "../ui/TextDivider";
import { Tooltip } from "../ui/Tooltip";
import Slider from "rsuite/Slider";
import "rsuite/Slider/styles/index.css";
import styles from "./style.module.scss";
import { Spacer } from "../ui/Spacer";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";
import toast from "react-hot-toast";
import { numberFormatterSimple } from "@/helpers";
import { AddonStatusBox } from "../ui/AddonStatusBox";

interface TradeActionsProps {
  alternative?: boolean;
  token: {
    name: string;
    price: number;
    address: string;
    quantity: number;
    decimals: number;
  };
  ballance: number;
  callBack?: () => void;
}

const regexBuy = /^\d*\.?\d*$/;
const regexSell = /^[0-9]*$/;

const commission = 0.0005;

export const TradeActions = ({
  alternative,
  token,
  ballance,
  callBack,
}: TradeActionsProps) => {
  const { user, webApp } = useTelegram();
  const [tab, setTab] = useState("buy");
  const [tabEdit, setTabEdit] = useState(false);
  const [total, setTotal] = useState("0");
  const [sliderValue, setSliderValue] = useState(0);

  // options
  const [buyOptions, setBuyOptions] = useState<any[]>([]);
  const [sellOptions, setSellOptions] = useState<any[]>([]);

  // buy sell action
  const [action, setAction] = useState(false);
  const [tokenQuantity, setTokenQuantity] = useState(0);
  const [solana, setSolana] = useState<any>();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    if (webApp) {
      const fetchSettings = async () => {
        try {
          const settingsResponse = await tradeAxios.get(`/user/settings`, {
            headers: { "Authorization": webApp.initData },
          });
          setBuyOptions(settingsResponse.data.settings_buy);
          setSellOptions(settingsResponse.data.settings_sell);

          const tokenResponse = await tradeAxios.get(
            `/token/${process.env.NEXT_PUBLIC_SOLANA_ADDRESS}`,
            {
              headers: { "Authorization": webApp.initData },
            }
          );
          setSolana(tokenResponse.data);
        } catch (error) {
          console.error("Error fetching settings or token data", error);
        }
      };
      fetchSettings();
    }
  }, [webApp]);

  const applySettings = () => {
    if (webApp) {
      const data = {
        settings_buy: buyOptions.map(Number),
        settings_sell: sellOptions.map(Number),
      };
      const zero = Object.values(data).some((array) => array.includes(0));

      if (zero) {
        toast.success(`The value cannot be empty or 0!`, { id: "zero_check" });
      } else {
        tradeAxios
          .post(`${process.env.NEXT_PUBLIC_TRADE_API}/user/settings`, data, {
            headers: { "Authorization": webApp.initData },
          })
          .then(() => {
            toast.success(`Volumes Successfully Changed!`, {
              id: "trade_values",
            });
            setTabEdit(false);
          });
      }
    }
  };

  const handleAction = () => {
    setAction(true);
    setStatus("pending");

    const data = {
      amount:
        tab === "buy"
          ? +total * 10 ** solana.decimals
          : Math.round((token.quantity / 100) * +total * 10 ** token.decimals),
      input_mint:
        tab === "buy" ? process.env.NEXT_PUBLIC_SOLANA_ADDRESS : token.address,
      output_mint:
        tab === "buy" ? token.address : process.env.NEXT_PUBLIC_SOLANA_ADDRESS,
    };
    const tokenQuantity =
      tab === "buy"
        ? (+total * solana.price) / token.price
        : (token.quantity / 100) * +total;
    setTokenQuantity(tokenQuantity);

    tradeAxios
      .post(`${process.env.NEXT_PUBLIC_TRADE_API}/user/wallet/swap`, data, {
        headers: { "Authorization": webApp?.initData },
      })
      .then(() => {
        setStatus("success");
        callBack && callBack();
        toast.success(
          `The data will be automatically updated within 15 - 20 seconds!`,
          {
            id: "data_update",
            duration: 5000,
          }
        );
      })
      .catch(() => {
        setStatus("error");
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "buy" | "sell",
    index: number
  ) => {
    const value = e.target.value;
    if (
      type === "buy" &&
      regexBuy.test(value) &&
      !value.startsWith(".") &&
      value.length <= 5 &&
      +value < ballance - commission
    ) {
      const newBuyArray = [...buyOptions];
      newBuyArray[index] = value;
      setBuyOptions(newBuyArray);
    } else if (
      type === "sell" &&
      regexSell.test(value) &&
      +value <= 100 &&
      value.length <= 3
    ) {
      const newSellArray = [...sellOptions];
      newSellArray[index] = value;
      setSellOptions(newSellArray);
    } else {
      toast.error(
        "The value cannot be greater than the deposit size in Solana!",
        {
          id: "trade_limit",
        }
      );
    }
  };

  const renderOptions = (options: any[], type: "buy" | "sell") => {
    return options.map((option, i) => (
      <div key={i} className={styles.trade__option}>
        {!tabEdit ? (
          <Button
            variant="filled"
            type="large"
            color={type === "buy" ? cssVariables.green : cssVariables.red40}
            borderRadius={12}
            className={
              type === "buy"
                ? option > ballance - commission
                  ? styles.disabled
                  : ""
                : +option === 0
                ? styles.disabled
                : ""
            }
            onClick={() => setTotal(option)}
          >
            {option} {type === "buy" ? "SOL" : "%"}
          </Button>
        ) : (
          <div className={styles.trade__option_edit}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleInputChange(e, type, i)}
            />
            <span>{type === "buy" ? "SOL" : "%"}</span>
            <i></i>
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className={styles.trade__actions}>
        <div className={styles.trade__tabs}>
          <div className={`${styles.trade__edit} ${styles.trade__edit_tabs}`}>
            {!tabEdit ? (
              <Tooltip text="Edit Values">
                <button
                  className={styles.trade__edit_btn}
                  onClick={() => setTabEdit(true)}
                >
                  <Image
                    src="/icons/addon-edit-icon.svg"
                    width={18}
                    height={18}
                    alt="price edit"
                  />
                </button>
              </Tooltip>
            ) : (
              <div className={styles.trade__edit_choice}>
                <button onClick={applySettings}>
                  <Image
                    src="/icons/addon-check-icon.svg"
                    width={18}
                    height={18}
                    alt="apply"
                  />
                </button>
                <button
                  onClick={() => {
                    const data = {
                      settings_buy: buyOptions.map(Number),
                      settings_sell: sellOptions.map(Number),
                    };
                    const zero = Object.values(data).some((array) =>
                      array.includes(0)
                    );

                    if (zero) {
                      toast.success(`The value cannot be empty or 0!`, {
                        id: "zero_check",
                      });
                    } else {
                      setTabEdit(false);
                    }
                  }}
                >
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
          <div className={styles.trade__tabs__controls}>
            <div
              className={`${styles.trade__tabs__control} ${
                tab === "buy" ? styles.trade__tabs__control_active : ""
              } ${styles.trade__tabs__control_buy}`}
              onClick={() => {
                setTab("buy");
                setTotal("0");
              }}
            >
              Buy For
            </div>
            {token.quantity > 0 && (
              <div
                className={`${styles.trade__tabs__control} ${
                  tab === "sell" ? styles.trade__tabs__control_active : ""
                } ${styles.trade__tabs__control_sell}`}
                onClick={() => {
                  setTab("sell");
                  setTotal("0");
                }}
              >
                Sell For
              </div>
            )}
          </div>
          <div className={styles.trade__tabs__panels}>
            {tab === "buy" && (
              <div className={styles.trade__tabs__panel}>
                <div className={styles.trade__options}>
                  {renderOptions(buyOptions, "buy")}
                </div>
              </div>
            )}
            {tab === "sell" && (
              <div className={styles.trade__tabs__panel}>
                <div className={styles.trade__options}>
                  {renderOptions(sellOptions, "sell")}
                </div>
              </div>
            )}
          </div>
        </div>

        <TextDivider text="or" />

        <Spacer space={0} />

        {alternative && (
          <div className={styles.trade__slider}>
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
              onChange={(value) => {
                const result =
                  tab === "buy"
                    ? numberFormatterSimple((ballance / 100) * value)
                    : value;
                setTotal(String(result));
                setSliderValue(value);
              }}
            />
          </div>
        )}

        <div
          className={`${styles.trade__custom} ${
            alternative ? styles.trade__custom_alt : ""
          }`}
        >
          <div className={styles.trade__custom_value}>
            <input
              type="text"
              value={total}
              onChange={(e) => {
                const value = e.target.value;
                if (tab === "buy") {
                  if (
                    regexBuy.test(value) &&
                    !value.startsWith(".") &&
                    value.length <= 9 &&
                    +value < ballance - commission
                  ) {
                    setTotal(value);
                  } else {
                    toast.error(
                      "The value cannot be greater than the deposit size in Solana!",
                      {
                        id: "trade_limit_buy",
                      }
                    );
                  }
                } else {
                  if (
                    regexSell.test(value) &&
                    !value.startsWith(".") &&
                    value.length <= 3 &&
                    +value <= 100
                  ) {
                    setTotal(value);
                  } else {
                    toast.error(
                      "The value cannot be greater than 100% of the deposit in Solana!",
                      {
                        id: "trade_limit_sell",
                      }
                    );
                  }
                }
              }}
            />
            <span>Total</span>
            <span>{tab === "sell" ? "%" : "SOL"}</span>
            <i></i>
          </div>
          <Button
            variant="filled"
            type="large"
            color={tab === "buy" ? cssVariables.green : cssVariables.red40}
            borderRadius={12}
            className={
              total === "" ||
              total[total.length - 1] === "." ||
              parseFloat(total) === 0
                ? styles.disabled_alt
                : !alternative &&
                  (total === "" ||
                    total[total.length - 1] === "." ||
                    parseFloat(total) === 0)
                ? styles.disabled
                : ""
            }
            onClick={handleAction}
          >
            {tab === "buy" ? "Buy" : "Sell"} {token.name} for{" "}
            {total !== "0" && total !== "" ? total : "X"}{" "}
            {tab === "sell" ? "%" : "SOL"}
          </Button>
        </div>
      </div>
      <Spacer space={15} />
      {action && (
        <AddonStatusBox
          status={status}
          title={
            status === "pending"
              ? `Order to ${
                  tab === "buy" ? "buy" : "sell"
                } ${tokenQuantity.toFixed(2)} ${token.name} for ${
                  tab === "buy"
                    ? total
                    : ((tokenQuantity * token.price) / solana.price).toFixed(3)
                } SOL was sent to blockchain`
              : status === "success"
              ? `You’ve successfully ${
                  tab === "buy" ? "bought" : "sold"
                } ${tokenQuantity.toFixed(2)} ${token.name} for ${
                  tab === "buy"
                    ? total
                    : ((tokenQuantity * token.price) / solana.price).toFixed(3)
                } SOL`
              : "Oops... Something went wrong."
          }
          text={status === "pending" ? "Waiting for confirmation..." : ""}
          callBack={() => setAction(false)}
        />
      )}
    </>
  );
};
