"use client";
import { useRouter } from "next/navigation";
import { AddonInfo } from "@/components";
export default function JoinPage() {
  const router = useRouter();
  return (
    <>
      <AddonInfo
        image={{
          url: "/images/addon-join-img.svg",
          width: 380,
          height: 380,
          alt: "join",
        }}
        title="Nuh-uh! Solana one Love"
        text="Jupbot will always be dedicated to Solana and does not work with other blockchains"
        note="We are creating a new, grand product that will work with all blockchains"
        button={{
          text: "Join the Waitlist",
          icon: "/icons/addon-telegram-icon-white.svg",
          bgcolor: "#51A1E3",
          color: "#FFF",
          onClick: () => {
            router.replace("/");
          },
        }}
      />
    </>
  );
}
