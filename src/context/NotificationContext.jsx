import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [permissionGranted, setPermissionGranted] = useState(false);
    // Use a ref to track the initial load so we don't notify on the first fetch
    const isFirstLoad = useRef(true);
    // Store previous statuses to detect changes: { reportId: 'Pendiente' }
    const previousStatuses = useRef({});

    useEffect(() => {
        const requestPermission = async () => {
            const result = await LocalNotifications.requestPermissions();
            if (result.display === 'granted') {
                setPermissionGranted(true);
            }
        };

        requestPermission();
    }, []);

    useEffect(() => {
        if (!user || !permissionGranted) return;

        const q = query(
            collection(db, 'reports'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                const report = change.doc.data();
                const reportId = change.doc.id;
                const newStatus = report.status;
                const oldStatus = previousStatuses.current[reportId];

                if (change.type === 'added') {
                    // Track initial status
                    previousStatuses.current[reportId] = newStatus;
                }

                if (change.type === 'modified') {
                    // Check if status changed
                    if (oldStatus && oldStatus !== newStatus) {
                        // Trigger notification
                        await LocalNotifications.schedule({
                            notifications: [
                                {
                                    title: '¡Actualización de Reporte!',
                                    body: `Tu reporte de ${report.category?.name || 'incidencia'} ha cambiado a: ${newStatus}`,
                                    id: new Date().getTime(), // Unique ID
                                    schedule: { at: new Date(Date.now() + 100) }, // Now
                                    smallIcon: 'ic_stat_icon_config_sample', // Android resource name if custom, else default
                                    actionTypeId: '',
                                    extra: null
                                }
                            ]
                        });
                    }
                    // Update tracked status
                    previousStatuses.current[reportId] = newStatus;
                }
            });

            // After first batch, set first load to false (though docChanges handles added vs modified well)
            isFirstLoad.current = false;
        });

        return () => unsubscribe();
    }, [user, permissionGranted]);

    return (
        <NotificationContext.Provider value={{ permissionGranted }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
