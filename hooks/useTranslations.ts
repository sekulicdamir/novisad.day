
import { useContext } from 'react';
import { LanguageContext, TranslationsContext } from '../contexts/LanguageContext';
import type { Locale } from '../types';

export const useTranslations = () => {
  const langContext = useContext(LanguageContext);
  const transContext = useContext(TranslationsContext);

  if (!langContext || !transContext) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }

  const { locale } = langContext;
  const { translations } = transContext;

  const t = (key: string): string => {
    return translations[key]?.[locale] || key;
  };

  // FIX: Simplified and corrected the type for `content` to allow objects with optional locale keys, fixing type errors.
  const translate = (content: string | { [key in Locale]?: string }): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      return content[locale] || content['en'] || '';
    }
    return '';
  };
  
  return { 
    t, 
    translate, 
    locale, 
    setLocale: langContext.setLocale,
    translations,
    setTranslations: transContext.setTranslations
  };
};
