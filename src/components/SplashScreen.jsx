import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
    return (
        <motion.div
            className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            onAnimationComplete={onComplete}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <img src="/logo.jpg" alt="AGSCiudadana Logo" className="w-3/4 max-w-sm h-auto object-contain mb-4" />
            </motion.div>
        </motion.div>
    );
}
