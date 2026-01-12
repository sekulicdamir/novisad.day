
import React, { useContext, useState } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';
import type { Inquiry, InquiryStatus } from '../../types';

const StatusBadge: React.FC<{ status: InquiryStatus }> = ({ status }) => {
    const { t } = useTranslations();
    const statusMap: { [key in InquiryStatus]: string } = {
        'New': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    };
    const statusKeyMap: { [key in InquiryStatus]: string } = {
        'New': 'adminStatusNew',
        'In Progress': 'adminStatusInProgress',
        'Completed': 'adminStatusCompleted',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status]}`}>{t(statusKeyMap[status])}</span>;
};

const AdminInquiriesPage: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    if (!adminContext) return null;

    const { inquiries, updateInquiryStatus } = adminContext;
    
    const handleStatusChange = (id: string, status: InquiryStatus) => {
        updateInquiryStatus(id, status);
    };

    const InquiryModal: React.FC<{ inquiry: Inquiry, onClose: () => void }> = ({ inquiry, onClose }) => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('adminInquiryDetails')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <p><strong>{t('adminInquiryDate')}:</strong> {new Date(inquiry.date).toLocaleString()}</p>
                    <p><strong>{t('adminInquiryEmail')}:</strong> <span className="break-all">{inquiry.email}</span></p>
                    <p><strong>{t('adminInquiryPhone')}:</strong> {inquiry.phone}</p>
                    <p><strong>{t('adminInquiryTour')}:</strong> {inquiry.tourName}</p>
                    <p><strong>{t('adminInquiryStart')}:</strong> {inquiry.startLocation}</p>
                    <p><strong>{t('adminInquiryEnd')}:</strong> {inquiry.endLocation}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p><strong>{t('adminInquiryMessage')}:</strong></p>
                        <p className="whitespace-pre-wrap break-words">{inquiry.message}</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('adminClose')}</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">{t('adminInquiries')}</h1>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
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
                            {inquiries.map(inquiry => (
                                <tr key={inquiry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inquiry.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inquiry.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{inquiry.tourName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select 
                                            value={inquiry.status} 
                                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                                            className="text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="New">{t('adminStatusNew')}</option>
                                            <option value="In Progress">{t('adminStatusInProgress')}</option>
                                            <option value="Completed">{t('adminStatusCompleted')}</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedInquiry(inquiry)} className="text-secondary hover:text-secondary/80">{t('adminView')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                     {inquiries.map(inquiry => (
                        <div key={inquiry.id} className="bg-gray-50 p-4 rounded-lg shadow space-y-3">
                            <div>
                                <p className="font-bold text-dark break-all">{inquiry.email}</p>
                                <p className="text-sm text-gray-600">{inquiry.tourName}</p>
                                <p className="text-xs text-gray-500 pt-1">{new Date(inquiry.date).toLocaleString()}</p>
                            </div>
                             <div className="flex justify-between items-center gap-4 pt-2 border-t">
                                <select 
                                    value={inquiry.status} 
                                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                                    className="text-sm rounded-md border-gray-300 focus:ring-primary focus:border-primary w-full"
                                >
                                    <option value="New">{t('adminStatusNew')}</option>
                                    <option value="In Progress">{t('adminStatusInProgress')}</option>
                                    <option value="Completed">{t('adminStatusCompleted')}</option>
                                </select>
                                <button onClick={() => setSelectedInquiry(inquiry)} className="px-4 py-2 bg-secondary text-white text-sm rounded-md flex-shrink-0">{t('adminView')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedInquiry && <InquiryModal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />}
        </div>
    );
};

export default AdminInquiriesPage;
