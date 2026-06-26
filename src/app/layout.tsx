import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "ApprenticePortal",
  description: "Portal für Lernende – Teams entdecken, Stages beantragen, Events verfolgen.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
