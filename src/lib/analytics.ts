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
  
  // Initialize or update GA based on consent
  if (consent === 'accepted') {
    initializeGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
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
 * Initialize Google Analytics if consent is given
 */
export function initializeGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) {
    console.warn('[Analytics] NEXT_PUBLIC_GA_ID is not set');
    return;
  }
  
  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  
  window.gtag = gtag;
  
  // Configure GA
  gtag('js', new Date());
  gtag('config', gaId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
  
  // Load GA script if not already loaded
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
  }
}

/**
 * Disable Google Analytics
 */
export function disableGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // Clear dataLayer
  if (window.dataLayer) {
    window.dataLayer = [];
  }
  
  // Remove GA cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  
  const consent = getCookieConsent();
  if (consent !== 'accepted') {
    console.log('[Analytics] Event not tracked - no consent:', eventName);
    return;
  }
  
  if (!window.gtag) {
    console.warn('[Analytics] gtag is not initialized');
    return;
  }
  
  window.gtag('event', eventName, eventParams);
}

/**
 * Track page view
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  
  const consent = getCookieConsent();
  if (consent !== 'accepted') {
    return;
  }
  
  if (!window.gtag) {
    return;
  }
  
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
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
