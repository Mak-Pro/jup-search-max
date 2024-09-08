"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import styles from "./style.module.scss";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";
import { cssVariables } from "@/assets/styles/variables";
// @ts-ignore
import MiddleEllipsis from "react-middle-ellipsis";

interface PortfolioShareProps {
  percent: number;
  current_price: number;
  entry_price: number;
  name: string;
  logo: string;
  address: string;
}

export const PortfolioShare = ({
  percent,
  current_price,
  entry_price,
  logo,
  name,
  address,
}: PortfolioShareProps) => {
  const { user, webApp } = useTelegram();
  const [shareExpand, setShareExpand] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (webApp) {
      tradeAxios
        .get("/user/referal", {
          headers: {
            Authorization: webApp.initData,
          },
        })
        .then((response) => {
          setShareUrl(response.data.url);
        });
    }
  }, [webApp]);

  return (
    <div className={styles.portfolio__share}>
      <div className={styles.portfolio__share_header}>
        <h3>Share the Results with Friends!</h3>
        <button
          onClick={() => setShareExpand((prev) => !prev)}
          className={`${styles.portfolio__share_toggle} ${
            !shareExpand && styles.portfolio__share_toggle_closed
          }`}
        >
          <Image
            src="/icons/addon-angle-up.svg"
            width={24}
            height={24}
            alt="toggle"
          />
        </button>
      </div>
      {shareExpand && (
        <div className={styles.portfolio__share_body}>
          <div className={styles.portfolio__share_panel}>
            <div className={styles.portfolio__share_panel_body}>
              <Image src="/images/share-banner.jpg" fill alt="share" />
              <div
                className={styles.portfolio__share_result}
                style={{
                  backgroundColor:
                    percent > 0
                      ? cssVariables.green40
                      : percent < 0
                      ? cssVariables.red
                      : cssVariables.gray40,
                }}
              >
                {percent > 0 ? `+${percent.toFixed(2)}` : percent.toFixed(2)}%
              </div>
              <div className={styles.portfolio__share_prices}>
                <div>
                  <span>Current Price</span> ${current_price.toFixed(8)}
                </div>
                <div>
                  <span>Entry price</span> ${entry_price.toFixed(8)}
                </div>
              </div>
              <div className={styles.portfolio__share_info}>
                <div className={styles.portfolio__share_info_icon}>
                  <Image src={logo} fill alt={name} />
                </div>
                <div className={styles.portfolio__share_info_title}>
                  <h2>{name}</h2>
                </div>
                <div className={styles.portfolio__share_info_link}>
                  <div className={styles.portfolio__share_info_bot}>
                    <Image
                      src="/images/addon-bot-avatar.svg"
                      width={32}
                      height={32}
                      alt="jup.bot"
                    />
                    <span>jup.bot</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.portfolio__share_panel_footer}>
              <div className={styles.portfolio__share_copy}>
                <div className={styles.portfolio__share_copy_url}>
                  <MiddleEllipsis>
                    <span>{`${shareUrl}_${address}`}</span>
                  </MiddleEllipsis>
                </div>

                <CopyToClipboard
                  text={`${shareUrl}_t-${address}`}
                  onCopy={() => {
                    toast.success("Link is copied!", {
                      id: "share_link_copy",
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
              </div>
              <p>
                Share your link and earn 25% <br /> from each referral fees{" "}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
