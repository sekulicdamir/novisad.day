
import React, { useContext } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';
import StatCard from '../../components/admin/StatCard';
import { Link } from 'react-router-dom';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const { t } = useTranslations();
    const statusMap: { [key: string]: string } = {
        'New': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    };
    const statusKeyMap: { [key: string]: string } = {
        'New': 'adminStatusNew',
        'In Progress': 'adminStatusInProgress',
        'Completed': 'adminStatusCompleted',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status]}`}>{t(statusKeyMap[status])}</span>;
};

const AdminDashboardPage: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();

    if (!adminContext) return null;

    const { tours, inquiries } = adminContext;
    const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
    const recentInquiries = inquiries.slice(0, 5);

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">{t('adminDashboard')}</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title={t('adminTotalTours')} value={tours.length} color="bg-blue-500" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                <StatCard title={t('adminTotalInquiries')} value={inquiries.length} color="bg-green-500" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                <StatCard title={t('adminNewInquiries')} value={newInquiriesCount} color="bg-yellow-500" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} />
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-dark mb-4">{t('adminRecentInquiries')}</h2>
                
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryDate')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryEmail')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryTour')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryStatus')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentInquiries.map(inquiry => (
                                <tr key={inquiry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inquiry.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inquiry.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{inquiry.tourName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={inquiry.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to="/admin/inquiries" className="text-secondary hover:text-secondary/80">{t('adminView')}</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {recentInquiries.map(inquiry => (
                        <div key={inquiry.id} className="bg-gray-50 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-dark break-all">{inquiry.email}</p>
                                    <p className="text-sm text-gray-600">{inquiry.tourName}</p>
                                </div>
                                <StatusBadge status={inquiry.status} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <p className="text-sm text-gray-500">{new Date(inquiry.date).toLocaleDateString()}</p>
                                <Link to="/admin/inquiries" className="text-sm font-semibold text-secondary hover:text-secondary/80">{t('adminView')}</Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
