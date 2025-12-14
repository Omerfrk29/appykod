import type { Metadata } from "next";
import { Anek_Latin, Special_Gothic_Expanded_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MotionProvider } from "@/components/MotionProvider";

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
  description: "Profesyonel web ve mobil uygulama geliştirme hizmetleri. React, Next.js, TypeScript ile modern çözümler.",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EE10SR94QF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EE10SR94QF');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <MotionProvider>
              {children}
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
