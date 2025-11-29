import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NewReport from './pages/NewReport';
import MyReports from './pages/MyReports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import WorkerDashboard from './pages/WorkerDashboard';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

// Componente interno para manejar la lógica de autenticación y splash
function AppContent() {
    const [activeTab, setActiveTab] = useState('home');
    const [showSplash, setShowSplash] = useState(true);
    const { user, loading } = useAuth();
    const { showToast } = useToast();

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
            {activeTab === 'myreports' && <MyReports />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'report' && (
                <NewReport
                    onCancel={() => setActiveTab('home')}
                    onSuccess={() => {
                        showToast('¡Reporte enviado con éxito!', 'success');
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
            <ToastProvider>
                <NotificationProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </NotificationProvider>
            </ToastProvider>
        </AuthProvider>
    );
}
