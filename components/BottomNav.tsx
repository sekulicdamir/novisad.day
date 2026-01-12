
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import LanguageSwitcher from './LanguageSwitcher';

// Custom hook to detect scroll direction
const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const updateScrollDir = () => {
            const scrollY = window.pageYOffset;
            if (Math.abs(scrollY - lastScrollY) < 10) {
                ticking = false;
                return;
            }
            setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
            lastScrollY = scrollY > 0 ? scrollY : 0;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollDir);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrollDirection;
};


const NavItem: React.FC<{ to: string; label: string; icon: React.ReactElement; onClick: () => void }> = ({ to, label, icon, onClick }) => (
    <NavLink 
      to={to} 
      onClick={onClick}
      className="flex items-center text-2xl text-gray-text hover:text-light transition-colors py-4"
    >
        {/* FIX: Added type assertion to `icon` to solve React.cloneElement typing issue where className is not a recognized prop. */}
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-8 h-8 mr-4' })}
        <span>{label}</span>
    </NavLink>
);

const BottomNav: React.FC = () => {
    const { t } = useTranslations();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrollDirection = useScrollDirection();
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
      setIsMenuOpen(false);
    }, [location.pathname]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* --- Main Bottom Bar --- */}
            <footer 
                className={`fixed bottom-0 left-0 right-0 h-20 bg-dark/90 backdrop-blur-lg border-t border-light/10 z-50 transition-transform duration-300 ease-in-out md:translate-y-0 ${
                    scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="container mx-auto h-full grid grid-cols-3 items-center px-4">
                    {/* Left Item */}
                    <div className="justify-self-start">
                        <LanguageSwitcher />
                    </div>

                    {/* Center Item (Logo) */}
                    <div className="justify-self-center">
                        <Link to="/" className="text-xl font-bold text-light hover:text-primary transition-colors whitespace-nowrap">
                            novisad.day
                        </Link>
                    </div>

                    {/* Right Item */}
                    <div className="justify-self-end">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="w-12 h-12 flex flex-col justify-center items-center space-y-1.5 z-50"
                            aria-label="Open menu"
                        >
                            <span className={`block h-0.5 w-6 bg-light transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block h-0.5 w-6 bg-light transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-6 bg-light transition-transform duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* --- Hamburger Menu Overlay --- */}
            <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={closeMenu}
            >
                <div className="absolute inset-0 bg-dark/90 backdrop-blur-lg"></div>
            </div>
            <div 
                className={`fixed top-0 right-0 bottom-0 w-full max-w-xs bg-dark/70 p-8 z-40 transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
            >
                <nav className="flex flex-col h-full justify-center items-start">
                    <NavItem
                        to="/"
                        label={t('navHome')}
                        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                        onClick={closeMenu}
                    />
                    <NavItem
                        to="/tours"
                        label={t('navTours')}
                        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        onClick={closeMenu}
                    />
                    <NavItem
                        to="/about"
                        label={t('navAbout')}
                        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        onClick={closeMenu}
                    />
                    <NavItem
                        to="/contact"
                        label={t('navContact')}
                        icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        onClick={closeMenu}
                    />
                </nav>
            </div>
        </>
    );
};

export default BottomNav;
