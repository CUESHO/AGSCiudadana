import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NewReport from './pages/NewReport';
import Profile from './pages/Profile';
import WorkerDashboard from './pages/WorkerDashboard';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente interno para manejar la lógica de autenticación y splash
function AppContent() {
    const [activeTab, setActiveTab] = useState('home');
    const [showSplash, setShowSplash] = useState(true);
    const { user, loading } = useAuth();

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    if (loading) return null;

    // Si no hay usuario, mostrar Login/Signup
    // NOTA: Esto se maneja aquí para proteger las rutas principales
    if (!user) {
        return (
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/worker" element={<WorkerDashboard />} />
                <Route path="*" element={<Login />} />
            </Routes>
        );
    }

    // Si hay usuario, mostrar la app principal
    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'home' && <Home />}
            {activeTab === 'report' && (
                <NewReport
                    onCancel={() => setActiveTab('home')}
                    onSuccess={() => {
                        alert('¡Reporte enviado con éxito!');
                        setActiveTab('home');
                    }}
                />
            )}
            {activeTab === 'profile' && <Profile />}
        </Layout>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}
