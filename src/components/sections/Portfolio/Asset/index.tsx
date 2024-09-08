"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { hideText, numberFormatterSimple } from "@/helpers";
import toast from "react-hot-toast";
import styles from "./style.module.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTelegram } from "@/providers/telegram";
import { tradeAxios } from "@/api";
// @ts-ignore
import MiddleEllipsis from "react-middle-ellipsis";

interface PortfolioAssetProps {
  priceVisibility?: boolean;
  userData: {
    sol: number;
    address: string;
  };
}

interface BlockDataProps {
  symbol: string;
  logoURI: string;
  price: number | string;
  quantity: number;
  address: string;
}

export const PortfolioAsset = ({
  priceVisibility,
  userData,
}: PortfolioAssetProps) => {
  const { user, webApp } = useTelegram();
  const [blockData, setBlockData] = useState<BlockDataProps>({
    symbol: "",
    logoURI: "",
    price: 0,
    quantity: 0,
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && webApp) {
        try {
          const response = await tradeAxios.get(
            `/token/${process.env.NEXT_PUBLIC_SOLANA_ADDRESS}`,
            {
              headers: {
                "Authorization": webApp.initData,
              },
            }
          );
          const { data } = response;
          setBlockData({
            symbol: data.symbol,
            logoURI: data.logoURI,
            price: data.price.toFixed(2),
            quantity: userData.sol,
            address: userData.address,
          });
        } catch (error) {
          console.error("Error fetching token data:", error);
        }
      }
    };
    fetchData();
  }, [user, webApp, userData]);

  return (
    <div className={styles.asset}>
      <div className={styles.asset__info}>
        <div className={styles.asset__avatar}>
          {blockData.logoURI && (
            <Image src={blockData.logoURI} fill alt="Solana" />
          )}
        </div>
        <div className={styles.asset__title}>
          <h6>Solana</h6>
          <span>1 SOL = ${numberFormatterSimple(+blockData.price)}</span>
        </div>
        <div className={styles.asset__ballance}>
          {priceVisibility
            ? new Intl.NumberFormat("de-DE", {
                useGrouping: false,
              }).format(blockData.quantity)
            : hideText(
                new Intl.NumberFormat("de-DE", {
                  useGrouping: false,
                }).format(blockData.quantity),
                "•"
              )}{" "}
          SOL
        </div>
      </div>
      <p>Copy the address and deposit SOL</p>
      <div className={styles.asset__address}>
        <Image
          src="/icons/addon-wallet-icon.svg"
          width={20}
          height={20}
          alt="Wallet Address"
        />
        <div className={styles.asset__address_line}>
          <MiddleEllipsis>
            <span>{blockData.address}</span>
          </MiddleEllipsis>
        </div>

        <CopyToClipboard
          text={blockData.address}
          onCopy={() => {
            toast.success("Address Copied", {
              id: "address_copy",
            });
          }}
        >
          <button className={styles.asset__copy}>
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
  );
};
