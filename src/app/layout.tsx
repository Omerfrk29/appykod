import type { Metadata } from "next";
import { Anek_Latin, Special_Gothic_Expanded_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MotionProvider } from "@/components/MotionProvider";
import CookieConsent from "@/components/CookieConsent";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Google Font - Anek Latin (Ana font)
const anekLatin = Anek_Latin({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-anek-latin",
});

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
    <html lang="tr" suppressHydrationWarning className={`${anekLatin.variable} ${specialGothic.variable}`}>
      <body className="font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300" suppressHydrationWarning>
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
