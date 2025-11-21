import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NewReport from './pages/NewReport';
import Profile from './pages/Profile';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
    const [activeTab, setActiveTab] = useState('home');
    const [showSplash, setShowSplash] = useState(true);
    const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
    const { user, loading } = useAuth();

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    if (loading) return null;

    if (!user) {
        if (authView === 'login') {
            return <Login onSwitchToSignUp={() => setAuthView('signup')} />;
        } else {
            return <SignUp onSwitchToLogin={() => setAuthView('login')} />;
        }
    }

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
            <AppContent />
        </AuthProvider>
    );
}
