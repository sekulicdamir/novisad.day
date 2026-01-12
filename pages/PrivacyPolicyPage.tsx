
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-light text-dark py-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-dark mb-12">
            {t('privacyTitle')}
          </h1>
          <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-secondary">{t('privacySection1Title')}</h2>
            <p>{t('privacySection1Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('privacySection2Title')}</h2>
            <p>{t('privacySection2Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('privacySection3Title')}</h2>
            <p>{t('privacySection3Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('privacySection4Title')}</h2>
            <p>{t('privacySection4Content')}</p>

            <h2 className="text-2xl font-bold text-secondary">{t('privacySection5Title')}</h2>
            <p>{t('privacySection5Content')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
