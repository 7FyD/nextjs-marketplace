import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "@/providers/ToastProvider";
import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

import Navbar from "@/components/navbar/Navbar";
import { getNotifications } from "./actions/get-notifications";
import { ThemeProvider } from "@/components/utilities/theme-provider";

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
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            <Navbar
              deletedUser={session !== null && !session?.user.isActive}
              followNotifications={followNotifications}
              listingNotifications={listingNotifications}
              reportNotifications={reportNotifications}
            />
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">{children}</div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
