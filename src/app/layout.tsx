import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "@/components/navbar";
import { HydrateClient } from "@/trpc/server";
import BoxContainer from "@/components/box-container";
import { HeadlessMantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Roc8 Ecommerce",
  description: "Roc8 Moonshot Ecommerce App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <HeadlessMantineProvider>
              <Navbar />
              <main className="flex items-center justify-center py-10">
                <BoxContainer>{children}</BoxContainer>
              </main>
            </HeadlessMantineProvider>
          </HydrateClient>
        </TRPCReactProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
