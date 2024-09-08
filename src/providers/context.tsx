"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "./telegram";
import { userAxios } from "@/api";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface AppContextProps {
  isLogined: boolean;
  setIsLogined: (val: boolean) => void;
  telegramUser: TelegramUser | null;
  telegramWebApp: WebApp | undefined;
  loading: boolean;
  loadingHandler: (val: boolean) => void;
  dailyReward: number;
  setDailyReward: (val: number) => void;
  unfinishedTasks: number;
  setUnfinishedTasks: (val: number) => void;
  sellTokens: boolean;
  setSellTokens: (val: boolean) => void;
  referralUserLink: string;
  referralTokenAddress: string;
}

const AppContext = createContext<AppContextProps>({
  isLogined: false,
  setIsLogined: () => {},
  telegramUser: null,
  telegramWebApp: undefined,
  loading: false,
  loadingHandler: () => {},
  dailyReward: 0,
  setDailyReward: () => {},
  unfinishedTasks: 0,
  setUnfinishedTasks: () => {},
  sellTokens: false,
  setSellTokens: () => {},
  referralUserLink: "",
  referralTokenAddress: "",
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { webApp, user } = useTelegram();
  const [isLogined, setIsLogined] = useState(false);
  const [dailyReward, setDailyReward] = useState(0);
  const [unfinishedTasks, setUnfinishedTasks] = useState(0);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [telegramWebApp, setTelegramWebApp] = useState<WebApp | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [sellTokens, setSellTokens] = useState(false);
  const [referralUserLink, setReferralUserLink] = useState("");
  const [referralTokenAddress, setReferralTokenAddress] = useState("");

  useEffect(() => {
    if (user?.id) {
      setTelegramUser(user);
    }
    if (webApp) {
      setTelegramWebApp(webApp);

      if (webApp.initDataUnsafe.start_param && user) {
        const startParam = webApp.initDataUnsafe.start_param;
        if (startParam.includes("-")) {
          const [_, subParam, tokenAddress] = startParam.split("-");
          const [referralLink] = subParam.split("_");
          setReferralUserLink(referralLink);
          if (!sessionStorage.getItem("firstRef")) {
            setReferralTokenAddress(tokenAddress);
          }
          router.replace("/portfolio");
        } else {
          userAxios
            .post(
              "/referrals",
              {
                referral: startParam,
                telegramId: user.id,
              },
              {
                headers: {
                  "Authorization": webApp.initData,
                },
              }
            )
            .then((response) => {
              console.log(response);
            });
        }
      }
    }
  }, [user, webApp, router]);

  const loadingHandler = (val: boolean) => {
    setLoading(val);
  };

  return (
    <AppContext.Provider
      value={{
        isLogined,
        setIsLogined,
        telegramUser,
        telegramWebApp,
        loading,
        loadingHandler,
        dailyReward,
        setDailyReward,
        unfinishedTasks,
        setUnfinishedTasks,
        sellTokens,
        setSellTokens,
        referralUserLink,
        referralTokenAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
