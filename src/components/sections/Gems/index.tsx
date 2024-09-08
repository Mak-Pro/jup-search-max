"use client";
import React, { useEffect, useState } from "react";
import { CollectionSlider, Spacer } from "@/components";
import { CollecttionProps } from "@/Types";
import useWebSocket from "react-use-websocket";
import styles from "./style.module.scss";

export const Gems = () => {
  const [collections, setCollections] = useState<CollecttionProps[]>([]);
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(
    `${process.env.NEXT_PUBLIC_WS_GEMS_API}/plain-websocket/explore`,
    {
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    const data = lastJsonMessage as any;
    if (data === null || data === undefined) {
      fetch(`${process.env.NEXT_PUBLIC_GEMS_API}/site/collections/explore`)
        .then((res) => res.json())
        .then((data) => {
          return data.collections;
        })
        .then((collections) => {
          setCollections(collections);
        });
    } else {
      if (
        (data !== null || data !== undefined) &&
        data.hasOwnProperty("collections")
      ) {
        setCollections(data.collections);
      }
    }
  }, [lastJsonMessage]);

  return (
    <div className={styles.gems}>
      <Spacer space={20} />
      {collections.map((collection: CollecttionProps) => (
        <React.Fragment key={collection.id}>
          <CollectionSlider {...collection} />
          <Spacer space={32} />
        </React.Fragment>
      ))}
    </div>
  );
};
