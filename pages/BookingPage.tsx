
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Tour } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { BookingContext } from '../contexts/BookingContext';
import { AdminContext } from '../contexts/AdminContext';
import NotFoundPage from './NotFoundPage';

// Helper to get today's date in YYYY-MM-DD format for the date input min attribute
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to parse duration from string like "4-5 hours"
const parseDuration = (durationStr: string): number => {
    const numbers = durationStr.match(/\d+/g);
    if (numbers) {
        return parseInt(numbers[numbers.length - 1], 10);
    }
    return 4; // Default duration
};

const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translate, t } = useTranslations();
    const bookingContext = useContext(BookingContext);
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();

    const [tour, setTour] = useState<Tour | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const currentTour = adminContext?.tours.find(t => t.id === id);
        setTour(currentTour);

        // Redirect if no people selected
        if (bookingContext?.numberOfPeople === 0) {
            navigate(`/tours/${id}`);
        }
    }, [id, bookingContext, navigate, adminContext?.tours]);
    
    const tourDurationHours = useMemo(() => {
        if (tour) {
            return parseDuration(translate(tour.duration));
        }
        return 0;
    }, [tour, translate]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedDate || !tourDurationHours) return [];

        const slots: string[] = [];
        const dateObj = new Date(selectedDate + 'T00:00:00'); // Use specific time to avoid timezone issues
        const dayOfWeek = dateObj.getDay();

        const closingTime = new Date(dateObj);
        // Friday, Saturday, Sunday
        if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
            closingTime.setDate(closingTime.getDate() + 1);
            closingTime.setHours(1, 0, 0, 0); // 1 AM next day
        } else { // Monday-Thursday
            closingTime.setHours(23, 0, 0, 0); // 11 PM
        }

        // Generate slots from 9 AM
        for (let startHour = 9; startHour < 24; startHour++) {
            const startTime = new Date(dateObj);
            startTime.setHours(startHour, 0, 0, 0);
            
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + tourDurationHours);

            if (endTime <= closingTime) {
                slots.push(`${String(startHour).padStart(2, '0')}:00`);
            }
        }
        return slots;
    }, [selectedDate, tourDurationHours]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setSelectedTime(''); // Reset time when date changes
    };
    
    if (adminContext?.isLoading) {
        return <div className="flex justify-center items-center h-screen bg-secondary"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>;
    }

    if (!tour) return <NotFoundPage />;

    const { numberOfPeople } = bookingContext || { numberOfPeople: 0 };
    if (numberOfPeople === 0) {
        // This state should be brief as useEffect will navigate away
        return null; 
    }
     if (numberOfPeople > tour.maxPeople || numberOfPeople === 99) {
        // Redirect to contact page directly for large groups
        navigate(`/contact?tour=${id}&people=${numberOfPeople}`);
        return null;
    }

    const isBookingComplete = selectedDate && selectedTime;

    return (
        <div className="bg-light text-dark min-h-screen py-24 px-6">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-dark mb-4">{t('bookingTitle')}</h1>
                <p className="text-center text-gray-600 mb-10">
                    {numberOfPeople === 1 ? t('bookingForPerson') : t('bookingForPeople').replace('{count}', String(numberOfPeople))}
                </p>
                
                <div className="bg-white rounded-lg shadow-xl p-8 space-y-8">
                    {/* Tour Info */}
                    <div className="flex items-center gap-6 pb-6 border-b">
                        <img src={tour.images[0]} alt={translate(tour.title)} className="w-24 h-24 object-cover rounded-md" />
                        <div>
                            <h2 className="text-2xl font-bold text-secondary">{translate(tour.title)}</h2>
                            <p className="text-gray-600">{translate(tour.subtitle)}</p>
                        </div>
                    </div>

                    {/* Step 1: Date Selection */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-dark">{t('bookingStep1')}</h3>
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={getTodayString()}
                            className="w-full bg-gray-100 text-dark placeholder-gray-500 rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                            aria-label={t('date')}
                        />
                    </div>

                    {/* Step 2: Time Selection */}
                    {selectedDate && (
                        <div className="animate-fade-in">
                            <h3 className="text-2xl font-bold mb-4 text-dark">{t('bookingStep2')}</h3>
                            {availableTimeSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {availableTimeSlots.map(time => (
                                        <button 
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 px-2 rounded-lg text-center font-semibold transition-colors duration-200 ${selectedTime === time ? 'bg-primary text-dark ring-2 ring-primary' : 'bg-gray-100 text-dark hover:bg-gray-200'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">{t('noTimeSlots')}</p>
                            )}
                        </div>
                    )}

                    {/* Confirmation Button */}
                    <div className="pt-6 border-t">
                        <Link
                            to={isBookingComplete ? `/contact?tour=${tour.id}&date=${selectedDate}&time=${selectedTime}&people=${numberOfPeople}` : '#'}
                            className={`block w-full text-center font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 ${isBookingComplete ? 'bg-primary hover:bg-primary/90 text-dark transform hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            aria-disabled={!isBookingComplete}
                        >
                            {t('confirmAndContinue')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
