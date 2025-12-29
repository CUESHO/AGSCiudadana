import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    User, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = userDoc.data();
                    
                    setUser({
                        uid: firebaseUser.uid,
                        name: userData?.name || 'Usuario',
                        email: firebaseUser.email,
                        photoURL: userData?.photoURL || null
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback if firestore fails
                    setUser({
                        uid: firebaseUser.uid,
                        name: 'Usuario',
                        email: firebaseUser.email,
                        photoURL: null
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            console.error('Error en login:', error);
            let errorMessage = 'Error al iniciar sesión';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'Credenciales inválidas';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido';
            }
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Enviar correo de verificación
            await sendEmailVerification(newUser);

            await setDoc(doc(db, 'users', newUser.uid), {
                uid: newUser.uid,
                name,
                email,
                createdAt: new Date().toISOString(),
                photoURL: null
            });

            return { success: true };
        } catch (error: any) {
            console.error('Error en signup:', error);
            let errorMessage = 'Error al crear la cuenta';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'El correo ya está registrado';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido';
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    const resendVerificationEmail = async () => {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            try {
                await sendEmailVerification(auth.currentUser);
                return { success: true };
            } catch (error: any) {
                console.error('Error resending verification email:', error);
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: 'No hay usuario o ya está verificado' };
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
