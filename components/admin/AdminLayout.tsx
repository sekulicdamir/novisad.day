
import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';

const AdminLayout: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();
    const { t } = useTranslations();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        adminContext?.logout();
        navigate('/admin/login');
    };

    // FIX: Replaced JSX.Element with React.ReactElement to fix 'Cannot find namespace JSX' error.
    const NavItem: React.FC<{ to: string, icon: React.ReactElement, label: string }> = ({ to, icon, label }) => (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex items-center p-3 my-1 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-dark' : 'text-gray-300 hover:bg-secondary/80 hover:text-white'
                }`
            }
            onClick={() => setIsSidebarOpen(false)}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </NavLink>
    );

    const sidebarContent = (
      <>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">novisad.day</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <nav className="flex-1 p-4">
            <NavItem to="/admin" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} label={t('adminDashboard')} />
            <NavItem to="/admin/tours" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label={t('adminTours')} />
            <NavItem to="/admin/inquiries" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} label={t('adminInquiries')} />
            <NavItem to="/admin/settings" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label={t('adminSettings')} />
            <NavItem to="/admin/languages" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} label={t('adminLanguages')} />
            <NavItem to="/admin/log" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>} label={t('adminLog')} />
        </nav>
        <div className="p-4 border-t border-gray-700">
            <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-secondary/80 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="ml-3">{t('adminLogout')}</span>
            </button>
        </div>
      </>
    );

    return (
        <div className="flex h-screen bg-gray-100 text-dark">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-dark text-white flex-col flex-shrink-0 hidden md:flex">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`fixed inset-y-0 left-0 w-64 bg-dark text-white flex flex-col z-40 transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                    <h1 className="text-xl font-semibold">Admin Panel</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
