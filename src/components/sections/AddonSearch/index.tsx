"use client";
import Image from "next/image";
import { useState, useEffect, useContext, useCallback } from "react";
import { SearchField } from "./Field";
import { TradeActions, SpinnerLoader, AddonCoin } from "@/components";
import { AddonTradeHeader } from "../AddonTrade/AddonTradeHeader";
import styles from "./style.module.scss";
import { tradeAxios } from "@/api";
import { TokenSearchProps } from "@/Types";
import { useTelegram } from "@/providers/telegram";
import AppContext from "@/providers/context";
import {useWindowWidth} from "@/hooks/useWindowWidth";

export const AddonSearch = () => {
  const { user, webApp } = useTelegram();
  const { referralTokenAddress } = useContext(AppContext);
  const {height} = useWindowWidth();
  const [address, setAddress] = useState(
    referralTokenAddress && !sessionStorage.getItem("firstRef")
      ? referralTokenAddress
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<TokenSearchProps | undefined>(undefined);
  const [solanaQuantity, setSolanaQuantity] = useState(0);
  const [chart, setChart] = useState("");
  const [ballance, setBallance] = useState<any[]>([]);

  const clearData = () => {
    setAddress("");
    setSolanaQuantity(0);
    setToken(undefined);
  };

  const handleChart = useCallback(async () => {
    try {
      const response = await tradeAxios.get(`token/${address}/chart`);
      setChart(response.data.chart_url);
    } catch (error) {
      setChart("");
    }
  }, [address]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const tokenResponse = await tradeAxios.get(`token/${address}`);
      const tokenData = tokenResponse.data;

      if (user && webApp) {
        const userResponse = await tradeAxios.get(`/user/wallet`, {
          headers: {
            Authorization: webApp.initData,
          },
        });
        const userData = userResponse.data;

        setSolanaQuantity(userData.sol_ui);
        const ballanceArray: TokenSearchProps[] = Object.values(
          userData.associated_address
        );

        const tokenExists: TokenSearchProps | undefined = ballanceArray.find(
          (token: any) => token.token_mint === address
        );

        setToken(
          tokenExists
            ? {
                ...tokenData,
                amount_ui: tokenExists.amount_ui,
                amount_usd: tokenExists.amount_usd,
              }
            : tokenData
        );

        setBallance(ballanceArray);

        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0 });
        }
      }
    } catch (error) {
      setToken(undefined);
      setSolanaQuantity(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [address, user, webApp]);

  useEffect(() => {


    if (address.length > 0) {
      fetchAllData();
    }

    if (!sessionStorage.getItem("firstRef")) {
      sessionStorage.setItem("firstRef", "true");
    }

    if (address) {
      document.querySelector("main")?.classList.remove("search-active");
    }
  }, [address, fetchAllData]);


  return (
      <div className={styles.test}>
      {/*<h1>*/}
      {/*  height:{height}*/}
      {/*</h1>*/}

    <>
      {loading && <SpinnerLoader className={styles.search__spinner} />}

      {!token && !loading && (
        <>
          <SearchField callBack={(value) => setAddress(value)} />
        </>
      )}

      {token && !loading && (
        <div className={styles.search__result}>
          <div className={styles.search__result_header}>
            <button className={styles.search__back} onClick={clearData}>
              <Image
                src="/icons/slider-control-angle-left.svg"
                width={26}
                height={26}
                alt="back"
              />{" "}
              Back
            </button>
          </div>

          <AddonTradeHeader
            alternative
            token={{
              logo: token.logoURI,
              name: token.name,
              symbol: token.symbol,
              address: token.address,
              price: token.price,
              priceChange24hPercent: token.priceChange24hPercent,
              mcap: token.mc,
              volume: token.vHistory24hUSD,
              liquidity: token.liquidity,
              holders: token.uniqueWallet24h,
            }}
            chartCallback={() => {
              chart !== "" ? setChart("") : handleChart();
            }}
          />
          {chart !== "" && (
            <div className={styles.search__chart}>
              <iframe src={chart}></iframe>
            </div>
          )}

          <TradeActions
            token={{
              name: token.symbol,
              price: token.price,
              address: token.address,
              quantity: token.amount_ui ? token.amount_ui : 0,
              decimals: token.decimals,
            }}
            ballance={solanaQuantity}
            callBack={() => {
              setTimeout(() => fetchAllData(), 17000);
            }}
          />
          {ballance.length > 0 && (
            <div className={styles.search__ballance}>
              <h6 className={styles.search__ballance_title}>Your balance:</h6>
              <div className={styles.search__ballance_list}>
                {ballance.map((token) => (
                  <AddonCoin
                    key={token.token_symbol}
                    avatar={token.uri}
                    name={token.token_symbol}
                    ballance={{
                      usd: token.amount_usd,
                      ui: token.amount_ui,
                    }}
                    hiddenPrice={true}
                    active={false}
                    selected={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
      </div>
  );
};
