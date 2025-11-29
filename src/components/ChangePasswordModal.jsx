import { useState } from 'react';
import { X, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase';

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (formData.newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error('Usuario no autenticado');
            }

            // Re-autenticar al usuario antes de cambiar contraseña
            const credential = EmailAuthProvider.credential(
                user.email,
                formData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);

            // Cambiar la contraseña
            await updatePassword(user, formData.newPassword);

            // Éxito
            onSuccess?.();
            onClose();

            // Resetear formulario
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Error al cambiar contraseña:', err);

            if (err.code === 'auth/wrong-password') {
                setError('La contraseña actual es incorrecta');
            } else if (err.code === 'auth/weak-password') {
                setError('La nueva contraseña es muy débil');
            } else {
                setError('No se pudo cambiar la contraseña. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors btn-press"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Contraseña Actual */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                                placeholder="Tu contraseña actual"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Lock size={16} className="inline mr-1" />
                            Confirmar nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                                placeholder="Repite la nueva contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors btn-press"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors btn-press flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Cambiar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
