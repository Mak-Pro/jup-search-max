import { HTMLAttributeAnchorTarget } from "react";

type ButtonType = "small" | "medium" | "large";
type ButtonVariant = "text" | "outlined" | "filled";

export interface ButtonProps {
  type?: ButtonType;
  variant?: ButtonVariant;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  reset?: boolean;
  submit?: boolean;
  borderRadius?: number;
}

export interface BoardProps {
  icon?: string;
  avatar?: string;
  title?: string;
  text?: string;
  value?: string;
  progress?: { current: number; total: number } | null;
  button?: {
    link: string;
  } | null;
  done?: boolean;
  taskId?: number | string;
  onClick?: () => void;
  onClickAlt?: () => void;
}

export interface UserProps {
  avatarLink: string;
  checkInCounter?: number;
  created?: string;
  firstCheckIn?: boolean;
  jupbotPoints?: number;
  lastCheckIn?: string;
  lastEdited?: string;
  partnerCredits?: number;
  telegramId?: string | number;
  username: string;
}

export type TokenCardSize = "S" | "M" | "L";

export type TokenValues = {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
};

function appendBS<B, S>(object: { buys: B; sells: S }): {} {
  return object;
}

export interface Txns {
  m5: typeof appendBS;
  h1: typeof appendBS;
  h6: typeof appendBS;
  h24: typeof appendBS;
}

export interface TokenProps {
  address: string;
  name: string;
  symbol: string;
  dexId: string;
  priceUsd: string | number;
  liquidityUsd: string | number;
  fdv: number;
  imageUrl: string;
  created?: string | number | null;
  lastUpdated?: string;
  txns: Txns[];
  volume: TokenValues;
  priceChange: TokenValues;
  size: TokenCardSize;
}

export interface CollecttionProps {
  id?: string | number;
  name?: string;
  description?: string;
  type?: "MANUAL" | "AUTOMATIC";
  size?: TokenCardSize | undefined;
  totalVolume?: TokenValues;
  totalPriceChange?: {
    h1: number;
    h6: number;
    h24: number;
  };
  sortSetting?: {
    field: string;
    order: "asc" | "desc";
  };
  tokens: TokenProps[];
  hideHeaderInfo?: boolean;
}

export type CounterStatusType = "READY" | "FARMING";

export interface FriendProps {
  telegramId: string;
  username: string;
  jupbotPoints: number;
  level: number;
  avatarLink: string;
}

export type TaskType =
  | "DAILY_REWARDS"
  | "REFERRALS"
  | "REFERRALS_AMOUNT"
  | "SOCIAL_NETWORK"
  | "CREATE_WALLET"
  | "BUY_MEMECOIN"
  | "MINE_REWARDS"
  | "DEPOSIT"
  | "ALL_TASKS";

export interface TaskProps {
  taskId: number;
  type: TaskType;
  description: string;
  reward: number;
  done: boolean;
  progress: {
    current: number;
    total: number;
  } | null;
  button: {
    link: string;
  } | null;
  rewardType: "POINTS" | "MULTIPLICATOR";
}

export type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export interface AddonCoinProps {
  avatar: string;
  name: string;
  ballance: {
    usd: number;
    ui: number;
  };
  strategy?: "Balanced" | "Careful" | "Degen" | "";
  hiddenPrice: boolean;
  active: boolean;
  selected: boolean;
  callBack?: (value: string) => void;
}

export interface TokenTradeProps {
  balance: {
    public_key: string;
    uri: string;
    token_name: string;
    token_symbol: string;
    token_mint: string;
    token_price: number;
    decimals: number;
    amount: string | number;
    amount_ui: number;
    amount_usd: number;
  };
  position: {
    total_amount: number;
    total_value_usd: number;
    average_price: number;
    total_profit_usd: number;
    total_profit_percent: number;
    strategy_id: string;
    strategy_type: "Balanced" | "Careful" | "Degen";
    strategy_name: string;
    current_tp: number;
    current_sl: number;
  };
}

export interface TokenSearchProps {
  name: string;
  address: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  liquidity: number;
  price: number;
  priceChange30mPercent: number;
  priceChange1hPercent: number;
  priceChange2hPercent: number;
  priceChange4hPercent: number;
  priceChange6hPercent: number;
  priceChange8hPercent: number;
  priceChange12hPercent: number;
  priceChange24hPercent: number;
  mc: number;
  vHistory24hUSD: number;
  uniqueWallet24h: number;
  amount_ui?: number | null;
  amount_usd?: number | null;
}

export interface PortfolioUserProps {
  onboarding: boolean;
  address: string;
  solanaQuantity: number;
  percentChange: number;
  totalUsd: number;
  pnl: {
    dollars: number;
    percent: number;
  };
}
