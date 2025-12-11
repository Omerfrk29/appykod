'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  getValue: (key: string) => unknown;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // İlk render'da sunucu ile aynı değeri kullan (hydration hatasını önlemek için)
  const [language, setLanguageState] = useState<Language>('tr');

  // Mount olduktan sonra localStorage'dan okunan değere geç
  useEffect(() => {
    setLanguageState(getLanguageFromStorage());

    // localStorage değişikliklerini dinle (diğer tab'lar için)
    const handleStorageChange = () => {
      setLanguageState(getLanguageFromStorage());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const translations = translationsMap[language] || translationsMap.tr;

  const setLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
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

  const getValue = (key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getValue }}>
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
