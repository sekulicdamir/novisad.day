
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Locale, Translations } from '../types';
import { translations as initialTranslations } from '../translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const SUPPORTED_LOCALES: Locale[] = ['sr', 'hr', 'me', 'en', 'ru', 'de', 'uk', 'tr', 'es', 'zh-HK', 'zh-CN', 'ja', 'hi'];

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLocale = (): Locale => {
  const storedLocale = localStorage.getItem('locale');
  if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale as Locale)) {
    return storedLocale as Locale;
  }
  
  const browserLang = navigator.language;
  const browserLangShort = browserLang.split('-')[0];

  if (browserLang === 'sr-Latn') return 'sr';
  if (browserLang === 'sr') return 'sr';
  if (browserLang === 'hr') return 'hr';
  if (browserLang === 'me') return 'me';
  if (browserLang === 'zh-HK') return 'zh-HK';
  if (browserLang === 'zh-CN' || browserLangShort === 'zh') return 'zh-CN';
  if (SUPPORTED_LOCALES.includes(browserLangShort as Locale)) {
    return browserLangShort as Locale;
  }

  return 'en';
};

// New context for translations data
interface TranslationsContextType {
  translations: Translations;
  setTranslations: React.Dispatch<React.SetStateAction<Translations>>;
}

export const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

const TranslationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  return (
    <TranslationsContext.Provider value={{ translations, setTranslations }}>
      {children}
    </TranslationsContext.Provider>
  );
};


export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale());

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale.split('-')[0];
  }, [locale]);

  return (
    <TranslationsProvider>
      <LanguageContext.Provider value={{ locale, setLocale }}>
        {children}
      </LanguageContext.Provider>
    </TranslationsProvider>
  );
};
