'use client';

import React, { createContext, useContext, useSyncExternalStore, useCallback } from 'react';
import trTranslations from '@/locales/tr.json';
import enTranslations from '@/locales/en.json';

type Language = 'tr' | 'en';

const translationsMap: Record<Language, typeof trTranslations> = {
  tr: trTranslations,
  en: enTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom store için listeners
const listeners = new Set<() => void>();

// localStorage'dan dil tercihini okuma fonksiyonu
function getLanguageFromStorage(): Language {
  if (typeof window === 'undefined') {
    return 'tr'; // Sunucu tarafında her zaman varsayılan dil
  }
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
    return savedLanguage;
  }
  return 'tr';
}

// Custom store subscribe fonksiyonu
function subscribe(callback: () => void) {
  listeners.add(callback);
  // localStorage değişikliklerini de dinle (diğer tab'lar için)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

// Store'u güncellemek için fonksiyon
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore kullanarak localStorage'dan dil tercihini senkronize et
  // Bu, hydration hatasını önler ve React'in önerdiği yaklaşımdır
  const language = useSyncExternalStore(
    subscribe,
    getLanguageFromStorage,
    () => 'tr' // Sunucu tarafında her zaman varsayılan dil
  ) as Language;

  const translations = translationsMap[language] || translationsMap.tr;

  const setLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      // Custom store listeners'ları bilgilendir
      notifyListeners();
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Anahtar bulunamazsa anahtarı döndür
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
