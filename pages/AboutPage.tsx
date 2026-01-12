import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

const AboutPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-light py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-dark mb-8">
            {t('aboutTitle')}
          </h1>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>{t('aboutSection1')}</p>
              <p>{t('aboutSection2')}</p>
              <p>{t('aboutSection3')}</p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1505682499293-23d8d1b35658?q=80&w=2070&auto-format&fit=crop"
                alt="Happy travelers on a boat"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Partner Section */}
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto">
            <input 
              type="text" 
              placeholder={t('partnerPlaceholder')}
              className="w-full bg-white text-dark placeholder-gray-500 border border-gray-300 rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-secondary transition"
            />
            <button 
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex-shrink-0"
            >
              {t('partnerButton')}
            </button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex justify-center gap-8">
            <Link to="/terms" className="text-secondary hover:underline">{t('termsLink')}</Link>
            <Link to="/privacy" className="text-secondary hover:underline">{t('privacyLink')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
