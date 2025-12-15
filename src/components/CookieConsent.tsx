'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCookieConsent, setCookieConsent, hasCookieConsentExpired, updateConsentMode, initializeGoogleAnalytics, analytics } from '@/lib/analytics';

export default function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has been given or expired
    const consent = getCookieConsent();
    const expired = hasCookieConsentExpired();
    
    // Show banner if no consent or expired
    if (!consent || expired) {
      setShowBanner(true);
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 100);
    } else {
      // Update consent mode based on previous choice
      // Script should already be loaded via layout.tsx
      updateConsentMode(consent === 'accepted');
      if (consent === 'accepted') {
        // Initialize GA config if consent was previously given
        initializeGoogleAnalytics();
      }
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent('accepted');
    // updateConsentMode is already called in setCookieConsent
    analytics.cookieConsent(true);
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    setCookieConsent('declined');
    // updateConsentMode is already called in setCookieConsent
    analytics.cookieConsent(false);
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-info/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {t('cookies.title')}
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3">
                  {t('cookies.message')}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Info size={14} />
                    <span>{t('cookies.necessary')}</span>
                  </div>
                  <span>•</span>
                  <span>{t('cookies.analytics')}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {t('cookies.decline')}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-info rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {t('cookies.accept')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
