import { Home, PlusCircle, User } from 'lucide-react';


export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-primary-600' : 'text-gray-400'}`}
                >
                    <Home size={24} />
                    <span className="text-xs mt-1">Inicio</span>
                </button>

                <button
                    onClick={() => setActiveTab('report')}
                    className="flex flex-col items-center p-2 -mt-6"
                >
                    <div className="bg-primary-600 rounded-full p-4 shadow-lg text-white transform transition-transform active:scale-95 border-4 border-white">
                        <PlusCircle size={32} />
                    </div>
                    <span className="text-xs mt-1 text-gray-400">Reportar</span>
                </button>

                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-primary-600' : 'text-gray-400'}`}
                >
                    <User size={24} />
                    <span className="text-xs mt-1">Perfil</span>
                </button>
            </div>
        </nav>
    );
}
