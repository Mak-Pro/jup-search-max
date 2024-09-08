"use client";
import { useState, useEffect } from "react";
import { AddonCoin, Button, AddonStatusBox } from "@/components";
import Slider from "rsuite/Slider";
import "rsuite/Slider/styles/index.css";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";
import { numberFormatterSimple } from "@/helpers";
import { AddonCoinProps, TokenTradeProps } from "@/Types";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";

const commission = 0.0005;

export const AddonSellTokens = ({
  allTokens,
  selectedTokens,
  selectedCoins,
  callBack,
  socketCallback,
  clear,
}: {
  allTokens: TokenTradeProps[];
  selectedTokens: string[];
  selectedCoins: string[];
  callBack?: (value: boolean) => void;
  socketCallback?: () => void;
  clear?: boolean;
}) => {
  const { user, webApp } = useTelegram();

  const allSelectedTokens = [...selectedTokens, ...selectedCoins];

  const filteredTokens = allTokens
    .map((token) =>
      allSelectedTokens.includes(token.balance.token_name) ? token : null
    )
    .filter((token) => token !== null);

  const [solanaPrice, setSolanaPrice] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [sellValue, setSellValue] = useState(0);

  const [progress, setProgress] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  const [socketData, setSocketData] = useState<any[]>([]);

  const sliderHandler = (value: number) => {
    let calcSellValue = 0;
    setSliderValue(value);
    setAmount((totalPrice / 100) * value);

    filteredTokens.forEach((token) => {
      if (token) {
        calcSellValue +=
          (token.balance.amount_ui / 100) * value * token.balance.token_price;
      }
    });
    setSellValue(calcSellValue);
  };

  const submitHandler = () => {
    setProgress(true);
    const data: {
      amount: number;
      input_mint: string;
      output_mint: string;
    }[] = [];

    filteredTokens.forEach((token) => {
      if (token) {
        const amount = Math.round(
          (token.balance.amount_ui / 100) *
            sliderValue *
            10 ** token.balance.decimals
        );

        data.push({
          amount,
          input_mint: token.balance.token_mint,
          output_mint: `${process.env.NEXT_PUBLIC_SOLANA_ADDRESS}`,
        });
      }
    });

    if (webApp && user) {
      tradeAxios
        .post(
          `${process.env.NEXT_PUBLIC_TRADE_API}/user/wallet/swap/bulk`,
          data,
          {
            headers: {
              "Authorization": webApp.initData,
            },
          }
        )
        .then((response) => {
          let socket = new WebSocket(
            `${process.env.NEXT_PUBLIC_TRADE_API}/ws/txs`
          );
          socket.onopen = function (e) {
            socket.send(
              JSON.stringify({
                user_id: user.id,
              })
            );
          };

          socket.onmessage = function (event) {
            setStatus("success");
            const data = JSON.parse(event.data);
            if (data.result.error) {
              setSocketData((prev) => [
                ...prev,
                {
                  symbol_in: data.result.symbol_in,
                  error: data.result.error,
                },
              ]);
            } else {
              setSocketData((prev) => [
                ...prev,
                {
                  symbol_in: data.result.symbol_in,
                  amount_in: data.result.amount_in,
                  amount_out: data.result.amount_out,
                },
              ]);
            }
          };

          socket.onclose = function (event) {
            if (event.wasClean) {
              // console.log("Connection closed!", event.code, event.reason);
              socketCallback && socketCallback();
            } else {
              socketCallback && socketCallback();
            }
          };

          socket.onerror = function (error) {
            console.log(`error`);
          };
        })
        .finally(() => {});
    }
  };

  useEffect(() => {
    if (webApp) {
      tradeAxios
        .get(`/token/${process.env.NEXT_PUBLIC_SOLANA_ADDRESS}`, {
          headers: {
            "Authorization": webApp.initData,
          },
        })
        .then((response) => {
          const { data } = response;
          setSolanaPrice(data.price);
        });
    }
  }, [webApp]);

  useEffect(() => {
    setTotalPrice(0);
    setAmount(0);
    setSliderValue(0);
    setSellValue(0);
  }, [selectedTokens, selectedCoins]);

  useEffect(() => {}, [socketData]);

  useEffect(() => {
    if (clear) {
      setProgress(false);
      setStatus("pending");
      setSocketData([]);
    }
  }, [clear]);

  return (
    <div className={styles.sell}>
      <h4 className={styles.sell__title}>Sell Items</h4>
      {!progress && (
        <>
          <div className={styles.sell__list}>
            {filteredTokens.map((token) => {
              if (token) {
                return (
                  <AddonCoin
                    avatar={token.balance.uri}
                    ballance={{
                      ui: token.balance.amount_ui,
                      usd: token.balance.amount_usd,
                    }}
                    hiddenPrice={true}
                    name={token.balance.token_name}
                    key={token.balance.token_symbol}
                    active={false}
                    selected={false}
                    strategy={token.position && token.position.strategy_type}
                  />
                );
              }
            })}
          </div>
          <div className={styles.sell__slider}>
            <p>Select the proportion you want to sell</p>
            <Slider
              min={0}
              max={100}
              step={25}
              value={sliderValue}
              graduated
              progress
              tooltip={false}
              handleTitle={sliderValue}
              renderMark={(mark) => {
                return `${mark}%`;
              }}
              onChange={sliderHandler}
            />
          </div>
          <div className={styles.sell__value}>
            <span>Estimated sell value: </span>
            <span>≈ ${numberFormatterSimple(sellValue)}</span>
          </div>
          <div className={styles.sell__actions}>
            <Button
              type="large"
              variant="filled"
              color={cssVariables.red40}
              borderRadius={12}
              onClick={submitHandler}
              className={sliderValue === 0 ? styles.disabled : ""}
            >
              Sell {filteredTokens.length} Items
            </Button>
          </div>
        </>
      )}

      {progress && status === "pending" && (
        <>
          <div className={styles.sell__progress}>
            {filteredTokens.map((token) => {
              if (token) {
                return (
                  <AddonStatusBox
                    key={token.balance.token_symbol}
                    status={status}
                    title={`Order to sell ${(
                      (token.balance.amount_ui / 100) *
                      sliderValue
                    ).toFixed(5)} ${token.balance.token_name} for ≈${(
                      ((token.balance.amount_ui / 100) *
                        sliderValue *
                        token.balance.token_price) /
                      solanaPrice
                    ).toFixed(5)} SOL was sent to blockchain`}
                    text="Waiting for confirmation..."
                  />
                );
              }
            })}
          </div>
        </>
      )}

      {progress && status === "success" && (
        <>
          <div className={styles.sell__progress}>
            {socketData.map((token) => {
              if (token) {
                return (
                  <AddonStatusBox
                    key={token.symbol_in}
                    status={token.error ? "error" : status}
                    title={
                      !token.error
                        ? `You’ve successfully sell ${token.amount_in.toFixed(
                            5
                          )} ${token.symbol_in} for ${token.amount_out.toFixed(
                            5
                          )} SOL`
                        : ` ${token.symbol_in} token sale error. ${token.error}`
                    }
                    callBack={() =>
                      setSocketData((prev) =>
                        prev.filter((t) => t.symbol_in !== token.symbol_in)
                      )
                    }
                  />
                );
              }
            })}
          </div>
          <div className={styles.sell__back}>
            <Button
              type="large"
              variant="filled"
              color={cssVariables.green}
              borderRadius={12}
              onClick={() => {
                setProgress(false);
                filteredTokens.length = 0;
                setStatus("pending");
                setSocketData([]);
                callBack && callBack(true);
              }}
            >
              Back to Portfolio
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
