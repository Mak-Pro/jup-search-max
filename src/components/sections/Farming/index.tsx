"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { useTelegram } from "@/providers/telegram";
import AppContext from "@/providers/context";
import Lottie from "lottie-react";
import Image from "next/image";
import {
  User,
  MediaBox,
  Spacer,
  CountdownBox,
  ActionBox,
  Board,
  Mascot,
  Navigation,
  Marketplace,
  Button,
} from "@/components";
import styles from "./style.module.scss";
import { userAxios, headers } from "@/api";
import { UserProps } from "@/Types";
import { gtagEvent } from "@/helpers";
import claimAnimation from "@/assets/json/claim.json";
import { cssVariables } from "@/assets/styles/variables";

const limitHours = 6;

export const Farming = () => {
  const { setDailyReward, setUnfinishedTasks } = useContext(AppContext);
  const router = useRouter();
  const { user, webApp } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [claimPoints, setClaimPoints] = useState(0);
  const [prevPoints, setPrevPoints] = useState(0);
  const [userData, setUserData] = useState<UserProps>({
    avatarLink: "/images/avatar-stub.webp",
    username: "",
  });

  // game
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState<"READY" | "FARMING">("READY");
  const [mascot, setMascot] = useState(false);
  const [home, setHome] = useState(true);

  const startHandler = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await userAxios.post(
        "/games/start",
        { telegramId: user?.id },
        { headers: { ...headers, "Authorization": token } }
      );
      const { clickerStatus, startTime } = res.data;
      setStartTime(startTime);
      setStatus(clickerStatus);
      setHome(false);
    } catch (error) {
      console.error(error);
    }
  };

  const resetHandler = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await userAxios.post(
        "/games/info",
        { telegramId: user?.id },
        { headers: { ...headers, "Authorization": token } }
      );
      const { clickerStatus } = res.data;
      setStatus(clickerStatus);
      setClaim(false);
      setHome(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (webApp) {
      const {
        initData,
        initDataUnsafe: { hash },
      } = webApp;

      userAxios
        .post(`/auth/telegram/login`, {
          initData,
          hash,
        })
        .then((response) => {
          const {
            data: { accessToken },
          } = response;
          sessionStorage.setItem("token", `Bearer ${accessToken}`);
        })
        .then(() => {
          const token = sessionStorage.getItem("token");
          const getUserData = userAxios.get(`/users/${user?.id}`, {
            headers: {
              ...headers,
              "Authorization": token,
            },
          });
          const getGameData = userAxios.post(
            `/games/info`,
            {
              telegramId: user?.id,
            },
            {
              headers: {
                ...headers,
                "Authorization": token,
              },
            }
          );
          return Promise.allSettled([getGameData, getUserData]);
        })
        .then((res) => {
          res.forEach((result) => {
            if (result.status === "rejected") {
              const {
                response: {
                  data: { error },
                },
              } = result.reason;

              if (error.includes("telegram id")) {
                router.replace("/onboarding");
              }
            }

            if (result.status === "fulfilled") {
              const data = result.value.data;

              // user
              if (data.hasOwnProperty("username")) {
                const {
                  jupbotPoints,
                  dailyReward,
                  unfinishedTasks,
                  firstCheckIn,
                } = data;

                if (dailyReward !== null) {
                  setDailyReward(dailyReward);
                  setUnfinishedTasks(unfinishedTasks);
                }
                if (firstCheckIn) {
                  router.replace("/check-in");
                } else {
                  setUserData({
                    ...userData,
                    username: data.username,
                    avatarLink: data.avatarLink,
                  });
                  setTotalPoints(jupbotPoints);
                }
              }
              // game
              if (data.hasOwnProperty("clickerStatus")) {
                setStatus(data.clickerStatus);
                setStartTime(data.startTime);
                setPrevPoints(data.points);
                if (data.clickerStatus === "FARMING") {
                  setHome(false);
                }
              }
            }
          });
        })
        .catch((error) => {
          console.log(error.message);
          // router.replace("/onboarding");
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
            document.body.classList.add("show");
          }, 1000);
        });
    }
  }, [user]);

  if (loading) return null;

  return (
    <>
      <div
        className={`${styles.farming} ${!loading ? styles.farming_show : ""}`}
      >
        {/* START */}
        {((status !== "FARMING" && !claim) || home) && (
          <>
            <div className={styles.farming__start}>
              <div className={styles.farming__start_top}>
                <User {...userData} />
                <div className={styles.farming__start_top_points}>
                  <Image
                    src="/icons/coin-star-icon-white.svg"
                    width={28}
                    height={28}
                    alt="points"
                  />
                  <span>{totalPoints}</span>
                </div>
              </div>

              <MediaBox>
                <Image src="/images/home-image.svg" fill alt="farming" />
              </MediaBox>
              <ActionBox
                icon="/icons/ufo.svg"
                title="Earn Extra Rewards by Completing Tasks"
                button={{
                  text: "Explore Tasks",
                  type: "link",
                  href: "/tasks",
                  onClick: () =>
                    gtagEvent({
                      action: "click",
                      category: "button",
                      label: "tasks",
                      value: 1,
                    }),
                }}
              />
            </div>
            <Spacer space={15} />
          </>
        )}
        {home && status === "FARMING" && (
          <div className={styles.farming__forward}>
            <Button
              type="medium"
              variant="filled"
              color={cssVariables.green}
              onClick={() => setHome(false)}
            >
              View Jupping
            </Button>
          </div>
        )}
        <div
          className={`${styles.farming__counter_box} ${
            status !== "FARMING" && !claim && home
              ? styles.farming__counter_box_sticky
              : ""
          }`}
        >
          <CountdownBox
            startTime={startTime}
            totalTime={limitHours * 60 * 60 * 1000}
            className={styles.farming__counter}
            startClick={startHandler}
            claim={claim}
            claimClick={(status, points, userJupbotPoints) => {
              setClaim(true);
              setStatus(status);
              setClaimPoints(points);
              setTotalPoints(userJupbotPoints);
              setHome(false);
            }}
            resetClick={resetHandler}
            status={status}
            userId={String(user?.id) as string}
            initialPoints={totalPoints}
            prevPoints={prevPoints}
            home={home}
          />
        </div>

        {((status !== "FARMING" && !claim) || home) && <Marketplace />}

        {/* CLAIM */}
        {claim && status !== "FARMING" && (
          <div className={styles.farming__claim}>
            <div className={styles.farming__claim_image}>
              <Lottie
                animationData={claimAnimation}
                className={styles.farming__claim_animation}
                loop={false}
              />
            </div>
            <div className={styles.farming__claim_content}>
              <h3 className={styles.farming__claim_title}>Congratulations!</h3>
              <p>Claim your reward</p>
            </div>
            <div className={styles.farming__claim_boards}>
              <Board
                icon="/icons/coin-star-icon-white.svg"
                title="Jupbot Points"
                value={`+${claimPoints}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* FARMING */}
      {status === "FARMING" && !claim && !home && (
        <>
          <div className={styles.farming__back}>
            <Button
              type="medium"
              variant="filled"
              color={cssVariables.green}
              onClick={() => setHome(true)}
            >
              Back to Home
            </Button>
          </div>

          <Mascot loadTrigger={(val) => setMascot(val)} />
        </>
      )}
      <Navigation />
    </>
  );
};
