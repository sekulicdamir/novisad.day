
import React, { useContext } from 'react';
import TourCard from '../components/TourCard';
import { useTranslations } from '../hooks/useTranslations';
import { AdminContext } from '../contexts/AdminContext';

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start text-lg md:text-xl text-dark">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <span>{text}</span>
    </div>
);

const TourListPage: React.FC = () => {
    const { t } = useTranslations();
    const adminContext = useContext(AdminContext);
    const tours = adminContext?.tours || [];
    const availableTours = tours.filter(tour => tour.isAvailable);

    return (
        <div className="bg-light min-h-screen py-20 px-6">
            <div className="container mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold text-center text-dark mb-16">
                    {t('tourListTitle')}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 justify-items-center">
                    {availableTours.map(tour => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>

                <div className="mt-20 bg-white text-dark rounded-lg shadow-xl p-8 md:p-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-secondary">{t('satisfactionTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
                        <CheckItem text={t('satisfactionPoint1')} />
                        <CheckItem text={t('satisfactionPoint2')} />
                        <CheckItem text={t('satisfactionPoint3')} />
                        <CheckItem text={t('satisfactionPoint4')} />
                        <CheckItem text={t('satisfactionPoint5')} />
                        <CheckItem text={t('satisfactionPoint6')} />
                    </div>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 justify-items-center">
                        {availableTours.map(tour => (
                            <TourCard key={`${tour.id}-copy`} tour={tour} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourListPage;
