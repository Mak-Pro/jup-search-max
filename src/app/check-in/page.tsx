"use client";
import { useState, useEffect } from "react";
import { CheckIn, Rewards } from "@/components";
import { useTelegram } from "@/providers/telegram";
import { userAxios, headers } from "@/api";

export default function CheckInPage() {
  const { user } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [checkinCounter, setCheckinCounter] = useState(0);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (user) {
      const token = sessionStorage.getItem("token");
      userAxios
        .get(`/users/${user?.id}`, {
          headers: { ...headers, Authorization: token },
        })
        .then((res) => {
          const {
            data: { checkInCounter },
          } = res;
          setCheckinCounter(checkInCounter);
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          setLoading(false);
        });
    }
    setTimeout(() => setToggle(true), 5000);
  }, [user]);

  return (
    <>
      {!loading && !toggle && <CheckIn counter={checkinCounter} />}{" "}
      {!loading && toggle && <Rewards />}
    </>
  );
}
