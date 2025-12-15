'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getCookieConsent, updateConsentMode, initializeGoogleAnalytics } from '@/lib/analytics';

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // If user has previously given consent, update consent mode and initialize GA
    const consent = getCookieConsent();
    if (consent === 'accepted') {
      updateConsentMode(true);
      initializeGoogleAnalytics();
    }
  }, []);

  if (!gaId) {
    return null;
  }

  return (
    <>
      {/* Initialize consent mode and GA config BEFORE GA script loads */}
      <Script
        id="google-analytics-consent"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 2000,
            });
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}
