import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "@/providers/ToastProvider";
import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

import Navbar from "./components/navbar/Navbar";
import { getNotifications } from "./actions/get-notifications";

export const metadata: Metadata = {
  title: "Marketplace | 7FyD.dev",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const { followNotifications, listingNotifications, reportNotifications } =
    await getNotifications();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          <Navbar
            followNotifications={followNotifications}
            listingNotifications={listingNotifications}
            reportNotifications={reportNotifications}
          />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
