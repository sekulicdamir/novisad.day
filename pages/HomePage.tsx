
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { BookingContext } from '../contexts/BookingContext';
import { AdminContext } from '../contexts/AdminContext';

const InfoCard: React.FC<{ imgSrc: string; title: string; subtitle: string; points: string[] }> = ({ imgSrc, title, subtitle, points }) => (
    <div className="bg-light text-dark rounded-lg shadow-xl overflow-hidden max-w-sm mx-auto">
        <img src={imgSrc} alt={title} className="w-full h-56 object-cover" />
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-1">{title}</h3>
            <p className="text-primary font-semibold mb-4">{subtitle}</p>
            <ul className="space-y-2 text-gray-600">
                {points.map((point, i) => (
                    <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const HeroSection: React.FC<{ isCompact?: boolean }> = ({ isCompact = false }) => {
    const { t } = useTranslations();
    const bookingContext = useContext(BookingContext);
    const adminContext = useContext(AdminContext);

    const handlePeopleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!bookingContext) return;
        const value = e.target.value;
        if (value === 'More') {
            bookingContext.setNumberOfPeople(99); // Special value for 'More'
        } else {
            bookingContext.setNumberOfPeople(parseInt(value, 10));
        }
    };
    
    const getSelectValue = (count: number): string => {
        if (count === 0) return "";
        if (count === 99) return "More";
        return String(count);
    };

    const heroImage = adminContext?.settings.heroImage || 'https://i.imgur.com/gK6kYkH.jpeg';
    const isSelectionMade = bookingContext ? bookingContext.numberOfPeople > 0 : false;

    return (
        <section
            className={`relative flex flex-col items-center justify-center text-center text-light p-6 bg-cover bg-center transition-all duration-500 ${isCompact ? 'py-32' : 'min-h-screen'}`}
            style={{ backgroundImage: `url('${heroImage}')` }}
        >
            <div className="absolute inset-0 bg-secondary opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 drop-shadow-2xl">
                    {t('heroTitle')}
                </h1>
                <form className="w-full max-w-sm flex flex-col items-center gap-4">
                    <select 
                        value={getSelectValue(bookingContext?.numberOfPeople || 0)}
                        onChange={handlePeopleChange}
                        className={`w-full bg-white/20 border border-white/30 rounded-lg py-4 px-4 text-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary transition ${isSelectionMade ? 'text-center' : ''}`}
                    >
                        <option value="" disabled>{t('peopleDropdown')}</option>
                        <option className="bg-dark text-light" value="1">1</option>
                        <option className="bg-dark text-light" value="2">2</option>
                        <option className="bg-dark text-light" value="3">3</option>
                        <option className="bg-dark text-light" value="4">4</option>
                        <option className="bg-dark text-light" value="5">5</option>
                        <option className="bg-dark text-light" value="6">6</option>
                        <option className="bg-dark text-light" value="7">7</option>
                        <option className="bg-dark text-light" value="8">8</option>
                        <option className="bg-dark text-light" value="More">More</option>
                    </select>
                    <Link
                        to={isSelectionMade ? "/tours" : "#"}
                        onClick={(e) => { if (!isSelectionMade) e.preventDefault(); }}
                        className={`w-full text-center font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
                            isSelectionMade
                                ? 'bg-primary hover:bg-opacity-90 text-dark transform hover:scale-105'
                                : 'bg-primary/50 text-dark/70 cursor-not-allowed'
                        }`}
                        aria-disabled={!isSelectionMade}
                    >
                        {t('continue')}
                    </Link>
                </form>
            </div>
        </section>
    );
}

const HomePage: React.FC = () => {
    const { t } = useTranslations();

    return (
        <div className="bg-secondary">
            {/* Hero Section */}
            <HeroSection />

            {/* Info Cards Section */}
            <section className="py-20 px-6 bg-light">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <InfoCard 
                        imgSrc="https://images.unsplash.com/photo-1542037104857-4bb4b9fe1324?q=80&w=2070&auto-format=fit=crop"
                        title={t('expLikeLocalTitle')}
                        subtitle={t('expLikeLocalSubtitle')}
                        points={[t('expLikeLocalPoint1'), t('expLikeLocalPoint2'), t('expLikeLocalPoint3')]}
                    />
                    <InfoCard 
                        imgSrc="https://images.unsplash.com/photo-1563823280968-3d233a59e984?q=80&w=1974&auto-format=fit=crop"
                        title={t('yourJourneyTitle')}
                        subtitle={t('yourJourneySubtitle')}
                        points={[t('yourJourneyPoint1'), t('yourJourneyPoint2'), t('yourJourneyPoint3')]}
                    />
                    <InfoCard 
                        imgSrc="https://images.unsplash.com/photo-1520211603844-3a2b861313ee?q=80&w=1968&auto-format=fit=crop"
                        title={t('chooseVibeTitle')}
                        subtitle={t('chooseVibeSubtitle')}
                        points={[t('chooseVibePoint1'), t('chooseVibePoint2'), t('chooseVibePoint3')]}
                    />
                </div>
            </section>

            {/* Cloned Hero Section */}
            <HeroSection isCompact={true} />
        </div>
    );
};

export default HomePage;
