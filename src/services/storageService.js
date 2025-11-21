import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Subir imagen de reporte a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} userId - ID del usuario
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadReportImage = async (file, userId) => {
    try {
        if (!file) {
            throw new Error('No se proporcionó ningún archivo');
        }

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            throw new Error('El archivo debe ser una imagen');
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('La imagen no debe superar los 5MB');
        }

        // Crear nombre único para el archivo
        const timestamp = Date.now();
        const fileName = `reports/${userId}/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);

        // Subir archivo
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { success: true, url: downloadURL };
    } catch (error) {
        console.error('Error al subir imagen:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Subir foto de perfil a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} userId - ID del usuario
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadProfileImage = async (file, userId) => {
    try {
        if (!file) {
            throw new Error('No se proporcionó ningún archivo');
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('El archivo debe ser una imagen');
        }

        const maxSize = 2 * 1024 * 1024; // 2MB para fotos de perfil
        if (file.size > maxSize) {
            throw new Error('La imagen no debe superar los 2MB');
        }

        const fileName = `profiles/${userId}/profile.jpg`;
        const storageRef = ref(storage, fileName);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { success: true, url: downloadURL };
    } catch (error) {
        console.error('Error al subir foto de perfil:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Eliminar imagen de Firebase Storage
 * @param {string} imageUrl - URL de la imagen a eliminar
 */
export const deleteImage = async (imageUrl) => {
    try {
        // Extraer el path del storage desde la URL
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Comprimir imagen antes de subir (opcional, para optimización futura)
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo
 * @param {number} maxHeight - Alto máximo
 * @returns {Promise<Blob>} Imagen comprimida
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calcular nuevas dimensiones manteniendo aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.85 // Calidad de compresión
                );
            };

            img.onerror = (error) => {
                reject(error);
            };
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};
