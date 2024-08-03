import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "@/providers/ToastProvider";
import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/utilities/theme-provider";

export const metadata: Metadata = {
  title: "Marketplace | 7FyD.dev",
  description: "A simple marketplace app developed by 7FyD.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            <Navbar deletedUser={session !== null && !session?.user.isActive} />
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">{children}</div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
