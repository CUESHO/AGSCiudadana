import { createContext, useContext, useState, useEffect } from 'react';
import { signUpWithEmail, signInWithEmail, signOutUser, onAuthChange } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Suscribirse a cambios en el estado de autenticación
        const unsubscribe = onAuthChange((userData) => {
            setUser(userData);
            setLoading(false);
        });

        // Cleanup: desuscribirse cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmail(email, password);
            if (result.success) {
                setUser(result.user);
            }
            return result;
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error al iniciar sesión' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const result = await signUpWithEmail(name, email, password);
            if (result.success) {
                setUser(result.user);
            }
            return result;
        } catch (error) {
            console.error('Error en signup:', error);
            return { success: false, error: 'Error al crear la cuenta' };
        }
    };

    const logout = async () => {
        try {
            await signOutUser();
            setUser(null);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

