"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { BackToTop } from "@/components/BackToTop";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { LoginDialogProvider } from "@/app/CareerPage/LoginDialogContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load Footer
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-[#1e2d3d]" />,
});

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
  useEffect(() => {
    // SEO Meta Tags
    document.title = "UFirm - End-to-End Real Estate Performance Management";
    
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      let meta = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', 'UFirm integrates URest facility management and Firmity CMMS into a single ecosystem—connecting day-to-day operations with intelligent asset management to create lasting value.');
    setMetaTag('keywords', 'facility management, CMMS, real estate operations, asset management, property maintenance, URest, Firmity, UFirm');
    setMetaTag('og:title', 'UFirm - End-to-End Real Estate Performance Management', true);
    setMetaTag('og:description', 'Connecting day-to-day operations with intelligent asset management for real estate.', true);
    setMetaTag('og:url', 'https://ufirm.in/', true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('robots', 'index, follow');

    // DNS Prefetch for external domains
    const addDNSPrefetch = (domain: string) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    };

    addDNSPrefetch('https://urest.in');
    addDNSPrefetch('https://www.royalnestgroup.com');
    addDNSPrefetch('https://www.firmity.in');
    addDNSPrefetch('https://account.ufirm.in');

    // Preload critical images
    const preloadImage = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      document.head.appendChild(link);
    };

    preloadImage('/Assets/carousel_1.webp');
    preloadImage('/Assets/ufirmlogo.svg');
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoginDialogProvider>
          <NavBar />
          <LoginDialog />
          {children}
          <Footer />
          <BackToTop />
        </LoginDialogProvider>
        {process.env.NODE_ENV === 'production' && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}