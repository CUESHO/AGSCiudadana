import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, HardHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/worker');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center p-6">
            <div className="mb-10 text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                    <HardHat size={40} className="text-gray-900" />
                </div>
                <h1 className="text-2xl font-bold text-white">Acceso Cuadrillas</h1>
                <p className="text-gray-400">Personal autorizado únicamente</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="email"
                        placeholder="Correo institucional"
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 transition-all"
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
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-yellow-400"
                >
                    Entrar al Panel
                    <ArrowRight size={20} />
                </button>
            </form>

            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                    ← Volver a la App Ciudadana
                </button>
            </div>
        </div>
    );
}
