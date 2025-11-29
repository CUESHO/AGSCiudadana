import { Home, PlusCircle, User, FileText, Bell } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <nav className="w-full bg-white z-50">
            <div className="grid grid-cols-5 gap-0 h-16 w-full mx-auto relative px-2">
                {/* Inicio */}
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center justify-center btn-press ${activeTab === 'home' ? 'text-primary-600' : 'text-slate-400'}`}
                >
                    <Home size={24} />
                    <span className="text-xs mt-1 font-medium">Inicio</span>
                </button>

                {/* Reportes */}
                <button
                    onClick={() => setActiveTab('myreports')}
                    className={`flex flex-col items-center justify-center btn-press ${activeTab === 'myreports' ? 'text-primary-600' : 'text-slate-400'}`}
                >
                    <FileText size={24} />
                    <span className="text-xs mt-1 font-medium">Reportes</span>
                </button>

                {/* Espaciador para el botón central */}
                <div className="flex items-center justify-center pointer-events-none"></div>

                {/* Notificaciones */}
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex flex-col items-center justify-center btn-press ${activeTab === 'notifications' ? 'text-primary-600' : 'text-slate-400'}`}
                >
                    <Bell size={24} />
                    <span className="text-xs mt-1 font-medium">Alertas</span>
                </button>

                {/* Perfil */}
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center justify-center btn-press ${activeTab === 'profile' ? 'text-primary-600' : 'text-slate-400'}`}
                >
                    <User size={24} />
                    <span className="text-xs mt-1 font-medium">Perfil</span>
                </button>

                {/* Botón central de Reportar - Posicionado absolutamente */}
                <button
                    onClick={() => setActiveTab('report')}
                    className="flex flex-col items-center btn-press absolute left-1/2 -translate-x-1/2 -top-6"
                >
                    <div className="bg-primary-600 text-white p-4 rounded-full shadow-lg border-4 border-white">
                        <PlusCircle size={32} />
                    </div>
                    <span className="text-xs mt-1 font-medium text-slate-600">Reportar</span>
                </button>
            </div>
        </nav>
    );
}

