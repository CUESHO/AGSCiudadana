import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import MapView from '../components/Map';
import { AlertTriangle, Lightbulb, Droplets, Trash2, ShieldAlert, X } from 'lucide-react';
import { getAllReports, deleteReport } from '../services/reportService';
import { useToast } from '../context/ToastContext';

const CATEGORY_ICONS = {
    'bache': AlertTriangle,
    'alumbrado': Lightbulb,
    'fuga': Droplets,
    'basura': Trash2,
    'seguridad': ShieldAlert,
};

const CATEGORY_COLORS = {
    'bache': 'bg-red-100 text-red-600',
    'alumbrado': 'bg-yellow-100 text-yellow-600',
    'fuga': 'bg-blue-100 text-blue-600',
    'basura': 'bg-green-100 text-green-600',
    'seguridad': 'bg-purple-100 text-purple-600',
};

export default function Home() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            const result = await getAllReports(5); // Obtener los 5 más recientes
            if (result.success) {
                setRecentReports(result.reports);
            }
            setLoading(false);
        };

        fetchReports();
    }, []);

    const getStatusBadge = (status) => {
        const colors = {
            'Pendiente': 'bg-yellow-500 text-white',
            'En Proceso': 'bg-blue-500 text-white',
            'Resuelto': 'bg-green-500 text-white',
        };
        return colors[status] || 'bg-gray-500 text-white';
    };

    const getCategoryIcon = (categoryId) => {
        const Icon = CATEGORY_ICONS[categoryId] || AlertTriangle;
        return Icon;
    };

    const getCategoryColor = (categoryId) => {
        return CATEGORY_COLORS[categoryId] || 'bg-gray-100 text-gray-600';
    };

    const handleDeleteReport = async (reportId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
            return;
        }

        setDeletingId(reportId);
        const result = await deleteReport(reportId, user.uid);

        if (result.success) {
            setRecentReports(recentReports.filter(r => r.id !== reportId));
            showToast('Reporte eliminado correctamente', 'success');
        } else {
            showToast(result.error || 'Error al eliminar el reporte', 'error');
        }

        setDeletingId(null);
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.name?.split(' ')[0]}</h1>
                    <p className="text-gray-500 text-sm">¿Qué quieres reportar hoy? (v1.4.3)</p>
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold border border-primary-100">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            </header>

            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-gray-800">Reportes Cercanos</h2>
                    <button className="text-primary-600 text-sm font-medium btn-press">Ver todo</button>
                </div>
                <div className="h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <MapView />
                </div>
            </section>

            <section>
                <h2 className="font-semibold text-gray-800 mb-3">Reportes Recientes</h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : recentReports.length === 0 ? (
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm text-center text-gray-500">
                        <p className="font-medium">No hay reportes aún</p>
                        <p className="text-sm mt-1">Sé el primero en reportar un problema</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.map((report) => {
                            const Icon = getCategoryIcon(report.category?.id);
                            const categoryColor = getCategoryColor(report.category?.id);
                            const isMyReport = report.userId === user?.uid;

                            return (
                                <div key={report.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-3 flex gap-3">
                                        <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${categoryColor}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{report.category?.name || 'Reporte'}</h3>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <span>{report.date}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </p>
                                        </div>
                                        {isMyReport && (
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                disabled={deletingId === report.id}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors btn-press disabled:opacity-50"
                                                title="Eliminar reporte"
                                            >
                                                {deletingId === report.id ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <X size={20} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
