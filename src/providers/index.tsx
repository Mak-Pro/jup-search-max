"use client";
import { AppContextProvider } from "./context";
import { TelegramProvider } from "./telegram";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TelegramProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </TelegramProvider>
  );
};
