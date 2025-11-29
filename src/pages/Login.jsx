import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login({ onSwitchToSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
            <div className="mb-10 text-center">
                <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
                <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
                <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
                <p className="mt-2 text-xs text-gray-400">v1.4.3 - Debug</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    Iniciar Sesión
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="mt-8 text-center text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500">
                        Regístrate aquí
                    </Link>
                </p>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link to="/worker" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        Acceso Personal (Cuadrillas)
                    </Link>
                </div>
            </div>
        </div>
    );
}
