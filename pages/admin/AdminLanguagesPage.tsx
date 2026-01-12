
import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import type { Locale, Translations } from '../../types';

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

const EditableField: React.FC<{ value: string; onChange: (newValue: string) => void }> = ({ value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        onChange(currentValue);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                />
            </div>
        );
    }

    return (
        <div onClick={() => setIsEditing(true)} className="w-full px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md min-h-[34px]">
            {value || <span className="text-gray-400">Empty</span>}
        </div>
    );
};

const AdminLanguagesPage: React.FC = () => {
    const { t, translations, setTranslations } = useTranslations();
    const [targetLocale, setTargetLocale] = useState<Locale>('sr');
    const [isSaved, setIsSaved] = useState(false);

    const [editableTranslations, setEditableTranslations] = useState<Translations>(JSON.parse(JSON.stringify(translations)));

    const handleTranslationChange = (key: string, locale: Locale, value: string) => {
        setEditableTranslations(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [locale]: value,
            }
        }));
    };
    
    const handleSave = () => {
        setTranslations(editableTranslations);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark">{t('adminLanguages')}</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={targetLocale}
                        onChange={(e) => setTargetLocale(e.target.value as Locale)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
                    >
                        {languages.filter(l => l.code !== 'en').map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                        ))}
                    </select>
                    <button onClick={handleSave} className="px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0">
                        {t('adminSave')}
                    </button>
                </div>
                {isSaved && <p className="text-green-600 animate-fade-in w-full md:w-auto text-right">Saved!</p>}
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="hidden md:grid grid-cols-2 gap-x-4 border-b pb-2 mb-4 font-bold">
                    <div>English (Reference)</div>
                    <div>{languages.find(l => l.code === targetLocale)?.name} (Editable)</div>
                </div>
                <div className="space-y-4 md:space-y-2">
                    {Object.keys(translations).sort().map(key => (
                        <div key={key} className="p-3 rounded-md hover:bg-gray-50 border md:border-0 block md:grid md:grid-cols-2 md:gap-x-4 md:items-center">
                            <div className="text-sm text-gray-600 break-words pr-4 pb-2 md:pb-0">
                                <strong className="block text-xs uppercase text-gray-400">English (ref)</strong>
                                <strong>{key}</strong>: {translations[key]['en'] || ''}
                            </div>
                            <div>
                                <strong className="block text-xs uppercase text-gray-400 md:hidden">{languages.find(l => l.code === targetLocale)?.name} (edit)</strong>
                                <EditableField
                                    value={editableTranslations[key]?.[targetLocale] || ''}
                                    onChange={(newValue) => handleTranslationChange(key, targetLocale, newValue)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLanguagesPage;
