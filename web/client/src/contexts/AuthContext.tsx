import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
    uid: string;
    name: string;
    email: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    const login = async (email: string, password: string) => {
        try {
            // Static implementation - authentication should be handled by backend
            if (!email || !password) {
                return { success: false, error: 'Email y contraseña son requeridos' };
            }
            
            // Placeholder for future backend integration
            return { success: false, error: 'Autenticación no disponible. Por favor contacte al administrador.' };
        } catch (error: any) {
            return { success: false, error: 'Error al iniciar sesión' };
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            // Static implementation - registration should be handled by backend
            if (!name || !email || !password) {
                return { success: false, error: 'Todos los campos son requeridos' };
            }
            
            // Placeholder for future backend integration
            return { success: false, error: 'Registro no disponible. Por favor contacte al administrador.' };
        } catch (error: any) {
            return { success: false, error: 'Error al crear la cuenta' };
        }
    };

    const logout = async () => {
        try {
            setUser(null);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    const resendVerificationEmail = async () => {
        return { success: false, error: 'Verificación de email no disponible' };
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, resendVerificationEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
