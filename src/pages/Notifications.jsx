import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReportsByUser } from '../services/reportService';

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;

            setLoading(true);
            const result = await getReportsByUser(user.uid);

            if (result.success) {
                // Crear notificaciones basadas en cambios de estado
                const notifs = result.reports
                    .filter(report => report.status !== 'Pendiente') // Solo mostrar reportes con actualizaciones
                    .map(report => {
                        // Calcular tiempo relativo
                        const reportDate = report.updatedAt || report.createdAt;
                        const timeAgo = getTimeAgo(reportDate);

                        return {
                            id: report.id,
                            type: report.status === 'Resuelto' ? 'success' : 'info',
                            title: getNotificationTitle(report.status, report.category?.name),
                            message: getNotificationMessage(report.status, report.category?.name),
                            time: timeAgo,
                            read: report.readByUser !== false,
                            reportId: report.id
                        };
                    })
                    .sort((a, b) => !a.read - !b.read); // No leídas primero

                setNotifications(notifs);
            }
            setLoading(false);
        };

        fetchNotifications();
    }, [user]);

    const getTimeAgo = (date) => {
        if (!date) return 'Hace un momento';

        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Hace un momento';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days === 1) return 'Ayer';
        if (days < 7) return `Hace ${days} días`;

        return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    };

    const getNotificationTitle = (status, category) => {
        if (status === 'Resuelto') {
            return '✅ Problema Resuelto';
        } else if (status === 'En Proceso') {
            return '🔧 En Proceso';
        }
        return 'Actualización';
    };

    const getNotificationMessage = (status, category) => {
        if (status === 'Resuelto') {
            return `Tu reporte de "${category}" ha sido resuelto. ¡Gracias por contribuir a mejorar la ciudad!`;
        } else if (status === 'En Proceso') {
            return `Tu reporte de "${category}" está siendo atendido por el equipo municipal.`;
        }
        return `Tu reporte de "${category}" ha sido actualizado.`;
    };

    const getIconForType = (type) => {
        if (type === 'success') {
            return <CheckCircle2 size={24} className="text-green-600" />;
        } else if (type === 'info') {
            return <Clock size={24} className="text-blue-600" />;
        }
        return <Bell size={24} className="text-gray-600" />;
    };

    const getBackgroundForType = (type) => {
        if (type === 'success') {
            return 'bg-green-50 border-green-100';
        } else if (type === 'info') {
            return 'bg-blue-50 border-blue-100';
        }
        return 'bg-gray-50 border-gray-100';
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
                    <Bell size={24} className="text-primary-600" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Actualizaciones sobre tus reportes
                </p>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
                        <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No tienes notificaciones</p>
                        <p className="text-sm mt-1">
                            Te notificaremos cuando haya actualizaciones en tus reportes
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 rounded-xl border ${getBackgroundForType(notif.type)} ${!notif.read ? 'shadow-md' : 'shadow-sm'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIconForType(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {notif.title}
                                            </h3>
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-primary-600 rounded-full ml-2 mt-2"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {notif.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Banner */}
            {!loading && notifications.length > 0 && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start gap-2 text-sm text-blue-800">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>
                            Las notificaciones te mantienen informado sobre el progreso de tus reportes en tiempo real.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
