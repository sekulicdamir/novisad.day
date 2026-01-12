
import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Locale } from '../types';

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale, t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const languages: { code: Locale; name: string; flag: string }[] = [
        { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
        { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
        { code: 'me', name: 'Crnogorski', flag: '🇲🇪' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'uk', name: 'Українська', flag: '🇺🇦' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'zh-HK', name: '繁體中文', flag: '🇭🇰' },
        { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    ];

    const selectedLanguage = languages.find(lang => lang.code === locale) || languages[3]; // Default to English

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSelect = (langCode: Locale) => {
        setLocale(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-transparent rounded-lg py-2 pl-3 pr-2 text-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition w-24"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={t('contactAriaLabel')}
            >
                <span>{selectedLanguage.flag} {selectedLanguage.code.toUpperCase()}</span>
                <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
            </button>
            {isOpen && (
                <ul
                    className="absolute bottom-full mb-2 w-48 bg-dark/90 backdrop-blur-lg border border-light/10 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 animate-fade-in"
                    role="listbox"
                >
                    {languages.map((lang) => (
                        <li key={lang.code}>
                            <button
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${locale === lang.code ? 'bg-primary/20 text-light' : 'text-gray-text hover:bg-secondary hover:text-light'}`}
                                role="option"
                                aria-selected={locale === lang.code}
                            >
                                <span className="mr-3">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSwitcher;
