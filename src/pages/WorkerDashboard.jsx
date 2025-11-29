import { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus } from '../services/reportService';
import {
    MapPin, Calendar, User as UserIcon, AlertTriangle,
    ArrowLeft, MoreVertical, Camera, List, Map as MapIcon,
    Filter, ChevronDown, Bell, PlusCircle, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom colored markers based on status
const createColoredIcon = (status) => {
    let color = '#FCD34D'; // Yellow for Pendiente
    if (status === 'En Proceso') color = '#FB923C'; // Orange
    if (status === 'Resuelto') color = '#4ADE80'; // Green

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 24],
    });
};

export default function WorkerDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [viewMode, setViewMode] = useState('lista');
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchReports = async () => {
        setLoading(true);
        const result = await getAllReports(100);
        if (result.success) {
            setReports(result.reports);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateReport = async () => {
        if (!selectedReport || !newStatus) return;

        const result = await updateReportStatus(selectedReport.id, newStatus, note);
        if (result.success) {
            setReports(reports.map(r =>
                r.id === selectedReport.id ? { ...r, status: newStatus } : r
            ));
            setSelectedReport({ ...selectedReport, status: newStatus });
            setNote('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getPriorityBadge = (status) => {
        if (status === 'Pendiente') return { text: 'Prioridad Alta', color: 'bg-red-100 text-red-600' };
        if (status === 'En Proceso') return { text: 'En Proceso', color: 'bg-orange-100 text-orange-600' };
        return { text: 'Completado', color: 'bg-green-100 text-green-600' };
    };

    const getStatusColor = (status) => {
        if (status === 'Pendiente') return 'bg-yellow-600';
        if (status === 'En Proceso') return 'bg-orange-600';
        return 'bg-green-600';
    };

    const pendingReports = reports.filter(r => r.status === 'Pendiente');

    // Vista de Lista Principal
    if (!selectedReport) {
        return (
            <div className="h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="bg-white p-4 shadow-sm border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-lg font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'C'}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Panel de Cuadrillas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell size={24} className="text-gray-600" />
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                title="Cerrar sesión"
                            >
                                <LogOut size={24} className="text-red-600" />
                            </button>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Hola, {user?.name || 'Trabajador'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        Tienes {pendingReports.length} reportes pendientes hoy
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b border-gray-200 flex">
                    <button
                        onClick={() => setViewMode('lista')}
                        className={`flex-1 py-3 text-sm font-medium ${viewMode === 'lista'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500'
                            }`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('mapa')}
                        className={`flex-1 py-3 text-sm font-medium ${viewMode === 'mapa'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500'
                            }`}
                    >
                        Mapa
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white px-4 py-3 border-b border-gray-100 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                        <Filter size={16} />
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                        Ordenar por: Distancia
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {viewMode === 'mapa' ? (
                        <div className="relative h-full">
                            <MapContainer
                                center={[21.8853, -102.2916]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {reports.map((report) => (
                                    <Marker
                                        key={report.id}
                                        position={[report.locationDetails.lat, report.locationDetails.lng]}
                                        icon={createColoredIcon(report.status)}
                                    >
                                        <Popup>
                                            <div className="text-sm min-w-[150px]">
                                                <p className="font-bold text-gray-900">{report.category?.name}</p>
                                                <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${report.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                                            report.status === 'En Proceso' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{report.date}</p>
                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setNewStatus(report.status);
                                                    }}
                                                    className="mt-2 w-full py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700"
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>

                            {/* Legend */}
                            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]">
                                <p className="font-bold text-gray-900 mb-2">Leyenda</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow"></div>
                                        <span className="text-gray-700">Pendiente</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow"></div>
                                        <span className="text-gray-700">En Proceso</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow"></div>
                                        <span className="text-gray-700">Resuelto</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                reports.map((report) => {
                                    const priority = getPriorityBadge(report.status);
                                    return (
                                        <div
                                            key={report.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {report.category?.name || 'Reporte'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {report.locationDetails?.address || 'Av. Ejemplo 123'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priority.color}`}>
                                                        {priority.text}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                                                        Estado: {report.status}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        Asignado: {report.date}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setNewStatus(report.status);
                                                    }}
                                                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                                                >
                                                    Ver detalles del reporte
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* FAB */}
                <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <PlusCircle size={28} />
                </button>
            </div>
        );
    }

    // Vista de Detalle del Reporte
    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Detalles del Reporte</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={24} className="text-gray-700" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Title & Status */}
                <div className="bg-white p-4 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedReport.category?.name || 'Reporte'}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                            {selectedReport.status}
                        </span>
                        <span className="text-xs text-gray-500">
                            ID: #{selectedReport.id.slice(0, 8)}
                        </span>
                    </div>
                </div>

                {/* Map */}
                <div className="h-48 bg-gray-200">
                    <MapContainer
                        center={[selectedReport.locationDetails.lat, selectedReport.locationDetails.lng]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                            position={[selectedReport.locationDetails.lat, selectedReport.locationDetails.lng]}
                            icon={createColoredIcon(selectedReport.status)}
                        />
                    </MapContainer>
                </div>

                {/* Details */}
                <div className="bg-white p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3">Detalles del Reporte</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <div className="text-gray-400 mt-0.5">📝</div>
                            <p className="text-gray-700">{selectedReport.description}</p>
                        </div>

                        <div className="flex gap-3">
                            <Calendar size={16} className="text-gray-400 mt-0.5" />
                            <p className="text-gray-700">
                                {selectedReport.date} - {selectedReport.createdAt?.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <MapPin size={16} className="text-gray-400 mt-0.5" />
                            <p className="text-gray-700">
                                {selectedReport.locationDetails?.address || `${selectedReport.locationDetails?.lat.toFixed(4)}, ${selectedReport.locationDetails?.lng.toFixed(4)}`}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <UserIcon size={16} className="text-gray-400 mt-0.5" />
                            <p className="text-gray-700">Reportado por: Usuario</p>
                        </div>
                    </div>
                </div>

                {/* User Evidence */}
                {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 && (
                    <div className="bg-white p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-3">Evidencia del Usuario</h3>
                        <div className="flex gap-2 overflow-x-auto">
                            {selectedReport.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Evidencia ${index + 1}`}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Activity History */}
                <div className="bg-white p-4">
                    <h3 className="font-bold text-gray-900 mb-3">Historial de Actividad</h3>

                    {/* Change Status */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cambiar Estado
                        </label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Resuelto">Resuelto</option>
                        </select>
                    </div>

                    {/* Add Note */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Añadir Nota
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Escribe tus notas aquí..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            rows="3"
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                            <Camera size={18} />
                            Subir Foto
                        </button>
                        <button
                            onClick={handleUpdateReport}
                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
