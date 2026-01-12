
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';
import type { Tour } from '../../types';

const AdminToursPage: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const { t, translate } = useTranslations();

    if (!adminContext) return null;

    const { tours, updateTour, deleteTour } = adminContext;

    const toggleAvailability = (tour: Tour) => {
        updateTour({ ...tour, isAvailable: !tour.isAvailable });
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('adminConfirmDelete'))) {
            deleteTour(id);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark">{t('adminManageTours')}</h1>
                <Link to="/admin/tours/new" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto text-center">{t('adminAddTour')}</Link>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTourTitle')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTourAvailability')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminInquiryActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tours.map(tour => (
                                <tr key={tour.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{translate(tour.title)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => toggleAvailability(tour)} className={`px-3 py-1 text-xs font-semibold rounded-full ${tour.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {tour.isAvailable ? t('adminAvailable') : t('adminHidden')}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <Link to={`/admin/tours/edit/${tour.id}`} className="text-secondary hover:text-secondary/80">{t('adminEdit')}</Link>
                                        <button onClick={() => handleDelete(tour.id)} className="text-red-600 hover:text-red-800">{t('adminDelete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {tours.map(tour => (
                        <div key={tour.id} className="bg-gray-50 p-4 rounded-lg shadow">
                            <p className="font-bold text-dark mb-3">{translate(tour.title)}</p>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-3">
                                <button onClick={() => toggleAvailability(tour)} className={`w-full sm:w-auto px-3 py-2 text-sm font-semibold rounded-md ${tour.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {tour.isAvailable ? t('adminAvailable') : t('adminHidden')}
                                </button>
                                <div className="flex gap-4 self-end sm:self-center">
                                    <Link to={`/admin/tours/edit/${tour.id}`} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md">
                                        {t('adminEdit')}
                                    </Link>
                                    <button onClick={() => handleDelete(tour.id)} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md">
                                        {t('adminDelete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdminToursPage;
