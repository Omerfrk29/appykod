import type { Metadata } from "next";
import { Special_Gothic_Expanded_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MotionProvider } from "@/components/MotionProvider";
import CookieConsent from "@/components/CookieConsent";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Google Font - Special Gothic Expanded One (Logo font)
const specialGothic = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: {
    default: "Appykod - Modern Yazılım Çözümleri",
    template: "%s | Appykod",
  },
  description: "Profesyonel web ve mobil uygulama geliştirme hizmetleri. React, Next.js ve TypeScript ile modern yazılım çözümleri.",
  keywords: ["web geliştirme", "mobil uygulama", "yazılım", "react", "nextjs", "typescript", "appykod"],
  authors: [{ name: "Appykod" }],
  creator: "Appykod",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://appykod.com",
    siteName: "Appykod",
    title: "Appykod - Modern Yazılım Çözümleri",
    description: "Profesyonel web ve mobil uygulama geliştirme hizmetleri.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appykod - Modern Yazılım Çözümleri",
    description: "Profesyonel web ve mobil uygulama geliştirme hizmetleri.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={specialGothic.variable}>
      <head>
        {/* Satoshi Font from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-bg-base text-text-primary transition-colors duration-300" suppressHydrationWarning>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-amber focus:text-white focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
        >
          Ana içeriğe atla
        </a>

        {/* Google Analytics with Consent Mode - loads before page content */}
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <MotionProvider>
              <PageViewTracker />
              {children}
              <CookieConsent />
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
