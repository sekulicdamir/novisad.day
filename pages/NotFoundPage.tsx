
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

const NotFoundPage: React.FC = () => {
    const { t } = useTranslations();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
            <div className="bg-dark text-light px-2 text-sm rounded rotate-12 absolute">
                {t('notFoundTitle')}
            </div>
            <p className="mt-4 text-lg text-gray-600">
                {t('notFoundMessage')}
            </p>
            <Link
                to="/"
                className="mt-8 inline-block bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-colors duration-300"
            >
                {t('notFoundGoHome')}
            </Link>
        </div>
    );
};

export default NotFoundPage;
