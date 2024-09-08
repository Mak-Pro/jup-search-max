"use client";
import { useState } from "react";
import { Board, Spacer, Button, Modal } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import styles from "./style.module.scss";
import { gtagEvent } from "@/helpers";

export const Marketplace = () => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <div className={styles.marketplace}>
        <h3 className={styles.marketplace__title}>Marketplace</h3>
        <Spacer space={20} />
        <Board
          icon="/icons/coin-star-icon-green.svg"
          text="Stake JPP to the Future JPC Airdrop"
          onClick={() => {
            setModal(true);
            gtagEvent({
              action: "click",
              category: "Marketplace",
              label: "Stake JPP to the Future JPC Airdrop",
            });
          }}
        />
        <Spacer space={10} />
        <Board
          icon="/icons/katman-icon.svg"
          text="Exchange JPP to JUP"
          onClick={() => {
            setModal(true);
            gtagEvent({
              action: "click",
              category: "Marketplace",
              label: "Exchange JPP to JUP",
            });
          }}
        />
        <Spacer space={10} />
        <Board
          icon="/icons/bell-icon-green.svg"
          text="Subscribe to Memecoin Airdrops"
          onClick={() => {
            setModal(true);
            gtagEvent({
              action: "click",
              category: "Marketplace",
              label: "Subscribe to Memecoin Airdrops",
            });
          }}
        />
        <Spacer space={10} />
        <Board
          icon="/icons/mascot-small-icon.svg"
          text="Buy 3 Premium Signals for Memecoins in Next 72 Hours"
          onClick={() => {
            setModal(true);
            gtagEvent({
              action: "click",
              category: "Marketplace",
              label: "Buy 3 Premium Signals for Memecoins in Next 72 Hours",
            });
          }}
        />
        <Spacer space={10} />
      </div>
      <Modal show={modal} closeHandler={() => setModal(false)}>
        <div className={styles.marketplace__modal_header}>
          <h5>
            This feature is available only to users with more than 100,000 JPP.{" "}
          </h5>
          <p>Keep using the app to unlock this section.</p>
        </div>
        <div className={styles.marketplace__modal_body}>
          <Button
            type="large"
            variant="outlined"
            color={cssVariables.green}
            onClick={() => {
              setModal(false);
            }}
          >
            Keep Using
          </Button>
        </div>
      </Modal>
    </>
  );
};
