
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TourListPage = lazy(() => import('./pages/TourListPage'));
const TourDetailPage = lazy(() => import('./pages/TourDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminToursPage = lazy(() => import('./pages/admin/AdminToursPage'));
const AdminTourEditPage = lazy(() => import('./pages/admin/AdminTourEditPage'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/AdminInquiriesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminLanguagesPage = lazy(() => import('./pages/admin/AdminLanguagesPage'));
const AdminLogPage = lazy(() => import('./pages/admin/AdminLogPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-secondary">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
);

// Main application component with public layout
const MainApp = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pb-20"> {/* Padding bottom to avoid overlap with BottomNav */}
            <Outlet />
        </main>
        <BottomNav />
    </div>
);

const App: React.FC = () => {
    return (
        <HashRouter>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="tours" element={<AdminToursPage />} />
                        <Route path="tours/new" element={<AdminTourEditPage />} />
                        <Route path="tours/edit/:id" element={<AdminTourEditPage />} />
                        <Route path="inquiries" element={<AdminInquiriesPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                        <Route path="languages" element={<AdminLanguagesPage />} />
                        <Route path="log" element={<AdminLogPage />} />
                    </Route>

                    {/* Public Site Routes */}
                    <Route path="/" element={<MainApp />}>
                        <Route index element={<HomePage />} />
                        <Route path="tours" element={<TourListPage />} />
                        <Route path="tours/:id" element={<TourDetailPage />} />
                        <Route path="book/:id" element={<BookingPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="blog" element={<BlogPage />} />
                        <Route path="blog/:id" element={<BlogPostPage />} />
                        <Route path="terms" element={<TermsOfServicePage />} />
                        <Route path="privacy" element={<PrivacyPolicyPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </HashRouter>
    );
};

export default App;
