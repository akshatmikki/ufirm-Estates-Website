"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Head from "next/head";
import { LoginDialogProvider } from "@/app/CareerPage/LoginDialogContext";
import { LoginDialog } from "@/components/LoginDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoginDialogProvider>
          <NavBar />
          <LoginDialog />
          {children}
          <Footer />
          <BackToTop />
        </LoginDialogProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}