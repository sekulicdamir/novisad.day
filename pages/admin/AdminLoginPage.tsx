import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();

    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (adminContext) {
            const success = await adminContext.login(email, password);
            if (success) {
                navigate(from, { replace: true });
            } else {
                setError('Invalid credentials');
                setIsLoading(false);
            }
        } else {
            setError('Context not available');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-dark">{t('adminLoginTitle')}</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">{t('formEmail')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="admin@example.com"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">{t('adminPassword')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-dark bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : t('adminLogin')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
