import { useAuth } from '../context/AuthContext';
import { LogOut, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();

    // Simulated history data
    const history = [
        { id: 1, title: 'Bache en Centro', date: '20 Nov 2025', status: 'Pendiente', color: 'text-yellow-600 bg-yellow-100' },
        { id: 2, title: 'Luminaria fundida', date: '18 Nov 2025', status: 'En Proceso', color: 'text-blue-600 bg-blue-100' },
        { id: 3, title: 'Basura acumulada', date: '10 Nov 2025', status: 'Resuelto', color: 'text-green-600 bg-green-100' },
    ];

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

            {/* Stats (Optional/Decorative) */}
            <div className="grid grid-cols-3 gap-1 p-4">
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">3</span>
                    <span className="text-xs text-gray-500">Reportes</span>
                </div>
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">1</span>
                    <span className="text-xs text-gray-500">Resueltos</span>
                </div>
                <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">2</span>
                    <span className="text-xs text-gray-500">Activos</span>
                </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 pt-0">
                <h2 className="font-semibold text-gray-800 mb-3 ml-1">Mis Reportes</h2>
                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.color}`}>
                                    {item.status}
                                </span>
                            </div>
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
            </div>
        </div>
    );
}
