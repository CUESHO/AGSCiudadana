import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase para AGSCiudadana
const firebaseConfig = {
    apiKey: "AIzaSyAocFg8GTA2aTtFmaB4aeh0b7dMkpt5KE4",
    authDomain: "agsciudadana-cd133.firebaseapp.com",
    projectId: "agsciudadana-cd133",
    storageBucket: "agsciudadana-cd133.firebasestorage.app",
    messagingSenderId: "336787209572",
    appId: "1:336787209572:web:50e3aad650c90a74164e71",
    measurementId: "G-K5175XFSTD"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar y exportar servicios para usar en la app
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;