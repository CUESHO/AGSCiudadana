import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

/**
 * Crear una nueva cuenta de usuario con email y contraseña
 * También crea un documento de usuario en Firestore con información adicional
 */
export const signUpWithEmail = async (name, email, password) => {
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crear documento de usuario en Firestore con información adicional
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            photoURL: null
        });

        return {
            success: true,
            user: {
                uid: user.uid,
                name: name,
                email: email
            }
        };
    } catch (error) {
        console.error('Error en signup:', error);

        // Manejar errores específicos de Firebase
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

/**
 * Iniciar sesión con email y contraseña
 */
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener información adicional del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        return {
            success: true,
            user: {
                uid: user.uid,
                name: userData?.name || 'Usuario',
                email: user.email,
                photoURL: userData?.photoURL || null
            }
        };
    } catch (error) {
        console.error('Error en login:', error);

        let errorMessage = 'Error al iniciar sesión';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Credenciales inválidas';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Credenciales inválidas';
        }

        return { success: false, error: errorMessage };
    }
};

/**
 * Cerrar sesión
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error en logout:', error);
        return { success: false, error: 'Error al cerrar sesión' };
    }
};

/**
 * Obtener el usuario actual autenticado
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Listener para cambios en el estado de autenticación
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado de auth
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuario autenticado, obtener datos adicionales
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            callback({
                uid: user.uid,
                name: userData?.name || 'Usuario',
                email: user.email,
                photoURL: userData?.photoURL || null
            });
        } else {
            // No hay usuario autenticado
            callback(null);
        }
    });
};
