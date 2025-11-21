import { useAuth } from '../context/AuthContext';
import MapView from '../components/Map';
import { AlertTriangle, Lightbulb, ShieldAlert, Droplets } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.name?.split(' ')[0]}</h1>
                    <p className="text-gray-500 text-sm">¿Qué quieres reportar hoy?</p>
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold border border-primary-100">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            </header>

            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-gray-800">Mapa de Reportes</h2>
                    <button className="text-primary-600 text-sm font-medium">Ver todo</button>
                </div>
                <MapView />
            </section>

            <section>
                <h2 className="font-semibold text-gray-800 mb-3">Reportes Recientes</h2>
                <div className="space-y-3">
                    <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex-shrink-0 flex items-center justify-center text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Bache en Av. Universidad</h3>
                            <p className="text-xs text-gray-500 mt-1">Hace 2 horas • Pendiente</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex-shrink-0 flex items-center justify-center text-yellow-600">
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Luminaria fundida</h3>
                            <p className="text-xs text-gray-500 mt-1">Hace 5 horas • En proceso</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-600">
                            <Droplets size={24} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Fuga de agua</h3>
                            <p className="text-xs text-gray-500 mt-1">Ayer • Resuelto</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
