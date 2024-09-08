"use client";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";
import { numberFormatter, numberFormatterSimple, hideText } from "@/helpers";
import {
  Tooltip,
  Button,
  Spacer,
  TradeActions,
  AddonCoin,
  AddonWithdraw,
  AddonSellTokens,
  Modal,
  SpinnerLoader,
} from "@/components";
import { PortfolioAsset } from "./Asset";
import { PortfolioShare } from "./Share";
import { ActiveStrategyStatus } from "./ActiveStrategyStatus";
import { PortfolioSettings } from "./Settings";
import AppContext from "@/providers/context";
import { TokenTradeProps, PortfolioUserProps } from "@/Types";
import toast from "react-hot-toast";

interface StrategyVariant {
  StopLossPriceChange: number;
  ProfitPriceChange: number;
  AmountSell: number;
}

interface StrategiesProps {
  [key: string]: {
    [key: string]: {
      [key: string]: StrategyVariant[];
    };
  };
}

export const Portfolio = () => {
  const [show, setShow] = useState<null | any>(null);
  const { user, webApp } = useTelegram();
  const [userData, setUserData] = useState<PortfolioUserProps>({
    onboarding: false,
    address: "",
    solanaQuantity: 0,
    percentChange: 0,
    totalUsd: 0,
    pnl: {
      dollars: 0,
      percent: 0,
    },
  });

  const [tradesTokens, setTradesTokens] = useState<TokenTradeProps[]>([]);
  const { sellTokens, setSellTokens, loading, loadingHandler } =
    useContext(AppContext);
  const [priceVisibility, setPriceVisibility] = useState(true);
  const [selectTradesBulk, setSelectTradesBulk] = useState({
    activate: false,
    all: false,
  });
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [expandedToken, setExpandedToken] = useState<any>();
  const [selectCoinsBulk, setSelectCoinsBulk] = useState({
    activate: false,
    all: false,
  });
  const [strategies, setStrategies] = useState<StrategiesProps>({});
  const [activeStrategyGroup, setActiveStrategyGroup] = useState("");
  const [activeVariant, setActiveVariant] = useState<any>();
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [activeVariantValues, setActiveVariantValues] = useState<
    StrategyVariant[]
  >([]);
  const [activeValue, setActiveValue] = useState(0);
  const [tokenExpand, setTokenExpand] = useState(true);
  const [withdraw, setWithdraw] = useState(false);
  const [confirmSell, setConfirmSell] = useState(false);
  const [settings, setSettings] = useState(false);
  const [socketDone, setSocketDone] = useState(false);
  const [clearAddonSell, setClearAddonSell] = useState(false);

  const fetchTradesTokensData = (
    initData: string,
    limit: number,
    page: number
  ) => {
    return tradeAxios.get(`/user/txs?limit=${limit}&page=${page}`, {
      headers: { "Authorization": initData },
    });
  };

  const fetchAllUserData = (initData: string, limit: number, page: number) => {
    tradeAxios
      .get(`/user/info`, { headers: { "Authorization": initData } })
      .then((response) => {
        const { data: fetchedUserData } = response;
        return fetchedUserData;
      })
      .then((userData) => {
        fetchTradesTokensData(initData, limit, page)
          .then((response) => {
            const { data: tradesData } = response;
            setUserData({
              ...userData,
              onboarding: userData.onboarding_done,
              address: userData.portfolio.public_key,
              totalUsd: userData.portfolio.total_usd.toFixed(2),
              percentChange: userData.portfolio.percent_change.toFixed(2),
              solanaQuantity: userData.portfolio.sol_ui,
              pnl: {
                dollars: tradesData.total_profit_usd.toFixed(2),
                percent: Math.round(tradesData.total_profit_percent),
              },
            });

            setTradesTokens(tradesData.positions);
          })
          .catch((error) => console.log(error.message))
          .finally(() => {
            loadingHandler(false);
            setShow(true);
          });
      });
  };

  // const fetchAllUserData = (initData: string, limit: number, page: number) => {
  //   tradeAxios
  //     .get(`/user/info`, { headers: { "Authorization": initData } })
  //     .then((userResponse) => {
  //       const { data: userData } = userResponse;
  //       return fetchTradesTokensData(initData, limit, page).then(
  //         (tradesResponse) => {
  //           return { userData, tradesData: tradesResponse.data };
  //         }
  //       );
  //     })
  //     .then(({ userData, tradesData }) => {
  //       console.log(userData, tradesData);
  //       setUserData({
  //         ...userData,
  //         onboarding: userData.onboarding_done,
  //         address: userData.portfolio.public_key,
  //         totalUsd: userData.portfolio.total_usd.toFixed(2),
  //         percentChange: userData.portfolio.percent_change.toFixed(2),
  //         solanaQuantity: userData.portfolio.sol_ui,
  //         pnl: {
  //           dollars: tradesData.total_profit_usd.toFixed(2),
  //           percent: Math.round(tradesData.total_profit_percent),
  //         },
  //       });
  //       setTradesTokens(tradesData.positions);
  //     })
  //     .catch((error) => console.log(error.message))
  //     .finally(() => {
  //       loadingHandler(false);
  //       setShow(true);
  //     });
  // };

  useEffect(() => {
    loadingHandler(true);
    if (webApp) {
      fetchAllUserData(webApp.initData, 100, 1);
      tradeAxios
        .get("/strategy", { headers: { "Authorization": webApp.initData } })
        .then((response) => {
          const { data } = response;
          if (data) {
            setStrategies(data);
            setActiveStrategyGroup(Object.keys(data)[0]);
            setActiveVariant(
              Object.fromEntries(
                Object.keys(data).map((tab) => [tab, Object.keys(data[tab])[0]])
              )
            );
          }
        });
    }
  }, [webApp]);

  // useEffect(() => {
  //   if (webApp) {
  //     fetchTradesTokensData(webApp.initData, 100, 1)
  //       .then((response) => {
  //         const { data } = response;
  //         if (typeof data === "object") {
  //           setTradesTokens(data.positions);
  //         }
  //       })
  //       .catch(() => setTradesTokens([]));
  //   }
  // }, [selectedStrategy]);

  useEffect(() => {
    if (activeVariant) {
      setActiveVariantValues(
        Object.values(
          strategies[activeStrategyGroup][activeVariant[activeStrategyGroup]]
        )[1]
      );
    }
  }, [activeStrategyGroup, activeVariant]);

  const toggleToken = (
    name: string,
    address: string,
    strategy_group: "Balanced" | "Careful" | "Degen",
    strategy_variant: string
  ) => {
    if (!tokenExpand) {
      setSelectedTokens((prevSelected) =>
        prevSelected.includes(name)
          ? prevSelected.filter((item) => item !== name)
          : [...prevSelected, name]
      );
    } else {
      tradeAxios
        .get(`token/${address}`)
        .then((response) => {
          const { data } = response;
          const fullData = {
            ...expandedToken,
            mc: data.mc,
            volume: data.vHistory24hUSD,
            liquidity: data.liquidity,
            holders24h: data.uniqueWallet24h,
            address: data.address,
          };
          setExpandedToken(fullData);
          setSelectedStrategy(strategy_group);
          setActiveStrategyGroup(strategy_group || "Balanced");
          return fullData;
        })
        .then((object) => {
          tradeAxios
            .get(`token/${address}/chart`)
            .then((response) => {
              const { data } = response;
              const fullData = { ...object, chart_url: data.chart_url };
              setExpandedToken(fullData);
            })
            .catch(() => {
              setExpandedToken((prev: any) => ({ ...prev, chart_url: null }));
            });
        });

      setSelectedTokens((prevSelected) =>
        prevSelected.includes(name) ? [] : [name]
      );
    }
  };

  const toggleCoin = (name: string) => {
    setSelectedCoins((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((item) => item !== name)
        : [...prevSelected, name]
    );
  };

  const selectAllTokensItems = () => {
    setSelectedTokens(
      selectTradesBulk.all
        ? []
        : tradesTokens
            .map((token) =>
              token.hasOwnProperty("position") ? token.balance.token_name : ""
            )
            .filter((token) => token !== "")
    );
  };

  const selectAllCoinsItems = () => {
    setSelectedCoins(
      selectCoinsBulk.all
        ? []
        : tradesTokens
            .map((token) =>
              !token.hasOwnProperty("position") ? token.balance.token_name : ""
            )
            .filter((token) => token !== "")
    );
  };

  const handleGroupClick = (group: string) => {
    setActiveStrategyGroup(group);
  };

  const handleVariantClick = (variant: string) => {
    setActiveVariant((prev: any) => ({
      ...prev,
      [activeStrategyGroup]: variant,
    }));
  };

  useEffect(() => {
    const trades = tradesTokens.filter((token) =>
      token.hasOwnProperty("position")
    ).length;
    setSelectTradesBulk((prev) => ({
      ...prev,
      all: selectedTokens.length > 0 && selectedTokens.length === trades,
    }));
    setSellTokens(
      (selectedTokens.length !== 0 && !tokenExpand) ||
        selectedCoins.length !== 0
    );
  }, [selectedTokens, tokenExpand]);

  useEffect(() => {
    const coins = tradesTokens.filter(
      (token) => !token.hasOwnProperty("position")
    ).length;
    setSelectCoinsBulk((prev) => ({
      ...prev,
      all: selectedCoins.length > 0 && selectedCoins.length === coins,
    }));
    setSellTokens(selectedCoins.length !== 0 || selectedTokens.length !== 0);
  }, [selectedCoins]);

  const handleNewStrategy = (address: string) => {
    const data = {
      token_mint: address,
      strategy: activeVariant[activeStrategyGroup],
    };

    tradeAxios
      .post(`${process.env.NEXT_PUBLIC_TRADE_API}/user/strategy/new`, data, {
        headers: { "Authorization": webApp?.initData },
      })
      .then((response) => {
        const { data } = response;
        setSelectedStrategy(data.strategy_group);
        if (webApp) {
          fetchTradesTokensData(webApp.initData, 100, 1).then((response) => {
            const { data } = response;
            if (typeof data === "object") {
              setTradesTokens(data.positions);
            }
          });
        }

        toast.success("You've successfully protected your trade!", {
          id: "confirm_strategy",
        });
      })
      .catch(() => {});
  };

  const handleCancelStrategy = (strategyId: string) => {
    const data = { strategy_id: strategyId };

    tradeAxios
      .post(`${process.env.NEXT_PUBLIC_TRADE_API}/user/strategy/cancel`, data, {
        headers: { "Authorization": webApp?.initData },
      })
      .then(() => {
        setSelectedStrategy("");
        setActiveStrategyGroup(Object.keys(strategies)[0]);
        setActiveVariant(
          Object.fromEntries(
            Object.keys(strategies).map((tab) => [
              tab,
              Object.keys(strategies[tab])[0],
            ])
          )
        );
        if (webApp) {
          fetchTradesTokensData(webApp.initData, 100, 1).then((response) => {
            const { data } = response;
            if (typeof data === "object") {
              setTradesTokens(data.positions);
            }
          });
        }
        toast.success("You've successfully cancelled the strategy!", {
          id: "confirm_strategy",
        });
      })
      .catch(() => {});
  };

  return (
    <>
      {loading && <SpinnerLoader />}

      {show && webApp && (
        <>
          <div className={styles.portfolio}>
            <div className={styles.portfolio__title}>
              <h3>Portfolio</h3>{" "}
              <button onClick={() => setSettings(true)}>
                <Image
                  src="/icons/addon-settings-icon.svg"
                  width={18}
                  height={18}
                  alt="edit"
                />
              </button>
            </div>

            <div className={styles.portfolio__wallet}>
              <div className={styles.portfolio__wallet_note}>
                Portfolio Value{" "}
                <button onClick={() => setPriceVisibility((prev) => !prev)}>
                  {priceVisibility ? (
                    <Image
                      src="/icons/addon-eye-slash-icon.svg"
                      width={18}
                      height={18}
                      alt="edit"
                    />
                  ) : (
                    <Image
                      src="/icons/addon-eye-icon.svg"
                      width={18}
                      height={18}
                      alt="edit"
                    />
                  )}
                </button>
              </div>
              <div className={styles.portfolio__wallet_state}>
                <h2 className={styles.portfolio__wallet_state_price}>
                  <span>$</span>
                  {priceVisibility
                    ? numberFormatterSimple(+userData.totalUsd)
                    : hideText(numberFormatterSimple(+userData.totalUsd), "•")}
                </h2>
                <div className={styles.portfolio__wallet_state_stat}>
                  <div className={styles.portfolio__wallet_state_stat_exchange}>
                    {priceVisibility
                      ? numberFormatterSimple(userData.solanaQuantity)
                      : hideText(
                          numberFormatterSimple(userData.solanaQuantity),
                          "•"
                        )}{" "}
                    SOL
                  </div>
                  <div
                    className={styles.portfolio__wallet_state_stat_dynamic}
                    style={{
                      color:
                        userData.percentChange > 0
                          ? cssVariables.green40
                          : userData.percentChange < 0
                          ? cssVariables.red
                          : cssVariables.gray100,
                    }}
                  >
                    {userData.percentChange > 0
                      ? `+${userData.percentChange}`
                      : userData.percentChange}
                    %
                  </div>
                </div>
                <div className={styles.portfolio__wallet_state_pnl}>
                  <span>Unrealized PnL:</span>
                  <div>
                    $
                    {priceVisibility
                      ? numberFormatterSimple(userData.pnl.dollars)
                      : hideText(
                          numberFormatterSimple(userData.pnl.dollars),
                          "•"
                        )}{" "}
                    ({userData.pnl.percent}%){" "}
                    <Tooltip text="Unrealized PnL">
                      <Image
                        src="/icons/addon-info-circle-icon.svg"
                        width={20}
                        height={20}
                        alt="info"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            <PortfolioAsset
              priceVisibility={priceVisibility}
              userData={{
                sol: userData.solanaQuantity,
                address: userData.address,
              }}
            />

            <div className={styles.buttons}>
              <Button
                variant="filled"
                type="large"
                borderRadius={12}
                color={cssVariables.green}
              >
                <Link
                  href={`https://fund.wif.bot/fund?recipient=${userData.address}`}
                  target="_blank"
                >
                  link
                </Link>
                Buy SOL
              </Button>
              <Button
                variant="filled"
                type="large"
                borderRadius={12}
                color={cssVariables.green}
                onClick={() => setWithdraw(true)}
              >
                Withdraw
              </Button>
            </div>

            <Spacer space={10} />

            {/* Trades */}
            <div className={styles.trades}>
              {tradesTokens.length > 0 &&
                tradesTokens.some((token) => "position" in token) && (
                  <div className={styles.trades__header}>
                    <h6>Trades</h6>
                    <div className={styles.trades__header_actions}>
                      {selectTradesBulk.activate ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectTradesBulk((prev) => ({
                                ...prev,
                                all: !prev.all,
                              }));
                              selectAllTokensItems();
                            }}
                            className={`${
                              styles.trades__header_actions_toggleall
                            } ${
                              selectTradesBulk.all
                                ? styles.trades__header_actions_toggleall_active
                                : ""
                            }`}
                          >
                            <span>
                              {selectTradesBulk.all && (
                                <Image
                                  src="/icons/addon-check-icon-black.svg"
                                  width={10}
                                  height={6}
                                  alt="checked"
                                />
                              )}
                            </span>
                            Select All
                          </button>
                          <button
                            onClick={() => {
                              setSelectTradesBulk({
                                activate: false,
                                all: false,
                              });
                              setSelectedTokens([]);
                              setTokenExpand(true);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectTradesBulk((prev) => ({
                              ...prev,
                              activate: true,
                            }));
                            setSelectedTokens([]);
                            setTokenExpand(false);
                          }}
                        >
                          Select Items
                        </button>
                      )}

                      <button
                        onClick={() => {
                          fetchTradesTokensData(
                            webApp.initData as string,
                            100,
                            1
                          ).then((response) => {
                            const { data: fetchedTradesData } = response;
                            setUserData((prev) => ({
                              ...prev,
                              pnl: {
                                dollars:
                                  fetchedTradesData.total_profit_usd.toFixed(2),
                                percent: Math.round(
                                  fetchedTradesData.total_profit_percent
                                ),
                              },
                            }));
                            setTradesTokens(fetchedTradesData.positions);
                          });
                        }}
                      >
                        <Image
                          src="/icons/addon-refresh-icon.svg"
                          width={24}
                          height={24}
                          alt="refresh"
                        />
                      </button>
                    </div>
                  </div>
                )}
              {/* start token */}
              <div className={styles.trades__body}>
                <div className={styles.trades__list}>
                  {tradesTokens.map((token) => {
                    if (token.position) {
                      return (
                        <div
                          key={token.balance.token_name}
                          className={`${styles.trades__token} ${
                            selectedTokens.includes(token.balance.token_name)
                              ? styles.trades__token_selected
                              : ""
                          }`}
                        >
                          <div
                            className={`${styles.trades__token_header} ${
                              tokenExpand
                                ? styles.trades__token_header_expand
                                : ""
                            }`}
                            onClick={() => {
                              toggleToken(
                                token.balance.token_name,
                                token.balance.token_mint,
                                token.position.strategy_type,
                                token.position.strategy_name
                              );
                            }}
                          >
                            {token.position.strategy_type && (
                              <span
                                className={styles.trades__token_header_line}
                                style={{
                                  backgroundColor:
                                    token.position.strategy_type === "Balanced"
                                      ? cssVariables.green40
                                      : token.position.strategy_type ===
                                        "Careful"
                                      ? cssVariables.orange
                                      : token.position.strategy_type === "Degen"
                                      ? cssVariables.violet
                                      : cssVariables.gray40,
                                }}
                              ></span>
                            )}
                            <div
                              className={`${styles.trades__token_avatar} ${
                                selectedTokens.includes(
                                  token.balance.token_name
                                ) && !tokenExpand
                                  ? styles.trades__token_avatar_selected
                                  : ""
                              }`}
                            >
                              {selectedTokens.includes(
                                token.balance.token_name
                              ) && !tokenExpand ? (
                                <Image
                                  src="/icons/addon-check-icon-black.svg"
                                  width={20}
                                  height={20}
                                  alt="checked"
                                />
                              ) : (
                                <Image
                                  src={token.balance.uri}
                                  fill
                                  alt={token.balance.token_name}
                                />
                              )}
                            </div>
                            <div className={styles.trades__token_info}>
                              <h6 className={styles.trades__token_name}>
                                {token.balance.token_symbol}
                              </h6>
                              <div className={styles.trades__token_tpsl}>
                                <span>
                                  TP:{" "}
                                  {token.position.current_tp === 0
                                    ? "-/-"
                                    : token.position.current_tp}
                                </span>
                                <span>
                                  SL:{" "}
                                  {token.position.current_sl === 0
                                    ? "-/-"
                                    : token.position.current_sl}
                                </span>
                              </div>
                            </div>
                            <div className={styles.trades__token_price}>
                              <span
                                className={styles.trades__token_price_ratio}
                              >
                                $
                                {priceVisibility
                                  ? numberFormatterSimple(
                                      token.balance.amount_usd
                                    )
                                  : hideText(
                                      numberFormatterSimple(
                                        token.balance.amount_usd
                                      ),
                                      "•"
                                    )}{" "}
                                /{" "}
                                {priceVisibility
                                  ? token.balance.amount_ui.toFixed(2)
                                  : hideText(
                                      numberFormatterSimple(
                                        token.balance.amount_ui
                                      ),
                                      "•"
                                    )}{" "}
                                <span style={{ textTransform: "uppercase" }}>
                                  {token.balance.token_symbol}
                                </span>
                              </span>
                              <span
                                className={styles.trades__token_price_direction}
                                style={{
                                  color:
                                    token.position.total_profit_percent > 0
                                      ? cssVariables.green40
                                      : token.position.total_profit_percent < 0
                                      ? cssVariables.red
                                      : cssVariables.gray100,
                                }}
                              >
                                {token.position.total_profit_percent > 0
                                  ? `+${token.position.total_profit_percent.toFixed(
                                      2
                                    )}`
                                  : token.position.total_profit_percent.toFixed(
                                      2
                                    )}
                                %
                              </span>
                            </div>
                          </div>

                          {tokenExpand &&
                            selectedTokens.includes(
                              token.balance.token_name
                            ) && (
                              <div className={styles.trades__token_body}>
                                <div className={styles.trades__token_pnl}>
                                  <Image
                                    src={token.balance.uri}
                                    fill
                                    alt={token.balance.token_name}
                                    className={styles.trades__token_pnl_overlay}
                                  />
                                  <div
                                    className={styles.trades__token_pnl_info}
                                  >
                                    <span
                                      className={
                                        styles.trades__token_pnl_info_name
                                      }
                                    >
                                      {token.balance.token_name} Coin
                                    </span>
                                    <span
                                      className={
                                        styles.trades__token_pnl_info_price
                                      }
                                    >
                                      {priceVisibility
                                        ? new Intl.NumberFormat("de-DE", {
                                            useGrouping: false,
                                          }).format(token.balance.amount_usd)
                                        : hideText(
                                            new Intl.NumberFormat("de-DE", {
                                              useGrouping: false,
                                            }).format(token.balance.amount_usd),
                                            "•"
                                          )}
                                    </span>
                                  </div>
                                  <div
                                    className={styles.trades__token_pnl_status}
                                  >
                                    <i>Unrealized PnL:</i>
                                    <span>
                                      <i
                                        style={{
                                          color:
                                            token.position.total_profit_usd > 0
                                              ? cssVariables.green40
                                              : token.position
                                                  .total_profit_usd < 0
                                              ? cssVariables.red
                                              : cssVariables.gray100,
                                        }}
                                      >
                                        {token.position.total_profit_usd > 0
                                          ? "+"
                                          : ""}
                                        $
                                        {priceVisibility
                                          ? numberFormatterSimple(
                                              token.position.total_profit_usd <
                                                0
                                                ? +String(
                                                    token.position
                                                      .total_profit_usd
                                                  ).slice(1)
                                                : token.position
                                                    .total_profit_usd
                                            )
                                          : hideText(
                                              numberFormatterSimple(
                                                token.position.total_profit_usd
                                              ),
                                              "•"
                                            )}{" "}
                                        /{" "}
                                        {token.position.total_profit_usd > 0
                                          ? "+"
                                          : ""}
                                        {priceVisibility
                                          ? numberFormatterSimple(
                                              token.position
                                                .total_profit_percent
                                            )
                                          : hideText(
                                              numberFormatterSimple(
                                                token.position
                                                  .total_profit_percent
                                              ),
                                              "•"
                                            )}
                                      </i>{" "}
                                      %
                                    </span>
                                  </div>
                                </div>
                                {expandedToken && (
                                  <>
                                    <div className={styles.trades__token_chart}>
                                      {expandedToken.chart_url ? (
                                        <iframe
                                          src={expandedToken.chart_url}
                                        ></iframe>
                                      ) : (
                                        <h3>Chart Not Found!</h3>
                                      )}
                                    </div>
                                    <div
                                      className={styles.trades__token_totalinfo}
                                    >
                                      <div>
                                        <span>MCAP</span>$
                                        {numberFormatter(expandedToken.mc)}
                                      </div>
                                      <div>
                                        <span>Volume</span>
                                        {numberFormatter(expandedToken.volume)}
                                      </div>
                                      <div>
                                        <span>Liquidity</span>
                                        {numberFormatter(
                                          expandedToken.liquidity
                                        )}
                                      </div>
                                      <div>
                                        <span>New holders 24h</span>+
                                        {numberFormatter(
                                          expandedToken.holders24h
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}
                                {expandedToken && expandedToken.address && (
                                  <TradeActions
                                    alternative
                                    token={{
                                      name: token.balance.token_symbol,
                                      price: token.balance.token_price,
                                      address: expandedToken?.address,
                                      quantity: token.balance.amount_ui,
                                      decimals: token.balance.decimals,
                                    }}
                                    ballance={userData.solanaQuantity}
                                    callBack={() => {
                                      setTimeout(
                                        () =>
                                          fetchAllUserData(
                                            webApp.initData as string,
                                            100,
                                            1
                                          ),
                                        17000
                                      );
                                    }}
                                  />
                                )}

                                <div className={styles.portfolio__strategies}>
                                  <h6
                                    className={
                                      styles.portfolio__strategies_title
                                    }
                                  >
                                    Activate Protect Trade Strategies{" "}
                                    <Tooltip text="Strategies">
                                      <Image
                                        src="/icons/addon-info-circle-icon.svg"
                                        width={20}
                                        height={20}
                                        alt="info"
                                      />
                                    </Tooltip>
                                  </h6>

                                  {strategies && (
                                    <>
                                      <div
                                        className={`${
                                          styles.portfolio__strategies_groups
                                        } ${
                                          token.position.strategy_type
                                            ? styles.portfolio__strategies_groups_selected
                                            : ""
                                        }`}
                                      >
                                        {Object.keys(strategies).map(
                                          (group) => (
                                            <button
                                              key={group}
                                              onClick={() =>
                                                handleGroupClick(group)
                                              }
                                              className={`${
                                                styles.portfolio__strategies_group
                                              } ${
                                                activeStrategyGroup === group
                                                  ? styles.portfolio__strategies_group_active
                                                  : ""
                                              }`}
                                            >
                                              <span>{group}</span> Strategies
                                            </button>
                                          )
                                        )}
                                      </div>
                                      {typeof strategies[
                                        activeStrategyGroup
                                      ] === "object" &&
                                        activeVariant && (
                                          <div
                                            className={`${
                                              styles.portfolio__strategies_variants
                                            } ${
                                              token.position.strategy_type
                                                ? styles.portfolio__strategies_variants_selected
                                                : ""
                                            }`}
                                          >
                                            {Object.keys(
                                              strategies[activeStrategyGroup]
                                            ).map((variant, i) => (
                                              <button
                                                key={i}
                                                className={`${
                                                  styles.portfolio__strategy_variant
                                                } ${activeStrategyGroup} ${
                                                  token.position
                                                    .strategy_name !== "0" &&
                                                  token.position
                                                    .strategy_name === variant
                                                    ? "active"
                                                    : activeVariant[
                                                        activeStrategyGroup
                                                      ] === variant &&
                                                      token.position
                                                        .strategy_name === "0"
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleVariantClick(variant)
                                                }
                                              >
                                                {variant}%
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      <ActiveStrategyStatus
                                        values={activeVariantValues}
                                        priceVisibility={priceVisibility}
                                        tokenQuantity={token.balance.amount_ui}
                                        tokenPrice={token.balance.token_price}
                                        strategyPercent={
                                          activeVariant[activeStrategyGroup]
                                        }
                                      />

                                      {Array.isArray(activeVariantValues) && (
                                        <div
                                          className={
                                            styles.portfolio__strategy_values
                                          }
                                        >
                                          <div
                                            className={
                                              styles.portfolio__strategy_values_block
                                            }
                                          >
                                            <h6
                                              className={
                                                styles.portfolio__strategy_values_block_title
                                              }
                                            >
                                              Take Profit
                                            </h6>
                                            <div
                                              className={
                                                styles.portfolio__strategy_values_block_list
                                              }
                                            >
                                              {activeVariantValues.map(
                                                (values, i) => (
                                                  <div
                                                    key={i}
                                                    className={
                                                      styles.portfolio__strategy_values_block_list_item
                                                    }
                                                    onClick={() =>
                                                      setActiveValue(i)
                                                    }
                                                  >
                                                    <span>TP{i + 1}</span>{" "}
                                                    <span
                                                      className={
                                                        styles.portfolio__strategy_values_block_list_item_value
                                                      }
                                                    >
                                                      Sell{" "}
                                                      <i
                                                        style={{
                                                          color:
                                                            cssVariables.red,
                                                        }}
                                                      >
                                                        {values.AmountSell}%
                                                      </i>
                                                    </span>
                                                    <span
                                                      className={
                                                        styles.portfolio__strategy_values_block_list_item_value
                                                      }
                                                    >
                                                      at ROI{" "}
                                                      <i
                                                        style={{
                                                          color:
                                                            cssVariables.green40,
                                                        }}
                                                      >
                                                        {
                                                          values.ProfitPriceChange
                                                        }
                                                        %
                                                      </i>
                                                    </span>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              styles.portfolio__strategy_values_block
                                            }
                                          >
                                            <h6
                                              className={
                                                styles.portfolio__strategy_values_block_title
                                              }
                                            >
                                              Stop Loss Rules
                                            </h6>
                                            {activeVariantValues.map(
                                              (values, i) => (
                                                <div
                                                  key={i}
                                                  className={
                                                    styles.portfolio__strategy_values_block_list
                                                  }
                                                >
                                                  <div
                                                    className={`${styles.portfolio__strategy_values_block_list_item} ${styles.portfolio__strategy_values_block_list_item_alt}`}
                                                  >
                                                    <span>SL{i}</span>{" "}
                                                    <span
                                                      className={
                                                        styles.portfolio__strategy_values_block_list_item_value
                                                      }
                                                    >
                                                      Target ROI{" "}
                                                      <i
                                                        style={{
                                                          color:
                                                            cssVariables.green40,
                                                        }}
                                                      >
                                                        {values.AmountSell}%
                                                      </i>
                                                    </span>{" "}
                                                    <span
                                                      className={
                                                        styles.portfolio__strategy_values_block_list_item_value
                                                      }
                                                    >
                                                      set SL to ROI{" "}
                                                      <i
                                                        style={{
                                                          color:
                                                            cssVariables.red,
                                                        }}
                                                      >
                                                        {
                                                          values.StopLossPriceChange
                                                        }
                                                        %
                                                      </i>
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div
                                  className={styles.portfolio__strategy_actions}
                                >
                                  {!token.position.strategy_type && (
                                    <Button
                                      type="large"
                                      variant="filled"
                                      color={cssVariables.green}
                                      borderRadius={12}
                                      onClick={() =>
                                        handleNewStrategy(expandedToken.address)
                                      }
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                  {token.position.strategy_type && (
                                    <Button
                                      type="large"
                                      variant="filled"
                                      color={cssVariables.red40}
                                      borderRadius={12}
                                      onClick={() =>
                                        handleCancelStrategy(
                                          token.position.strategy_id
                                        )
                                      }
                                    >
                                      Cancel Strategy
                                    </Button>
                                  )}
                                </div>

                                <PortfolioShare
                                  percent={token.position.total_profit_percent}
                                  current_price={token.balance.token_price}
                                  entry_price={token.position.average_price}
                                  logo={token.balance.uri}
                                  name={token.balance.token_symbol}
                                  address={token.balance.token_mint}
                                />
                              </div>
                            )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              {/* end token */}
            </div>

            <Spacer space={4} />

            {/* Coins */}
            <div className={styles.portfolio__coins}>
              {tradesTokens.length > 0 &&
                tradesTokens.some((token) => !("position" in token)) && (
                  <div className={styles.trades__header}>
                    <h6>Coins</h6>
                    <div className={styles.trades__header_actions}>
                      {selectCoinsBulk.activate ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectCoinsBulk((prev) => ({
                                ...prev,
                                all: !prev.all,
                              }));
                              selectAllCoinsItems();
                            }}
                            className={`${
                              styles.trades__header_actions_toggleall
                            } ${
                              selectCoinsBulk.all
                                ? styles.trades__header_actions_toggleall_active
                                : ""
                            }`}
                          >
                            <span>
                              {selectCoinsBulk.all && (
                                <Image
                                  src="/icons/addon-check-icon-black.svg"
                                  width={10}
                                  height={6}
                                  alt="checked"
                                />
                              )}
                            </span>
                            Select All
                          </button>
                          <button
                            onClick={() => {
                              setSelectCoinsBulk({
                                activate: false,
                                all: false,
                              });
                              setSelectedCoins([]);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setSelectCoinsBulk((prev) => ({
                              ...prev,
                              activate: true,
                            }))
                          }
                        >
                          Select Items
                        </button>
                      )}

                      <button>
                        <Image
                          src="/icons/addon-refresh-icon.svg"
                          width={24}
                          height={24}
                          alt="refresh"
                          onClick={() => {
                            fetchTradesTokensData(
                              webApp.initData as string,
                              100,
                              1
                            ).then((response) => {
                              const { data: fetchedTradesData } = response;
                              setUserData((prev) => ({
                                ...prev,
                                pnl: {
                                  dollars:
                                    fetchedTradesData.total_profit_usd.toFixed(
                                      2
                                    ),
                                  percent: Math.round(
                                    fetchedTradesData.total_profit_percent
                                  ),
                                },
                              }));
                              setTradesTokens(fetchedTradesData.positions);
                            });
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )}

              <div className={styles.portfolio__coins_list}>
                {tradesTokens.map((token) => {
                  if (!token.position) {
                    return (
                      <AddonCoin
                        key={token.balance.token_symbol}
                        avatar={token.balance.uri}
                        name={token.balance.token_symbol}
                        ballance={{
                          usd: token.balance.amount_usd,
                          ui: token.balance.amount_ui,
                        }}
                        hiddenPrice={priceVisibility}
                        active={selectCoinsBulk.activate}
                        selected={selectedCoins.includes(
                          token.balance.token_name
                        )}
                        callBack={(value: string) => toggleCoin(value)}
                      />
                    );
                  }
                })}
              </div>
            </div>

            <Spacer space={20} />
          </div>

          {/* sell selected tokens action */}
          {sellTokens && (
            <div className={styles.action__box}>
              <Button
                type="large"
                variant="filled"
                borderRadius={12}
                color={cssVariables.red40}
                onClick={() => setConfirmSell(true)}
              >
                Sell {selectedTokens.length + selectedCoins.length} Items
              </Button>
            </div>
          )}

          {/* modals */}
          <Modal
            show={withdraw}
            closeHandler={() => setWithdraw(false)}
            className={"addon-modal"}
          >
            <button className="modal-close" onClick={() => setWithdraw(false)}>
              <Image
                src="/icons/close-icon.svg"
                width={20}
                height={20}
                alt="close"
              />
            </button>
            <AddonWithdraw available={userData.solanaQuantity} />
          </Modal>

          <Modal
            show={confirmSell}
            closeHandler={() => {
              if (socketDone) {
                setSellTokens(false);
                setSelectTradesBulk({ activate: false, all: false });
                setSelectedTokens([]);
                setTokenExpand(true);
                setSelectCoinsBulk({ activate: false, all: false });
                setSelectedCoins([]);
                fetchAllUserData(webApp.initData, 100, 1);
                setConfirmSell(false);
                setSocketDone(false);
                setClearAddonSell(true);
                setTimeout(() => setClearAddonSell(false), 1000);
              } else {
                setConfirmSell(false);
                setSocketDone(false);
              }
            }}
            className={"addon-modal"}
          >
            <AddonSellTokens
              allTokens={tradesTokens}
              selectedTokens={selectedTokens}
              selectedCoins={selectedCoins}
              callBack={() => {
                setSellTokens(false);
                setSelectTradesBulk({ activate: false, all: false });
                setSelectedTokens([]);
                setTokenExpand(true);
                setSelectCoinsBulk({ activate: false, all: false });
                setSelectedCoins([]);
                fetchAllUserData(webApp.initData, 100, 1);
                setConfirmSell(false);
              }}
              socketCallback={() => setSocketDone(true)}
              clear={clearAddonSell}
            />
          </Modal>

          <Modal
            show={settings}
            closeHandler={() => setSettings(false)}
            className={"addon-modal"}
          >
            <button className="modal-close" onClick={() => setSettings(false)}>
              <Image
                src="/icons/close-icon.svg"
                width={20}
                height={20}
                alt="close"
              />
            </button>
            <PortfolioSettings clear={!settings} />
          </Modal>
        </>
      )}
    </>
  );
};
