import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 left-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg ${bgColors[type]} max-w-md mx-auto`}
        >
            <div className="flex-shrink-0 mr-3">
                {icons[type]}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
