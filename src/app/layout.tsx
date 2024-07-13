import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "@/app/_components/navbar";
import { HydrateClient } from "@/trpc/server";
import BoxContainer from "@/app/_components/box-container";
import { HeadlessMantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Roc8 Ecommerce",
  description: "Roc8 Moonshot Ecommerce App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
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
      </body>
    </html>
  );
}
