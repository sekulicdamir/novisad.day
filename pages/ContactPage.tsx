
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { BookingContext } from '../contexts/BookingContext';
import { AdminContext } from '../contexts/AdminContext';
import type { PriceVariation } from '../types';

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


const LocationFields: React.FC<{ 
    type: 'start' | 'end';
    cityValue: string;
    streetValue: string;
    onLocationChange: (type: 'start' | 'end', field: 'city' | 'street', value: string) => void;
    isDisabled: boolean;
}> = ({ type, cityValue, streetValue, onLocationChange, isDisabled }) => {
    const { t } = useTranslations();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    const SERBIAN_CITIES = useMemo(() => [
        t('noviSad'), t('belgrade'), t('subotica'), t('sremskiKarlovci'), t('petrovaradin'), t('sremskaMitrovica')
    ], [t]);


    const inputClasses = "w-full bg-light/80 text-dark placeholder-gray-500 rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onLocationChange(type, 'city', value);
        
        if (value.trim()) {
            const filteredSuggestions = SERBIAN_CITIES.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            ).sort((a, b) => 
                a.toLowerCase().startsWith(value.toLowerCase()) ? -1 : b.toLowerCase().startsWith(value.toLowerCase()) ? 1 : 0
            );
            setSuggestions(filteredSuggestions);
            setIsSuggestionsVisible(true);
        } else {
            setSuggestions([t('noviSad'), t('belgrade'), t('subotica')]);
            setIsSuggestionsVisible(true);
        }
    };

    const handleCityInputFocus = () => {
        if (!cityValue.trim()) {
            setSuggestions([t('noviSad'), t('belgrade'), t('subotica')]);
        } else {
             const filteredSuggestions = SERBIAN_CITIES.filter(city => city.toLowerCase().includes(cityValue.toLowerCase()));
             setSuggestions(filteredSuggestions);
        }
        setIsSuggestionsVisible(true);
    };

    const handleSuggestionClick = (city: string) => {
        onLocationChange(type, 'city', city);
        setIsSuggestionsVisible(false);
        setSuggestions([]);
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onLocationChange(type, 'street', e.target.value);
    };

    return (
        <div className="space-y-4" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    name={`${type}City`}
                    placeholder={t('selectCity')}
                    value={cityValue}
                    onChange={handleCityInputChange}
                    onFocus={handleCityInputFocus}
                    className={inputClasses}
                    disabled={isDisabled}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={isSuggestionsVisible}
                />
                {isSuggestionsVisible && suggestions.length > 0 && (
                    <ul className="absolute z-20 w-full bg-light border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg animate-fade-in" role="listbox">
                        {suggestions.map(city => (
                            <li 
                                key={city}
                                onClick={() => handleSuggestionClick(city)}
                                className="px-4 py-3 text-dark cursor-pointer hover:bg-primary/20 transition-colors"
                                role="option"
                                aria-selected={city === cityValue}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {cityValue.length > 2 && (
                 <input
                    type="text"
                    name={`${type}Street`}
                    placeholder={t('formStreet')}
                    value={streetValue}
                    onChange={handleStreetChange}
                    className={`${inputClasses} animate-fade-in`}
                    disabled={isDisabled}
                />
            )}
        </div>
    );
};

const ContactPage: React.FC = () => {
    const { t, translate } = useTranslations();
    const location = useLocation();
    const bookingContext = useContext(BookingContext);
    const adminContext = useContext(AdminContext);
    
    const countryCodes = useMemo(() => [
        { code: '+381', nameKey: 'countrySerbia', flag: '🇷🇸' },
        { code: '+382', nameKey: 'countryMontenegro', flag: '🇲🇪' },
        { code: '+385', nameKey: 'countryCroatia', flag: '🇭🇷' },
        { code: '+44', nameKey: 'countryUK', flag: '🇬🇧' },
        { code: '+49', nameKey: 'countryGermany', flag: '🇩🇪' },
        { code: '+7', nameKey: 'countryRussia', flag: '🇷🇺' },
        { code: '+380', nameKey: 'countryUkraine', flag: '🇺🇦' },
        { code: '+90', nameKey: 'countryTurkey', flag: '🇹🇷' },
        { code: '+34', nameKey: 'countrySpain', flag: '🇪🇸' },
        { code: '+852', nameKey: 'countryHongKong', flag: '🇭🇰' },
        { code: '+86', nameKey: 'countryChina', flag: '🇨🇳' },
        { code: '+81', nameKey: 'countryJapan', flag: '🇯🇵' },
        { code: '+91', nameKey: 'countryIndia', flag: '🇮🇳' },
        { code: '+1', nameKey: 'countryUSACAN', flag: '🇺🇸' },
    ], [t]);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        phonePrefix: '+381',
        phoneNumber: '',
        startCity: '',
        startStreet: '',
        endCity: '',
        endStreet: '',
        message: '',
        tourId: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [locationStatus, setLocationStatus] = useState('');
    const [isEndingSameAsStarting, setIsEndingSameAsStarting] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tourId = params.get('tour') || '';
        const date = params.get('date') || '';
        const time = params.get('time') || '';
        const people = params.get('people') || String(bookingContext?.numberOfPeople || '');

        const tour = adminContext?.tours.find(t => t.id === tourId);
        let message = '';
        if (tour) {
            message = t('bookingRequestMessage').replace('{tourTitle}', translate(tour.title));
            if (date && time && people && people !== '0' && people !== '99') {
                 const peopleCount = parseInt(people, 10);
                 const pricePerPerson = getPricePerPerson(peopleCount, tour.priceVariations);
                 const totalPrice = pricePerPerson ? pricePerPerson * peopleCount : 0;
                 
                 message += `${t('bookingDetails')}\n${t('bookingDateLabel')} ${date}\n${t('bookingTimeLabel')} ${time}\n${t('bookingPeopleLabel')} ${people}\n${t('bookingPriceLabel')} €${totalPrice}\n\n`;
            } else if (people && (people === '99' || parseInt(people, 10) > (tour.maxPeople || 6))) {
                const groupCount = bookingContext?.numberOfPeople === 99 ? t('bookingLargeGroupCount') : people;
                message += t('bookingQuoteMessage').replace('{count}', groupCount);
            }
        }
        
        setFormData(prev => ({ 
            ...prev, 
            tourId: tourId,
            message,
        }));
    }, [location, bookingContext, adminContext, translate, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (type: 'start' | 'end', field: 'city' | 'street', value: string) => {
        const fieldName = `${type}${field.charAt(0).toUpperCase() + field.slice(1)}`;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus(t('locationStatusNotSupported'));
        } else {
            setLocationStatus(t('locationStatusLocating'));
            navigator.geolocation.getCurrentPosition((position) => {
                setLocationStatus(t('locationStatusSuccess'));
                setFormData(prev => ({
                    ...prev, 
                    startCity: 'Current Location',
                    startStreet: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}` 
                }));
            }, () => {
                setLocationStatus(t('locationStatusError'));
            });
        }
    };

    const handleSameAsStart = () => {
        setIsEndingSameAsStarting(current => {
            const nextState = !current;
            if (nextState) {
                setFormData(prev => ({
                    ...prev,
                    endCity: prev.startCity,
                    endStreet: prev.startStreet,
                }));
            }
            return nextState;
        });
    };
    
    const nextStep = () => {
        if (!formData.startCity) {
            setError(t('errorStartCity'));
            return;
        }
        if (!isEndingSameAsStarting && !formData.endCity) {
            setError(t('errorEndCity'));
            return;
        }
        setError('');

        // Add location details to the message before proceeding to the next step
        setFormData(prev => {
            const startLocation = prev.startStreet ? `${prev.startStreet}, ${prev.startCity}` : prev.startCity;
            const endLocation = isEndingSameAsStarting 
                ? startLocation 
                : prev.endStreet ? `${prev.endStreet}, ${prev.endCity}` : prev.endCity;
            
            const bookingDetailsHeader = t('bookingDetails') + '\n';
            const messageParts = prev.message.split(bookingDetailsHeader);
            let updatedMessage = prev.message;

            if (messageParts.length > 1) {
                const detailsPart = messageParts[1];
                const lines = detailsPart.split('\n');
                const timeLineIndex = lines.findIndex(line => line.trim().startsWith(t('bookingTimeLabel')));
                
                if (timeLineIndex !== -1) {
                    // Remove any existing location lines to prevent duplicates if user goes back and forth
                    const filteredLines = lines.filter(line => 
                        !line.trim().startsWith(t('bookingStartLocationLabel')) && 
                        !line.trim().startsWith(t('bookingEndLocationLabel'))
                    );
                    
                    filteredLines.splice(timeLineIndex + 1, 0, 
                        `${t('bookingStartLocationLabel')} ${startLocation}`,
                        `${t('bookingEndLocationLabel')} ${endLocation}`
                    );
                    updatedMessage = messageParts[0] + bookingDetailsHeader + filteredLines.join('\n');
                }
            }
            return { ...prev, message: updatedMessage };
        });

        setStep(2);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const prevStep = () => {
        setStep(1);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.phoneNumber || !formData.message) {
            setError(t('errorRequiredFields'));
            return;
        }
        setError('');

        if (adminContext) {
            const tour = adminContext.tours.find(t => t.id === formData.tourId);
            const tourName = tour ? translate(tour.title) : 'General Inquiry';
            const startLocation = `${formData.startStreet}, ${formData.startCity}`;
            const endLocation = isEndingSameAsStarting ? startLocation : `${formData.endStreet}, ${formData.endCity}`;
            const phone = `${formData.phonePrefix} ${formData.phoneNumber}`;

            // FIX: Removed id, date, and status properties from the object passed to addInquiry.
            // The AdminContext is responsible for creating these properties.
            adminContext.addInquiry({
                email: formData.email,
                phone: phone,
                tourName: tourName,
                message: formData.message,
                startLocation: startLocation,
                endLocation: endLocation,
            });

            const params = new URLSearchParams(location.search);
            const now = new Date();
            const logEntryData = {
                entryDate: now.toLocaleDateString(),
                entryTime: now.toLocaleTimeString(),
                numberOfPeople: params.get('people') || 'N/A',
                tourName: tourName,
                startLocation: startLocation,
                endLocation: endLocation,
                bookingDate: params.get('date') || 'N/A',
                bookingTime: params.get('time') || 'N/A',
                email: formData.email,
                phone: phone,
                message: formData.message,
            };

            adminContext.addLogEntry(logEntryData);

            // Instantly write to Google Sheet via a Google Apps Script Web App
            // Note: This URL should be replaced with your actual Google Apps Script deployment URL.
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_7_gSpkeR3mIsK-c2qJzCFyAqg_O5F2b7hI2S2jV-bH1i3jkd_V8sF8sC3jR_pQ/exec";
            
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(logEntryData),
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error('Error writing to Google Sheet:', error);
                // The data is still logged locally in the app, so we don't block the user.
            }
        }

        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-6 bg-secondary">
                <div className="bg-light text-dark p-10 rounded-lg shadow-xl max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold text-primary mb-4">{t('contactSuccessTitle')}</h2>
                    <p>{t('contactSuccessMessage')}</p>
                </div>
            </div>
        );
    }
    
    const inputClasses = "w-full bg-light/80 text-dark placeholder-gray-500 rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition";

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610415539473-6f5a34586953?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-secondary opacity-70"></div>
            <div ref={formRef} className="relative z-10 w-full max-w-lg mx-auto">
                <div className="bg-dark/50 backdrop-blur-md p-8 md:p-12 rounded-lg shadow-2xl">
                    <form onSubmit={handleSubmit} noValidate>
                        {step === 1 && (
                            <div className="animate-fade-in space-y-6">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-light mb-8">
                                    {t('contactStep1Title')}
                                </h1>
                                <div>
                                    <h3 className="text-lg font-semibold text-light mb-2">{t('startingLocation')}</h3>
                                    <LocationFields 
                                        type="start"
                                        cityValue={formData.startCity}
                                        streetValue={formData.startStreet}
                                        onLocationChange={handleLocationChange}
                                        isDisabled={false}
                                    />
                                    <button type="button" onClick={handleLocation} className="mt-3 w-full bg-primary/80 hover:bg-primary text-dark font-bold py-3 px-4 rounded-lg transition-colors">
                                        {t('useCurrentLocation')}
                                    </button>
                                    {locationStatus && <p className="text-xs text-center text-gray-text mt-2">{locationStatus}</p>}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-light">{t('endingLocation')}</h3>
                                        <button type="button" onClick={handleSameAsStart} className={`text-sm font-bold py-1 px-3 rounded-md transition-colors ${isEndingSameAsStarting ? 'bg-secondary/80 text-light' : 'bg-primary/80 text-dark'}`}>
                                            {isEndingSameAsStarting ? t('editEndLocation') : t('sameAsStart')}
                                        </button>
                                    </div>
                                    {!isEndingSameAsStarting && 
                                        <div className="animate-fade-in">
                                            <LocationFields
                                                type="end"
                                                cityValue={formData.endCity}
                                                streetValue={formData.endStreet}
                                                onLocationChange={handleLocationChange}
                                                isDisabled={isEndingSameAsStarting}
                                            />
                                        </div>
                                    }
                                </div>
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                                <div className="text-center pt-2">
                                    <button type="button" onClick={nextStep} className="w-full bg-primary hover:bg-opacity-90 text-dark font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 transform hover:scale-105">
                                        {t('continue')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in space-y-6">
                                <div className="relative text-center mb-8">
                                    <button type="button" onClick={prevStep} className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-light/80 hover:text-light transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-light">
                                        {t('contactStep2Title')}
                                    </h1>
                                </div>
                                
                                <input type="email" name="email" placeholder={t('formEmail') + '*'} value={formData.email} onChange={handleChange} className={inputClasses} required />
                                <div className="flex gap-2">
                                <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange} className={`${inputClasses} w-1/3`}>
                                    {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-dark text-light">{c.flag} {c.code}</option>)}
                                </select>
                                <input type="tel" name="phoneNumber" placeholder={t('formPhone') + '*'} value={formData.phoneNumber} onChange={handleChange} className={`${inputClasses} w-2/3`} required />
                                </div>

                                <textarea name="message" rows={5} placeholder={t('formMessage') + '*'} value={formData.message} onChange={handleChange} className={inputClasses} required></textarea>
                                
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                <div className="text-center pt-2">
                                    <button type="submit" className="w-full bg-primary hover:bg-opacity-90 text-dark font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 transform hover:scale-105">
                                        {t('submitInquiry')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
