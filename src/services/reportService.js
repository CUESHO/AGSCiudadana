import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
    GeoPoint,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Crear un nuevo reporte en Firestore
 * @param {Object} reportData - Datos del reporte
 * @returns {Promise<Object>} Resultado de la operación
 */
export const createReport = async (reportData) => {
    try {
        const { userId, userName, category, location, address, description, imageUrl } = reportData;

        // Validar datos requeridos
        if (!userId || !category || !location || !description) {
            throw new Error('Faltan datos requeridos');
        }

        // Crear GeoPoint para Firestore
        const geoPoint = new GeoPoint(location.lat, location.lng);

        // Crear documento de reporte
        const reportDoc = {
            userId,
            userName: userName || 'Usuario',
            category: {
                id: category.id,
                name: category.name
            },
            location: geoPoint,
            locationDetails: {
                lat: location.lat,
                lng: location.lng,
                address: address || ''
            },
            description,
            imageUrls: imageUrl ? [imageUrl] : [],
            status: 'Pendiente',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, 'reports'), reportDoc);

        return {
            success: true,
            reportId: docRef.id,
            message: 'Reporte creado exitosamente'
        };
    } catch (error) {
        console.error('Error al crear reporte:', error);
        return {
            success: false,
            error: error.message || 'Error al crear el reporte'
        };
    }
};

/**
 * Obtener reportes de un usuario específico
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de reportes
 */
export const getReportsByUser = async (userId) => {
    try {
        console.log('Obteniendo reportes para usuario:', userId);
        const q = query(
            collection(db, 'reports'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Reportes encontrados:', querySnapshot.size);

        const reports = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reports.push({
                id: doc.id,
                ...data,
                // Convertir Timestamp a fecha legible
                date: data.createdAt?.toDate().toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
            });
        });

        return { success: true, reports };
    } catch (error) {
        console.error('Error al obtener reportes:', error);

        // Si el error es por falta de índice, mostrar mensaje claro
        if (error.message.includes('requires an index')) {
            console.warn('⚠️ FALTA ÍNDICE EN FIRESTORE ⚠️');
            console.warn('Abre la consola del navegador (F12) para ver el link de creación del índice.');
        }

        return { success: false, error: error.message, reports: [] };
    }
};

/**
 * Obtener todos los reportes (para administradores o mapa general)
 * @param {number} limit - Límite de reportes a obtener
 * @returns {Promise<Array>} Lista de reportes
 */
export const getAllReports = async (limit = 50) => {
    try {
        const q = query(
            collection(db, 'reports'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reports = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reports.push({
                id: doc.id,
                ...data,
                date: data.createdAt?.toDate().toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }),
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate()
            });
        });

        return { success: true, reports: reports.slice(0, limit) };
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        return { success: false, error: error.message, reports: [] };
    }
};

/**
 * Actualizar el estado de un reporte
 * @param {string} reportId - ID del reporte
 * @param {string} newStatus - Nuevo estado ('Pendiente', 'En Proceso', 'Resuelto')
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateReportStatus = async (reportId, newStatus) => {
    try {
        const validStatuses = ['Pendiente', 'En Proceso', 'Resuelto'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Estado inválido');
        }

        const reportRef = doc(db, 'reports', reportId);
        const updateData = {
            status: newStatus,
            updatedAt: Timestamp.now()
        };

        // Si se resuelve, agregar fecha de resolución para limpieza automática y marcar como no leído
        if (newStatus === 'Resuelto') {
            updateData.resolvedAt = Timestamp.now();
            updateData.readByUser = false;
        }

        await updateDoc(reportRef, updateData);

        return {
            success: true,
            message: 'Estado actualizado exitosamente'
        };
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Marcar reporte como leído por el usuario
 * @param {string} reportId - ID del reporte
 */
export const markReportAsRead = async (reportId) => {
    try {
        const reportRef = doc(db, 'reports', reportId);
        await updateDoc(reportRef, {
            readByUser: true
        });
        return { success: true };
    } catch (error) {
        console.error('Error al marcar como leído:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Limpiar reportes resueltos antiguos (simulación de Cloud Function)
 * Elimina reportes resueltos hace más de 2 horas
 */
export const cleanupOldReports = async () => {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const q = query(
            collection(db, 'reports'),
            where('status', '==', 'Resuelto'),
            where('resolvedAt', '<', Timestamp.fromDate(twoHoursAgo))
        );

        const snapshot = await getDocs(q);
        let deletedCount = 0;

        const deletePromises = snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();

            // 1. Eliminar imágenes de Storage si existen
            if (data.imageUrls && data.imageUrls.length > 0) {
                // Importar dinámicamente para evitar dependencias circulares si fuera necesario
                // En este caso asumimos que el usuario implementará la limpieza de storage aparte o aquí mismo
                // Por simplicidad en esta iteración, solo borramos el documento
            }

            // 2. Eliminar documento
            await deleteDoc(doc(db, 'reports', docSnapshot.id));
            deletedCount++;
        });

        await Promise.all(deletePromises);

        if (deletedCount > 0) {
            console.log(`Limpieza automática: ${deletedCount} reportes eliminados.`);
        }

        return { success: true, deletedCount };
    } catch (error) {
        console.error('Error en limpieza automática:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Obtener estadísticas de reportes de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Estadísticas
 */
export const getUserReportStats = async (userId) => {
    try {
        const result = await getReportsByUser(userId);

        if (!result.success) {
            throw new Error(result.error);
        }

        const reports = result.reports;
        const total = reports.length;
        const resueltos = reports.filter(r => r.status === 'Resuelto').length;
        const enProceso = reports.filter(r => r.status === 'En Proceso').length;
        const pendientes = reports.filter(r => r.status === 'Pendiente').length;

        return {
            success: true,
            stats: {
                total,
                resueltos,
                enProceso,
                pendientes,
                activos: enProceso + pendientes
            }
        };
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return {
            success: false,
            stats: { total: 0, resueltos: 0, enProceso: 0, pendientes: 0, activos: 0 }
        };
    }
};

/**
 * Eliminar un reporte (solo el propietario puede eliminarlo)
 * @param {string} reportId - ID del reporte
 * @param {string} userId - ID del usuario que intenta eliminar
 * @returns {Promise<Object>} Resultado de la operación
 */
export const deleteReport = async (reportId, userId) => {
    try {
        // Primero verificar que el reporte pertenece al usuario
        const reportRef = doc(db, 'reports', reportId);
        const reportSnap = await getDocs(query(collection(db, 'reports'), where('__name__', '==', reportId)));

        if (reportSnap.empty) {
            throw new Error('Reporte no encontrado');
        }

        const reportData = reportSnap.docs[0].data();

        if (reportData.userId !== userId) {
            throw new Error('No tienes permiso para eliminar este reporte');
        }

        // Eliminar el reporte
        await deleteDoc(reportRef);

        return {
            success: true,
            message: 'Reporte eliminado exitosamente'
        };
    } catch (error) {
        console.error('Error al eliminar reporte:', error);
        return {
            success: false,
            error: error.message || 'Error al eliminar el reporte'
        };
    }
};

/**
 * Limpiar reportes resueltos con más de 48 horas
 * @returns {Promise<Object>} Resultado de la operación
 */
export const cleanupOldResolvedReports = async () => {
    try {
        const fortyEightHoursAgo = new Date();
        fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

        const q = query(
            collection(db, 'reports'),
            where('status', '==', 'Resuelto'),
            where('updatedAt', '<', Timestamp.fromDate(fortyEightHoursAgo))
        );

        const querySnapshot = await getDocs(q);
        const deletePromises = [];

        querySnapshot.forEach((docSnap) => {
            deletePromises.push(deleteDoc(doc(db, 'reports', docSnap.id)));
        });

        await Promise.all(deletePromises);

        return {
            success: true,
            deletedCount: querySnapshot.size,
            message: `Se eliminaron ${querySnapshot.size} reportes resueltos antiguos`
        };
    } catch (error) {
        console.error('Error al limpiar reportes antiguos:', error);
        return {
            success: false,
            error: error.message || 'Error al limpiar reportes'
        };
    }
};

