
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';
import type { Tour, PriceVariation, Locale } from '../../types';

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'me', name: 'Crnogorski', flag: '🇲🇪' },
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

const AdminTourEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();

    const isNew = !id;
    const [tour, setTour] = useState<Partial<Tour>>({
        title: {}, subtitle: {}, shortDescription: {}, longDescription: {},
        images: [], included: {}, duration: {}, maxPeople: 6,
        priceVariations: [{ id: `price-${Date.now()}`, persons: '1-2', price: 0 }],
        isAvailable: true, isFeatured: false, seo: { metaTitle: {}, metaDescription: {} }
    });
    const [editLang, setEditLang] = useState<Locale>('en');

    useEffect(() => {
        if (id) {
            const existingTour = adminContext?.tours.find(t => t.id === id);
            if (existingTour) {
                setTour(existingTour);
            }
        }
    }, [id, adminContext?.tours]);

    const handleTranslatableChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Tour
    ) => {
        const { value } = e.target;
        setTour(prev => ({
            ...prev,
            [field]: {
                ...(prev[field] as object),
                [editLang]: value,
            },
        }));
    };
    
    const handleIncludedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setTour(prev => ({
            ...prev,
            included: {
                ...(prev.included as object),
                [editLang]: value.split('\n').filter(item => item.trim() !== ''),
            }
        }));
    };

    const handleNonTranslatableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number' ? parseInt(value, 10) : value;
        if (name === 'images') {
            setTour(prev => ({ ...prev, images: value.split(',').map(url => url.trim()) }));
        } else {
            setTour(prev => ({ ...prev, [name]: processedValue }));
        }
    };

    const handlePriceChange = (index: number, field: 'persons' | 'price', value: string) => {
        const newPrices = [...(tour.priceVariations || [])];
        newPrices[index] = { ...newPrices[index], [field]: field === 'price' ? Number(value) : value };
        setTour(prev => ({ ...prev, priceVariations: newPrices }));
    };

    const addPriceTier = () => {
        const newTier: PriceVariation = { id: `price-${Date.now()}`, persons: '', price: 0 };
        setTour(prev => ({...prev, priceVariations: [...(prev.priceVariations || []), newTier] }));
    };

    const removePriceTier = (index: number) => {
        setTour(prev => ({...prev, priceVariations: prev.priceVariations?.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTour = {
            id: id || `tour-${Date.now()}`,
            ...tour,
        } as Tour;

        if (isNew) {
            adminContext?.addTour(finalTour);
        } else {
            adminContext?.updateTour(finalTour);
        }
        navigate('/admin/tours');
    };
    
    const inputClass = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
    const labelClass = "block mb-2 text-sm font-medium text-gray-700";

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">{isNew ? t('adminCreateTour') : t('adminEditTour')}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-6">
                
                {/* Language Selector */}
                <div className="border-b pb-4">
                    <label className={labelClass}>Edit Language</label>
                    <select
                        value={editLang}
                        onChange={(e) => setEditLang(e.target.value as Locale)}
                        className={inputClass}
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                        ))}
                    </select>
                </div>
                
                {/* Translatable Fields */}
                <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                    <h3 className="font-bold text-lg">Translatable Content ({languages.find(l=>l.code === editLang)?.name})</h3>
                    <div>
                        <label className={labelClass}>Title</label>
                        <input type="text" value={tour.title?.[editLang] || ''} onChange={(e) => handleTranslatableChange(e, 'title')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Subtitle</label>
                        <input type="text" value={tour.subtitle?.[editLang] || ''} onChange={(e) => handleTranslatableChange(e, 'subtitle')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Short Description</label>
                        <textarea value={tour.shortDescription?.[editLang] || ''} onChange={(e) => handleTranslatableChange(e, 'shortDescription')} className={inputClass} rows={2}></textarea>
                    </div>
                    <div>
                        <label className={labelClass}>Long Description</label>
                        <textarea value={tour.longDescription?.[editLang] || ''} onChange={(e) => handleTranslatableChange(e, 'longDescription')} className={inputClass} rows={5}></textarea>
                    </div>
                    <div>
                        <label className={labelClass}>Duration</label>
                        <input type="text" value={tour.duration?.[editLang] || ''} onChange={(e) => handleTranslatableChange(e, 'duration')} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>What's Included (one item per line)</label>
                        <textarea value={(tour.included?.[editLang] || []).join('\n')} onChange={handleIncludedChange} className={inputClass} rows={4}></textarea>
                    </div>
                </div>

                {/* Non-translatable fields */}
                <div>
                    <label className={labelClass}>{t('adminTourImages')}</label>
                    <input type="text" name="images" value={(tour.images || []).join(', ')} onChange={handleNonTranslatableChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('adminTourMaxPeople')}</label>
                    <input type="number" name="maxPeople" value={tour.maxPeople || 0} onChange={handleNonTranslatableChange} className={inputClass} />
                </div>

                {/* Pricing */}
                <div>
                    <h3 className="text-lg font-bold mb-2">{t('adminTourPricing')}</h3>
                    <div className="space-y-4">
                    {tour.priceVariations?.map((p, index) => (
                        <div key={p.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 border-t pt-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 md:hidden">{t('adminTourPersons')}</label>
                                <input type="text" placeholder={t('adminTourPersons')} value={p.persons} onChange={(e) => handlePriceChange(index, 'persons', e.target.value)} className={inputClass} />
                            </div>
                            <div className="flex-1">
                                 <label className="text-xs text-gray-500 md:hidden">{t('adminTourPrice')}</label>
                                <input type="number" placeholder={t('adminTourPrice')} value={p.price} onChange={(e) => handlePriceChange(index, 'price', e.target.value)} className={inputClass} />
                            </div>
                            <button type="button" onClick={() => removePriceTier(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full self-center md:self-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    </div>
                    <button type="button" onClick={addPriceTier} className="mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">{t('adminTourAddPrice')}</button>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/tours')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">{t('adminCancel')}</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-dark rounded-md">{t('adminSave')}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminTourEditPage;
