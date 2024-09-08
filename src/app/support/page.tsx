"use client";
import { useRouter } from "next/navigation";
import { AddonInfo } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
export default function SupportPage() {
  const router = useRouter();
  return (
    <>
      <AddonInfo
        image={{
          url: "/images/addon-support-img.svg",
          width: 380,
          height: 380,
          alt: "join",
        }}
        title="Yikes! This Site is Not On Our List of Supported"
        marquee={[
          {
            url: "/images/birdeye-logo.svg",
            width: 108,
            height: 28,
            alt: "birdeye",
          },
          {
            url: "/images/dxscreener-logo.svg",
            width: 118,
            height: 28,
            alt: "dxscreener",
          },
          {
            url: "/images/dextoor-logo.svg",
            width: 98,
            height: 28,
            alt: "dextoor",
          },
          {
            url: "/images/geko-logo.svg",
            width: 157,
            height: 29,
            alt: "geko",
          },
        ]}
        button={{
          text: "Contact Support",
          icon: "/icons/addon-telegram-icon.svg",
          bgcolor: cssVariables.green,
          color: "#000",
          onClick: () => {
            router.replace("/join");
          },
        }}
      />
    </>
  );
}
