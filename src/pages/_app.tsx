// pages/_app.tsx
import type { AppProps } from "next/app";
import MetaHead from "@/components/invitation/MetaHead";

import { Meow_Script, Manjari } from "next/font/google";

import "@/styles/globals.css";

// Fuentes
const meow = Meow_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-meow",
  display: "swap",
});
const manjari = Manjari({
  subsets: ["latin"],
  weight: ["400", "700"], // o los pesos que necesites
  variable: "--font-manjari",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${meow.variable} ${manjari.variable}`}>
      <MetaHead />
      <Component {...pageProps} />
    </main>
  );
}
