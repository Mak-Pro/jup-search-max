"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/components";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";
import AppContext from "@/providers/context";

export default function PortfolioPage() {
  const router = useRouter();
  const { user, webApp } = useTelegram();
  const { referralUserLink } = useContext(AppContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (webApp && user) {
        try {
          const response = await tradeAxios.get(`/user/info`, {
            headers: {
              "Authorization": webApp.initData,
            },
          });

          const firstRef = sessionStorage.getItem("firstRef");
          if (webApp?.initDataUnsafe.start_param && !firstRef) {
            const data = {
              partner: "",
              referral: referralUserLink,
              telegramId: user.id,
            };

            const referralResponse = await tradeAxios.post(
              `/webhook/referral`,
              data,
              {
                headers: {
                  "Authorization": webApp.initData,
                },
              }
            );

            if (referralResponse.status === 200) {
              router.replace("/search");
            }
          }
        } catch (error) {
          console.error("Error fetching user info or posting referral:", error);
        }
      }
    };

    fetchUserInfo();
  }, [user, webApp, referralUserLink, router]);

  return <Portfolio />;
}
