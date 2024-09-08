import Script from "next/script";
import "@/assets/styles/globals.scss";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Telegram bot App",
  description: "Telegram bot App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-7GSMTHQR6D"
            id="gtm-script"
        />
        <Script id="gtm-config">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-7GSMTHQR6D');
            `}
        </Script>
    </head>
    <body className={inter.className}>
    <Providers>{children}</Providers>
    </body>
    </html>
  );
}
