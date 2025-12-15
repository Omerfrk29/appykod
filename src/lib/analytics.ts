/**
 * Google Analytics utility functions
 * Handles cookie consent and event tracking
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_CONSENT_EXPIRY_DAYS = 365;

export type CookieConsent = 'accepted' | 'declined' | null;

/**
 * Get default consent state based on user's region
 * Returns 'denied' for EU countries (GDPR compliant), 'denied' for others (default safe)
 * Can be customized to return 'granted' for non-EU regions if needed
 */
export function getDefaultConsentByRegion(): { ad_storage: 'granted' | 'denied'; analytics_storage: 'granted' | 'denied' } {
  if (typeof window === 'undefined') {
    return { ad_storage: 'denied', analytics_storage: 'denied' };
  }

  // Try to detect region from browser language or timezone
  // This is a simple heuristic - for production, consider using IP geolocation
  const navigatorWithLang = navigator as Navigator & { userLanguage?: string };
  const browserLang = navigator.language || navigatorWithLang.userLanguage || '';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  
  // Check if browser language suggests EU region
  const isEULike = browserLang.toUpperCase().includes('EU') || 
                   timezone.includes('Europe') ||
                   browserLang.startsWith('de') || // German
                   browserLang.startsWith('fr') || // French
                   browserLang.startsWith('it') || // Italian
                   browserLang.startsWith('es') || // Spanish
                   browserLang.startsWith('nl') || // Dutch
                   browserLang.startsWith('pl') || // Polish
                   browserLang.startsWith('pt') || // Portuguese
                   browserLang.startsWith('ro');   // Romanian

  // For GDPR compliance, default to 'denied' for all regions
  // Change to 'granted' for non-EU if you want to allow by default
  if (isEULike) {
    return { ad_storage: 'denied', analytics_storage: 'denied' };
  }

  // Default to 'denied' for all regions (GDPR compliant)
  // Uncomment below to allow by default for non-EU regions:
  // return { ad_storage: 'granted', analytics_storage: 'granted' };
  return { ad_storage: 'denied', analytics_storage: 'denied' };
}

/**
 * Get cookie consent status from localStorage
 */
export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consent === 'accepted' || consent === 'declined') {
    return consent;
  }
  return null;
}

/**
 * Set cookie consent status
 */
export function setCookieConsent(consent: 'accepted' | 'declined'): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(COOKIE_CONSENT_KEY, consent);
  
  // Set expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_CONSENT_EXPIRY_DAYS);
  localStorage.setItem(`${COOKIE_CONSENT_KEY}-expiry`, expiryDate.toISOString());
  
  // Update consent mode (script should already be loaded)
  updateConsentMode(consent === 'accepted');
  
  // Initialize GA config if consent is given
  if (consent === 'accepted') {
    initializeGoogleAnalytics();
  }
}

/**
 * Check if cookie consent has expired
 */
export function hasCookieConsentExpired(): boolean {
  if (typeof window === 'undefined') return false;
  
  const expiryStr = localStorage.getItem(`${COOKIE_CONSENT_KEY}-expiry`);
  if (!expiryStr) return true;
  
  const expiryDate = new Date(expiryStr);
  return new Date() > expiryDate;
}

/**
 * Initialize Consent Mode with region-based default state (GDPR compliant)
 * This should be called before GA script loads
 */
export function initializeConsentMode(): void {
  if (typeof window === 'undefined') return;
  
  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  
  window.gtag = gtag;
  
  // Get default consent state based on region
  const defaultConsent = getDefaultConsentByRegion();
  
  // Set default consent state (region-based)
  gtag('consent', 'default', {
    ad_storage: defaultConsent.ad_storage,
    analytics_storage: defaultConsent.analytics_storage,
    wait_for_update: 2000,
  });
}

/**
 * Update consent mode based on user choice
 * @param accepted - Whether user accepted consent
 * @param enableAdsDataRedaction - Whether to enable ads_data_redaction (removes GCLID/DCLID from URLs)
 */
export function updateConsentMode(accepted: boolean, enableAdsDataRedaction: boolean = true): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  if (accepted) {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  } else {
    const updateParams: {
      ad_storage: 'denied';
      analytics_storage: 'denied';
      ads_data_redaction?: 'true';
    } = {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    };
    
    // Enable ads_data_redaction to remove GCLID/DCLID from URLs when consent is denied
    if (enableAdsDataRedaction) {
      updateParams.ads_data_redaction = 'true';
    }
    
    window.gtag('consent', 'update', updateParams);
  }
}

/**
 * Initialize Google Analytics configuration
 * Note: Script should already be loaded via layout.tsx
 */
export function initializeGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) {
    console.warn('[Analytics] NEXT_PUBLIC_GA_ID is not set');
    return;
  }
  
  // Ensure dataLayer and gtag are initialized
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  
  if (!window.gtag) {
    function gtag(...args: unknown[]): void {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
  }
  
  // Configure GA
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

/**
 * Track a custom event
 * Note: With consent mode, events are tracked even if consent is denied (as cookieless pings)
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) {
    console.warn('[Analytics] gtag is not initialized');
    return;
  }
  
  // With consent mode, we can track events even without consent
  // GA will send cookieless pings if consent is denied
  window.gtag('event', eventName, eventParams);
}

/**
 * Track page view
 * Note: With consent mode, page views are tracked even if consent is denied (as cookieless pings)
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) {
    return;
  }
  
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) {
    return;
  }
  
  // With consent mode, we can track page views even without consent
  // GA will send cookieless pings if consent is denied
  window.gtag('config', gaId, {
    page_path: url,
  });
}

/**
 * Common event tracking functions
 */
export const analytics = {
  // Contact form events
  contactFormSubmit: (success: boolean) => {
    trackEvent('contact_form_submit', {
      success,
      event_category: 'engagement',
      event_label: success ? 'success' : 'error',
    });
  },
  
  // CTA button clicks
  ctaClick: (ctaName: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      event_category: 'engagement',
    });
  },
  
  // Navigation clicks
  navClick: (linkName: string) => {
    trackEvent('nav_click', {
      link_name: linkName,
      event_category: 'navigation',
    });
  },
  
  // Service card clicks
  serviceClick: (serviceId: string, serviceName: string) => {
    trackEvent('service_click', {
      service_id: serviceId,
      service_name: serviceName,
      event_category: 'engagement',
    });
  },
  
  // Project card clicks
  projectClick: (projectId: string, projectName: string) => {
    trackEvent('project_click', {
      project_id: projectId,
      project_name: projectName,
      event_category: 'engagement',
    });
  },
  
  // External link clicks
  externalLinkClick: (url: string, linkText: string) => {
    trackEvent('external_link_click', {
      link_url: url,
      link_text: linkText,
      event_category: 'outbound',
    });
  },
  
  // Cookie consent
  cookieConsent: (accepted: boolean) => {
    trackEvent('cookie_consent', {
      accepted,
      event_category: 'privacy',
    });
  },
};
