import { numberFormatterSimple, hideText } from "@/helpers";
import styles from "./style.module.scss";

export const ActiveStrategyStatus = ({
  values,
  priceVisibility,
  tokenQuantity,
  tokenPrice,
  strategyPercent,
}: {
  values: any;
  priceVisibility: boolean;
  tokenQuantity: number;
  tokenPrice: number;
  strategyPercent: number | string;
}) => {
  let amountUsdAll = 0;
  values.forEach((data: any) => {
    const slPrice = tokenPrice * Math.abs(data.StopLossPriceChange / 100);
    const slAmount = tokenQuantity * (data.AmountSell / 100);
    const amountUsd = slAmount * slPrice;

    amountUsdAll += amountUsd;
  });

  const maxLossUSD = tokenQuantity * tokenPrice - amountUsdAll;
  const maxProfitUSD =
    (tokenQuantity * tokenPrice * Number(strategyPercent)) / 100;

  return (
    <div className={styles.portfolio__strategy_status}>
      <div>
        <span>Maximum ROI</span>
        {strategyPercent}%
      </div>
      <div>
        <span>Max loss</span>$
        {priceVisibility
          ? numberFormatterSimple(maxLossUSD)
          : hideText(numberFormatterSimple(maxLossUSD), "•")}
      </div>
      <div>
        <span>Total expected profit</span>$
        {priceVisibility
          ? numberFormatterSimple(maxProfitUSD)
          : hideText(numberFormatterSimple(maxProfitUSD), "•")}
      </div>
    </div>
  );
};
