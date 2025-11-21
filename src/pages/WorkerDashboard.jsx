import { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus, cleanupOldReports } from '../services/reportService';
import { MapPin, Calendar, CheckCircle, Clock, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WorkerDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchReports = async () => {
        setLoading(true);
        setError(null);

        // Intentar limpiar reportes viejos primero
        await cleanupOldReports();

        const result = await getAllReports(100);
        if (result.success) {
            setReports(result.reports);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStatusChange = async (reportId, newStatus) => {
        setUpdating(reportId);
        const result = await updateReportStatus(reportId, newStatus);

        if (result.success) {
            // Actualizar lista localmente
            setReports(reports.map(r =>
                r.id === reportId ? { ...r, status: newStatus } : r
            ));
        }
        setUpdating(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'En Proceso': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Resuelto': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Panel de Cuadrillas</h1>
                    <p className="text-xs text-gray-500">AGS Ciudadana - Trabajadores</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchReports} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-6 rounded-xl text-center border border-red-100">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-bold text-red-700 mb-2">No se pudieron cargar los reportes</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        {error.includes('permission') && (
                            <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200 inline-block text-left">
                                <p className="font-bold mb-2">💡 Solución:</p>
                                <p>Como estás accediendo sin iniciar sesión, necesitas actualizar las reglas de Firestore:</p>
                                <code className="block bg-gray-100 p-2 mt-2 rounded text-xs">
                                    allow read, write: if true;
                                </code>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Header Card */}
                                <div className="p-4 border-b border-gray-50 flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {report.category?.name || 'Reporte'}
                                        </span>
                                        <h3 className="font-medium text-gray-900 mt-1">{report.description}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>

                                {/* Image if exists */}
                                {report.imageUrls && report.imageUrls.length > 0 && (
                                    <div className="h-48 bg-gray-100">
                                        <img
                                            src={report.imageUrls[0]}
                                            alt="Evidencia"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Details */}
                                <div className="p-4 bg-gray-50 text-sm text-gray-600 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{report.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>Ubicación: {report.locationDetails?.lat.toFixed(4)}, {report.locationDetails?.lng.toFixed(4)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-3 grid grid-cols-2 gap-3 bg-white border-t border-gray-100">
                                    {report.status !== 'Resuelto' && (
                                        <>
                                            {report.status === 'Pendiente' && (
                                                <button
                                                    onClick={() => handleStatusChange(report.id, 'En Proceso')}
                                                    disabled={updating === report.id}
                                                    className="col-span-2 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                                                >
                                                    <Clock size={18} />
                                                    Iniciar Atención
                                                </button>
                                            )}

                                            {report.status === 'En Proceso' && (
                                                <button
                                                    onClick={() => handleStatusChange(report.id, 'Resuelto')}
                                                    disabled={updating === report.id}
                                                    className="col-span-2 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors"
                                                >
                                                    <CheckCircle size={18} />
                                                    Marcar Resuelto
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {report.status === 'Resuelto' && (
                                        <div className="col-span-2 text-center py-2 text-green-600 font-medium flex items-center justify-center gap-2">
                                            <CheckCircle size={18} />
                                            Reporte Completado
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
