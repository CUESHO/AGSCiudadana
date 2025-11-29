import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Lock, User as UserIcon, BarChart3, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserReportStats } from '../services/reportService';
import { useToast } from '../context/ToastContext';
import EditProfileModal from '../components/EditProfileModal';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function Profile() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const [stats, setStats] = useState({ total: 0, resueltos: 0, activos: 0 });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            setLoading(true);

            // Obtener estadísticas
            const statsResult = await getUserReportStats(user.uid);
            if (statsResult.success) {
                setStats(statsResult.stats);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [user]);

    const handleEditSuccess = () => {
        // Recargar la página o forzar actualización del contexto
        window.location.reload();
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col pb-20">
            {/* Header */}
            <div className="bg-white p-6 border-b border-gray-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 text-sm">{user?.email}</p>

                <button
                    onClick={() => setShowEditModal(true)}
                    className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:bg-primary-700 transition-colors btn-press"
                >
                    Editar Perfil
                </button>
            </div>

            {/* Stats */}
            <div className="p-4 bg-white border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Cuenta y Preferencias</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-blue-600">{stats.total}</span>
                        <span className="text-xs text-blue-700 font-medium">Total</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-green-600">{stats.resueltos}</span>
                        <span className="text-xs text-green-700 font-medium">Resueltos</span>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center">
                        <span className="block text-2xl font-bold text-yellow-600">{stats.activos}</span>
                        <span className="text-xs text-yellow-700 font-medium">Activos</span>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Cuenta y Preferencias */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors btn-press"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <UserIcon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Información Personal</p>
                                <p className="text-xs text-gray-500">Edita tu perfil y datos</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>

                    <div className="border-t border-gray-100"></div>

                    <button
                        onClick={() => setShowNotificationModal(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors btn-press"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                <Bell size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Configuración de Notificaciones</p>
                                <p className="text-xs text-gray-500">Gestiona tus alertas</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>

                    <div className="border-t border-gray-100"></div>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors btn-press"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <Lock size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                                <p className="text-xs text-gray-500">Actualiza tu seguridad</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Actividad */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary-600" />
                            Actividad
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Estadísticas de Reportes</span>
                            <span className="text-sm font-semibold text-primary-600">{stats.total} reportes enviados</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.total > 0 ? (stats.resueltos / stats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {stats.resueltos} de {stats.total} reportes han sido resueltos
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors btn-press"
                >
                    <LogOut size={20} />
                    Cerrar Sesión
                </button>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={handleEditSuccess}
            />

            {/* Notification Settings Modal */}
            <NotificationSettingsModal
                isOpen={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
            />

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => showToast('Contraseña actualizada correctamente', 'success')}
            />
        </div>
    );
}
