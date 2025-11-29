import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {toast && (
                    <Toast
                        key="toast"
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
