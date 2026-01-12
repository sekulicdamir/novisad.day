
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Tour, PriceVariation } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import NotFoundPage from './NotFoundPage';
import { BookingContext } from '../contexts/BookingContext';
import { AdminContext } from '../contexts/AdminContext';

const getPricePerPerson = (count: number, variations: PriceVariation[]): number | null => {
    for (const variation of variations) {
        const parts = variation.persons.split('-').map(p => parseInt(p.trim(), 10));
        const min = parts[0];
        const max = parts.length > 1 ? parts[1] : min;
        if (count >= min && count <= max) {
            return variation.price;
        }
    }
    return null;
};

const TourDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translate, t, locale } = useTranslations();
    const bookingContext = useContext(BookingContext);
    const adminContext = useContext(AdminContext);
    
    const [tour, setTour] = useState<Tour | undefined>(undefined);
    const [mainImage, setMainImage] = useState<string>('');
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const currentTour = adminContext?.tours.find(t => t.id === id);
        setTour(currentTour);
        if (currentTour) {
            setMainImage(currentTour.images[0]);
        }
    }, [id, adminContext]);

    if (!tour) {
        return <NotFoundPage />;
    }

    const { numberOfPeople } = bookingContext || { numberOfPeople: 0 };
    const isBookingDisabled = numberOfPeople === 0;
    const pricePerPerson = getPricePerPerson(numberOfPeople, tour.priceVariations);
    const totalPrice = pricePerPerson ? pricePerPerson * numberOfPeople : 0;

    return (
        <div className="bg-light text-dark">
            <div className="container mx-auto px-6 py-12 pt-24">
                {/* Tour Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-dark mb-2">{translate(tour.title)}</h1>
                    <p className="text-xl text-gray-600">{translate(tour.subtitle)}</p>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-10">
                    <div className="lg:col-span-4">
                        <img src={mainImage} alt="Main tour view" className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden">
                        {tour.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Tour view ${index + 1}`}
                                onClick={() => setMainImage(img)}
                                className={`w-24 h-24 lg:w-full lg:h-auto object-cover rounded-md cursor-pointer border-4 ${mainImage === img ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-all`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <div className="prose max-w-none text-gray-700">
                            <p>{translate(tour.longDescription)}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
                            <div className="mb-6 pb-6 border-b">
                               <div className="flex items-start text-lg mb-3">
                                   <svg className="w-6 h-6 mr-3 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                   <div className="flex-1">
                                       <strong>{t('tourDuration')}:</strong>
                                       <span className="ml-2">{translate(tour.duration)}</span>
                                   </div>
                               </div>
                               {numberOfPeople > 0 && numberOfPeople !== 99 && numberOfPeople <= tour.maxPeople ? (
                                   <div className="flex items-start text-lg">
                                       <svg className="w-6 h-6 mr-3 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                       <div className="flex-1">
                                           <strong>{t('tourNumberOfPeople')}:</strong>
                                           <span className="ml-2">{numberOfPeople}</span>
                                       </div>
                                   </div>
                               ) : (
                                   <div className="flex items-start text-lg">
                                       <svg className="w-6 h-6 mr-3 text-secondary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                       <div className="flex-1">
                                           <strong>{t('tourMaxPeople')}:</strong>
                                           <span className="ml-2">{tour.maxPeople}</span>
                                       </div>
                                   </div>
                               )}
                            </div>
                            
                            <div className="mb-6 pb-6 border-b">
                                <h4 className="text-xl font-bold mb-3">{t('tourIncluded')}</h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {(tour.included[locale] || tour.included.en)?.map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mb-6">
                                {numberOfPeople === 0 && (
                                    <>
                                        <h4 className="text-xl font-bold mb-3">{t('tourPricing')}</h4>
                                        <p className="text-xs text-gray-500 mb-3">Prices are per person.</p>
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr>
                                                    <th className="font-semibold pb-2">{t('tourPersons')}</th>
                                                    <th className="font-semibold pb-2 text-right">{t('tourPrice')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tour.priceVariations.map(variation => (
                                                    <tr key={variation.id} className="border-t">
                                                        <td className="py-2">{variation.persons}</td>
                                                        <td className="py-2 text-right font-bold text-primary">€{variation.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                                {numberOfPeople > 0 && pricePerPerson !== null && !(numberOfPeople > tour.maxPeople || numberOfPeople === 99) && (
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold mb-2 text-secondary">{t('totalPrice')}</h4>
                                        <p className="text-4xl font-extrabold text-primary mb-2">€{totalPrice}</p>
                                        <p className="text-md text-gray-600">{t('priceForPeople').replace('{count}', String(numberOfPeople))}</p>
                                        <p className="text-sm text-gray-500">{t('priceAllInclusive')}</p>
                                    </div>
                                )}
                                {numberOfPeople > tour.maxPeople && (
                                    <div className="text-center bg-red-100 p-4 rounded-lg">
                                        <h4 className="text-xl font-bold mb-2 text-red-800">{t('tourPricing')}</h4>
                                        <p className="text-red-700">{t('groupTooLarge').replace('{maxPeople}', String(tour.maxPeople))}</p>
                                    </div>
                                )}
                                {(numberOfPeople === 99 || (numberOfPeople > 0 && pricePerPerson === null)) && (
                                    <div className="text-center bg-primary/10 p-4 rounded-lg">
                                        <h4 className="text-xl font-bold mb-2 text-secondary">{t('tourPricing')}</h4>
                                        <p className="text-gray-700">{t('contactForLargeGroup')}</p>
                                    </div>
                                )}
                            </div>

                            <Link
                                to={isBookingDisabled ? '#' : `/book/${tour.id}`}
                                className={`block w-full text-center font-bold py-3 px-4 rounded-lg transition-all duration-300 ${isBookingDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-dark transform hover:scale-105'}`}
                            >
                                {t('tourBookNow')}
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TourDetailPage;
