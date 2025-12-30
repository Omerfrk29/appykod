import type { Metadata } from "next";
import { Anek_Latin, Special_Gothic_Expanded_One } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MotionProvider } from "@/components/MotionProvider";
import CookieConsent from "@/components/CookieConsent";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CustomCursor from "@/components/CustomCursor";

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
    default: "Appykod - Creative Digital Agency",
    template: "%s | Appykod",
  },
  description: "We craft award-winning digital experiences. Web, Mobile, and Brand Identity.",
  keywords: ["web development", "creative agency", "software", "react", "nextjs", "typescript", "appykod"],
  authors: [{ name: "Appykod" }],
  creator: "Appykod",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://appykod.com",
    siteName: "Appykod",
    title: "Appykod - Creative Digital Agency",
    description: "We craft award-winning digital experiences. Web, Mobile, and Brand Identity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appykod - Creative Digital Agency",
    description: "We craft award-winning digital experiences. Web, Mobile, and Brand Identity.",
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
    <html lang="en" suppressHydrationWarning className={`${anekLatin.variable} ${specialGothic.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false} 
          disableTransitionOnChange
        >
          <LanguageProvider>
            <MotionProvider>
              <CustomCursor />
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