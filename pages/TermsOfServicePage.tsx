
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const TermsOfServicePage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-light text-dark py-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-dark mb-12">
            {t('termsTitle')}
          </h1>
          <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-bold text-secondary">{t('termsSection1Title')}</h2>
            <p>{t('termsSection1Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('termsSection2Title')}</h2>
            <p>{t('termsSection2Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('termsSection3Title')}</h2>
            <p>{t('termsSection3Content')}</p>
            
            <h2 className="text-2xl font-bold text-secondary">{t('termsSection4Title')}</h2>
            <p>{t('termsSection4Content')}</p>

            <h2 className="text-2xl font-bold text-secondary">{t('termsSection5Title')}</h2>
            <p>{t('termsSection5Content')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
