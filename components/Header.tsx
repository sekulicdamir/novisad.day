
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return null; // Don't render anything on the home page
  }

  return (
    <header className="absolute top-0 left-0 z-50 p-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-light bg-black/20 backdrop-blur-sm rounded-full py-2 px-4 hover:bg-black/40 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('back')}
      </button>
    </header>
  );
};

export default Header;
