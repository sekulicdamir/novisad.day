
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tour } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
    const { translate, t } = useTranslations();

    return (
        <div className="bg-light text-dark rounded-lg shadow-2xl overflow-hidden flex flex-col w-full max-w-sm mx-auto">
            <img src={tour.images[0]} alt={translate(tour.title)} className="w-full h-56 object-cover" />
            
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{translate(tour.title)}</h3>
                    <p className="text-primary font-semibold mb-4">{translate(tour.subtitle)}</p>
                    <p className="text-gray-600 mb-6">{translate(tour.shortDescription)}</p>
                </div>
                
                <div>
                    <div className="border-t border-gray-200 py-4 flex justify-between items-center">
                        <span className="text-lg font-semibold">{t('moreDetails')}</span>
                        <Link to={`/tours/${tour.id}`} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </div>
                    <Link
                        to={`/tours/${tour.id}`}
                        className="block w-full text-center bg-primary hover:bg-opacity-90 text-dark font-bold py-4 px-4 rounded-lg transition-colors duration-300 text-lg"
                    >
                        {t('reserveNow')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
