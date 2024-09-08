"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { tradeAxios } from "@/api";
import { useTelegram } from "@/providers/telegram";
import styles from "./style.module.scss";
import { cssVariables } from "@/assets/styles/variables";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
// @ts-ignore
import MiddleEllipsis from "react-middle-ellipsis";

export const PortfolioSettings = ({ clear }: { clear?: boolean }) => {
  const { user, webApp } = useTelegram();
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const handlePrivateKey = async () => {
    if (webApp) {
      setPrivateKey(null);
      try {
        const response = await tradeAxios.get(`/user/wallet/export`, {
          headers: {
            "Authorization": webApp.initData,
          },
        });
        setPrivateKey(response.data.private_key);
      } catch (error) {
        toast.error("Failed to export private key");
      }
    }
  };

  useEffect(() => {
    if (clear) {
      const timer = setTimeout(() => {
        setPrivateKey(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [clear]);

  return (
    <div className={styles.settings}>
      <h3 className={styles.settings__title}>Settings</h3>
      <div className={styles.settings__list}>
        <div className={styles.settings__list_item}>
          {privateKey && (
            <div className={styles.settings__list_item_result}>
              <h6>
                <strong>Do not share your private key!</strong>
                <br />
                If someone has your private key they will have full control of
                your wallet.
              </h6>
              <div className="copy__box">
                <i></i>
                <div className="copy__box_line">
                  <MiddleEllipsis>
                    <span>{privateKey}</span>
                  </MiddleEllipsis>
                </div>
                <CopyToClipboard
                  text={privateKey}
                  onCopy={() => {
                    toast.success("Private Key is Copied!", {
                      id: "private_key_copy",
                    });
                  }}
                >
                  <button className="copy__box_button">
                    <Image
                      src="/icons/addon-copy-icon.svg"
                      width={18}
                      height={18}
                      alt="copy"
                    />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}
          <Button
            type="medium"
            variant="outlined"
            color={cssVariables.green}
            onClick={handlePrivateKey}
            borderRadius={12}
          >
            Export Private Key
          </Button>
        </div>
      </div>
    </div>
  );
};
