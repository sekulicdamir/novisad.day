
import React, { useContext, useState } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import { useTranslations } from '../../hooks/useTranslations';

const AdminLogPage: React.FC = () => {
    const adminContext = useContext(AdminContext);
    const { t } = useTranslations();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!adminContext) return null;

    const { logEntries } = adminContext;

    const handleViewSheet = () => {
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1baWX943HyxBPC06tpe5B1adok8_FhVn28-N5iEsMHmw/edit?usp=sharing';
        window.open(sheetUrl, '_blank');
    };

    const LogDetailRow: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
        <p><strong className="text-gray-500">{label}:</strong> <span className="text-dark">{value || 'N/A'}</span></p>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark">{t('adminLog')}</h1>
                <button onClick={handleViewSheet} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex-shrink-0">
                    {t('logExportSheet')}
                </button>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logEntryDate')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logTour')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logEmail')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logPhone')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logNumPeople')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('logBookingDate')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logEntries.map(entry => (
                                <tr key={entry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.entryDate} {entry.entryTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.tourName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entry.numberOfPeople}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.bookingDate} {entry.bookingTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {logEntries.map(entry => (
                        <div key={entry.id} className="bg-gray-50 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                                <div>
                                    <p className="font-bold text-dark">{entry.tourName}</p>
                                    <p className="text-sm text-gray-600">{entry.email}</p>
                                    <p className="text-xs text-gray-500">{entry.entryDate} at {entry.entryTime}</p>
                                </div>
                                <button className="p-2 text-gray-500">
                                    <svg className={`w-5 h-5 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                            </div>
                            {expandedId === entry.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm animate-fade-in">
                                    <LogDetailRow label={t('logEntryDate')} value={entry.entryDate} />
                                    <LogDetailRow label={t('logEntryTime')} value={entry.entryTime} />
                                    <LogDetailRow label={t('logNumPeople')} value={entry.numberOfPeople} />
                                    <LogDetailRow label={t('logStartLocation')} value={entry.startLocation} />
                                    <LogDetailRow label={t('logEndLocation')} value={entry.endLocation} />
                                    <LogDetailRow label={t('logBookingDate')} value={entry.bookingDate} />
                                    <LogDetailRow label={t('logBookingTime')} value={entry.bookingTime} />
                                    <LogDetailRow label={t('logPhone')} value={entry.phone} />
                                    <div className="pt-2">
                                        <strong className="text-gray-500 block">{t('logMessage')}:</strong>
                                        <p className="text-dark whitespace-pre-wrap break-words">{entry.message || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLogPage;
