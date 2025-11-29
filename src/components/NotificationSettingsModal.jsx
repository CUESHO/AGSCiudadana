import { useState } from 'react';
import { X, Bell, Check } from 'lucide-react';

export default function NotificationSettingsModal({ isOpen, onClose }) {
    const [settings, setSettings] = useState({
        reportUpdates: true,
        nearbyReports: true,
        importantAlerts: true,
        emailNotifications: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        // Aquí podrías guardar las preferencias en Firestore
        // Por ahora solo guardamos en localStorage
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Notificaciones</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors btn-press"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Settings */}
                <div className="p-4 space-y-3">
                    {/* Report Updates */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Actualizaciones de reportes</p>
                            <p className="text-sm text-gray-500">Cuando cambien el estado de tus reportes</p>
                        </div>
                        <button
                            onClick={() => handleToggle('reportUpdates')}
                            className={`w-12 h-7 rounded-full transition-colors relative ${settings.reportUpdates ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.reportUpdates ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            ></div>
                        </button>
                    </div>

                    {/* Nearby Reports */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Reportes cercanos</p>
                            <p className="text-sm text-gray-500">Problemas reportados en tu área</p>
                        </div>
                        <button
                            onClick={() => handleToggle('nearbyReports')}
                            className={`w-12 h-7 rounded-full transition-colors relative ${settings.nearbyReports ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.nearbyReports ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            ></div>
                        </button>
                    </div>

                    {/* Important Alerts */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Alertas importantes</p>
                            <p className="text-sm text-gray-500">Avisos urgentes de la ciudad</p>
                        </div>
                        <button
                            onClick={() => handleToggle('importantAlerts')}
                            className={`w-12 h-7 rounded-full transition-colors relative ${settings.importantAlerts ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.importantAlerts ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            ></div>
                        </button>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Notificaciones por email</p>
                            <p className="text-sm text-gray-500">Recibir resúmenes por correo</p>
                        </div>
                        <button
                            onClick={() => handleToggle('emailNotifications')}
                            className={`w-12 h-7 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            ></div>
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="px-4 pb-4">
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <p className="text-sm text-blue-800">
                            <Bell size={14} className="inline mr-1" />
                            Las notificaciones te ayudan a estar al tanto de tus reportes y de tu comunidad.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 p-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors btn-press"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors btn-press flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
