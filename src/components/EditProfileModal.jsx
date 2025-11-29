import { useState } from 'react';
import { X, User as UserIcon, Mail, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function EditProfileModal({ isOpen, onClose, onSuccess }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // 1. Actualizar en Firebase Auth (displayName)
                await updateProfile(currentUser, {
                    displayName: formData.name
                });

                // 2. Actualizar en Firestore (documento de usuario)
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, {
                    name: formData.name
                });

                // 3. Forzar recarga del usuario
                await currentUser.reload();

                // 4. Llamar al callback de éxito
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            setError('No se pudo actualizar el perfil. Intenta de nuevo.');
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
                    <h2 className="text-lg font-bold text-gray-900">Editar Perfil</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors btn-press"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Avatar Preview */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {formData.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <UserIcon size={16} className="inline mr-1" />
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    {/* Email (solo lectura) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail size={16} className="inline mr-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none text-gray-500 cursor-not-allowed"
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Por seguridad, el email no se puede cambiar desde aquí.
                        </p>
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
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
