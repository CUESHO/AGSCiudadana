import { useState } from 'react';
import { AlertTriangle, Lightbulb, ShieldAlert, Droplets, Trash2, MapPin, Camera, ArrowLeft, CheckCircle } from 'lucide-react';
import MapView from '../components/Map';
import { useAuth } from '../context/AuthContext';
import { createReport } from '../services/reportService';
import { uploadReportImage } from '../services/storageService';

const CATEGORIES = [
    { id: 'bache', name: 'Bache', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { id: 'alumbrado', name: 'Alumbrado', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'fuga', name: 'Fuga de Agua', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
    { id: 'basura', name: 'Basura', icon: Trash2, color: 'bg-green-100 text-green-600' },
    { id: 'seguridad', name: 'Inseguridad', icon: ShieldAlert, color: 'bg-purple-100 text-purple-600' },
];

export default function NewReport({ onCancel, onSuccess }) {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Category, 2: Location, 3: Details
    const [data, setData] = useState({ category: null, location: null, description: '', image: null });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleCategorySelect = (cat) => {
        setData({ ...data, category: cat });
        setStep(2);
    };

    const handleLocationConfirm = () => {
        // In a real app, we'd get the actual coords from the map center
        setData({ ...data, location: { lat: 21.8853, lng: -102.2916 } });
        setStep(3);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');

        try {
            let imageUrl = null;

            // Subir imagen si existe
            if (imageFile) {
                const uploadResult = await uploadReportImage(imageFile, user.uid);
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error);
                }
                imageUrl = uploadResult.url;
            }

            // Crear reporte en Firestore
            const reportData = {
                userId: user.uid,
                userName: user.name,
                category: data.category,
                location: data.location,
                description: data.description,
                imageUrl: imageUrl
            };

            const result = await createReport(reportData);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Éxito - llamar onSuccess después de un pequeño delay
            setTimeout(() => {
                setUploading(false);
                onSuccess();
            }, 500);

        } catch (err) {
            console.error('Error al enviar reporte:', err);
            setError(err.message || 'Error al enviar el reporte');
            setUploading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="p-1 -ml-2 text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="text-lg font-bold text-gray-900">
                    {step === 1 && 'Selecciona una categoría'}
                    {step === 2 && 'Confirma la ubicación'}
                    {step === 3 && 'Detalles del reporte'}
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">

                {/* Step 1: Categories */}
                {step === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat)}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white active:scale-95"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                                    <cat.icon size={32} />
                                </div>
                                <span className="font-medium text-gray-800">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 relative mb-4">
                            <MapView />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[9999]">
                                <MapPin size={48} className="text-primary-600 -mt-12 drop-shadow-lg" fill="currentColor" />
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-4">
                            <p className="flex gap-2">
                                <MapPin size={16} className="shrink-0 mt-0.5" />
                                Mueve el mapa para ubicar el problema exactamente.
                            </p>
                        </div>
                        <button
                            onClick={handleLocationConfirm}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
                        >
                            Confirmar Ubicación
                        </button>
                    </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.category.color}`}>
                                <data.category.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Categoría</p>
                                <p className="font-semibold text-gray-900">{data.category.name}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                                placeholder="Describe el problema..."
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Evidencia (Opcional)</label>
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Camera size={32} className="mb-2" />
                                    <span className="text-sm">Tomar foto o subir imagen</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    Enviar Reporte
                                    <CheckCircle size={20} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
