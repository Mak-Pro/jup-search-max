"use client";
import { useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { useTelegram } from "@/providers/telegram";
import AppContext from "@/providers/context";
import { Navigation, SpinnerLoader } from "@/components";
import { cssVariables } from "@/assets/styles/variables";
import { Toaster } from "react-hot-toast";
import SuccessIcon from "@public/icons/addon-check-icon-alt.svg";

const navPages = [
  "/tasks",
  "/friends",
  "/marketplace",
  "/gems",
  "/portfolio",
  "/search",
];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { webApp } = useTelegram();
  const { loading, sellTokens } = useContext(AppContext);

  useEffect(() => {
    webApp?.ready();
    webApp?.expand();
    if (webApp) {
      // @ts-ignore
      webApp.disableVerticalSwipes();
      document.body.classList.add(webApp?.colorScheme);
    }
    webApp?.onEvent("themeChanged", () => {
      if (webApp?.colorScheme === "dark") {
        document.body.classList.remove("light");
        document.body.classList.add(webApp?.colorScheme);
      }
      if (webApp?.colorScheme === "light") {
        document.body.classList.remove("dark");
        document.body.classList.add(webApp?.colorScheme);
      }
    });
    if (pathname !== "/") {
      document.body.classList.add("show");
    }
  }, [webApp]);

  return (
    <>
      <main>{children}</main>
      {navPages.includes(pathname) && !sellTokens && <Navigation />}
      <SpinnerLoader className={`${loading ? "show" : ""}`} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            backgroundColor: cssVariables.gray00,
            color: cssVariables.white,
            fontSize: 14,
            fontWeight: 400,
            borderRadius: 12,
            padding: "8px 15px",
          },
          success: {
            icon: <SuccessIcon />,
            style: {
              backgroundColor: "#004C3F",
              color: cssVariables.green40,
            },
          },
          error: {
            style: {
              backgroundColor: cssVariables.red,
              color: cssVariables.black,
            },
          },
        }}
      />
    </>
  );
}
