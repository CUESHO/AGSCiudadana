import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Search, Filter, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReportsByUser } from '../services/reportService';

export default function MyReports() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, Pendiente, En Proceso, Resuelto

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            const result = await getReportsByUser(user.uid);
            if (result.success) {
                setReports(result.reports);
                setFilteredReports(result.reports);
            } else {
                console.error("Error fetching reports:", result.error);
                setError(result.error);
            }

            setLoading(false);
        };

        fetchReports();
    }, [user]);

    // Filtrar reportes por búsqueda y status
    useEffect(() => {
        let filtered = reports;

        // Filtrar por búsqueda
        if (searchQuery) {
            filtered = filtered.filter(report =>
                report.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrar por status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(report => report.status === filterStatus);
        }

        setFilteredReports(filtered);
    }, [searchQuery, filterStatus, reports]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendiente':
                return 'bg-yellow-500 text-white';
            case 'En Proceso':
                return 'bg-blue-500 text-white';
            case 'Resuelto':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            {/* Header con búsqueda */}
            <div className="bg-white p-4 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Mis Reportes</h1>

                {/* Barra de búsqueda */}
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Buscar reportes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>

                {/* Filtros de status */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap btn-press ${filterStatus === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilterStatus('Pendiente')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap btn-press ${filterStatus === 'Pendiente'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Pendiente
                    </button>
                    <button
                        onClick={() => setFilterStatus('En Proceso')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap btn-press ${filterStatus === 'En Proceso'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        En Proceso
                    </button>
                    <button
                        onClick={() => setFilterStatus('Resuelto')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap btn-press ${filterStatus === 'Resuelto'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Resuelto
                    </button>
                </div>
            </div>

            {/* Lista de reportes */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-xl text-center text-red-600 border border-red-100">
                        <AlertCircle size={32} className="mx-auto mb-2" />
                        <p className="font-medium">Error al cargar reportes</p>
                        <p className="text-xs mt-1 opacity-80">{error}</p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-gray-500">
                        <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">
                            {searchQuery || filterStatus !== 'all'
                                ? 'No se encontraron reportes'
                                : 'No tienes reportes aún'}
                        </p>
                        <p className="text-sm mt-1">
                            {searchQuery || filterStatus !== 'all'
                                ? 'Intenta con otra búsqueda o filtro'
                                : 'Crea tu primer reporte para empezar'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden btn-press"
                            >
                                {/* Imagen del reporte */}
                                {report.imageUrls && report.imageUrls.length > 0 && (
                                    <div className="h-40 bg-gray-100 relative">
                                        <img
                                            src={report.imageUrls[0]}
                                            alt="Evidencia"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Badge de status sobre la imagen */}
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(
                                                    report.status
                                                )}`}
                                            >
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido del reporte */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900 text-base">
                                            {report.category?.name || 'Reporte'}
                                        </h3>
                                        {/* Si no hay imagen, mostrar badge aquí */}
                                        {(!report.imageUrls || report.imageUrls.length === 0) && (
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    report.status
                                                )}`}
                                            >
                                                {report.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {report.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {report.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            Ver ubicación
                                        </div>
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
