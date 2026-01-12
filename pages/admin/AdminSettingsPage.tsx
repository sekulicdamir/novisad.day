
import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';
import type { SiteSettings } from '../../types';

const AdminSettingsPage: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();
    const [settings, setSettings] = useState<SiteSettings>({ heroImage: '' });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (adminContext?.settings) {
            setSettings(adminContext.settings);
        }
    }, [adminContext?.settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        adminContext?.updateSettings(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };
    
    const inputClass = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
    const labelClass = "block mb-2 text-sm font-medium text-gray-700";

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">{t('adminSiteSettings')}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="heroImage" className={labelClass}>{t('adminHeroImage')}</label>
                    <input
                        type="text"
                        id="heroImage"
                        name="heroImage"
                        value={settings.heroImage}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                
                <div className="flex items-center justify-end gap-4">
                    {isSaved && <p className="text-green-600 animate-fade-in">Settings saved!</p>}
                    <button type="submit" className="px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        {t('adminUpdateSettings')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;
