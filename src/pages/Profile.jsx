import { useAuth } from '../context/AuthContext';
import { LogOut, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReportsByUser, getUserReportStats, markReportAsRead } from '../services/reportService';

export default function Profile() {
    const { user, logout } = useAuth();
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ total: 0, resueltos: 0, activos: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            // Obtener reportes del usuario
            const reportsResult = await getReportsByUser(user.uid);
            if (reportsResult.success) {
                setReports(reportsResult.reports);

                // Verificar notificaciones (reportes resueltos no leídos)
                const unread = reportsResult.reports.filter(r => r.status === 'Resuelto' && r.readByUser === false);
                if (unread.length > 0) {
                    // Marcar como leídos automáticamente después de verlos (o podrías hacerlo al hacer click)
                    unread.forEach(async (r) => {
                        await markReportAsRead(r.id);
                    });
                    // Mostrar alerta visual (opcional, ya que ya están en la lista)
                    // Aquí podríamos poner un estado para mostrar un toast, pero por ahora
                    // el cambio de estado en la lista es suficiente feedback.
                }
            } else {
                console.error("Error fetching reports:", reportsResult.error);
                setError(reportsResult.error);
            }

            // Obtener estadísticas
            const statsResult = await getUserReportStats(user.uid);
            if (statsResult.success) {
                setStats(statsResult.stats);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendiente':
                return 'text-yellow-600 bg-yellow-100';
            case 'En Proceso':
                return 'text-blue-600 bg-blue-100';
            case 'Resuelto':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-6 border-b border-gray-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mb-4 border-4 border-white shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 text-sm">{user?.email}</p>

                <button
                    onClick={logout}
                    className="mt-4 flex items-center gap-2 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    Cerrar Sesión
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1 p-4">
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">{stats.total}</span>
                    <span className="text-xs text-gray-500">Reportes</span>
                </div>
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">{stats.resueltos}</span>
                    <span className="text-xs text-gray-500">Resueltos</span>
                </div>
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">{stats.activos}</span>
                    <span className="text-xs text-gray-500">Activos</span>
                </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 pt-0">
                <h2 className="font-semibold text-gray-800 mb-3 ml-1">Mis Reportes</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-xl text-center text-red-600 border border-red-100">
                        <AlertCircle size={32} className="mx-auto mb-2" />
                        <p className="font-medium">Error al cargar reportes</p>
                        <p className="text-xs mt-1 opacity-80">{error}</p>
                        {error.includes('index') && (
                            <p className="text-xs mt-2 font-bold">
                                ¡Falta crear el índice en Firebase! Revisa la consola (F12) para el link.
                            </p>
                        )}
                    </div>
                ) : reports.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-gray-500">
                        <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No tienes reportes aún</p>
                        <p className="text-sm mt-1">Crea tu primer reporte para empezar</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reports.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{item.category?.name || 'Reporte'}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                        {item.status}
                                        {item.status === 'Resuelto' && item.readByUser === false && (
                                            <span className="ml-1 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        )}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                {item.imageUrls && item.imageUrls.length > 0 && (
                                    <img
                                        src={item.imageUrls[0]}
                                        alt="Evidencia"
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        Ver mapa
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
