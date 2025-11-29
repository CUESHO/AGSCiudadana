import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true })
            .on("locationfound", function (e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            })
            .on("locationerror", function (e) {
                alert("No pudimos obtener tu ubicación. Asegúrate de tener el GPS activado y dar permisos. Nota: En celulares, esto requiere HTTPS o usar localhost.");
                console.error(e);
            });
    };

    useEffect(() => {
        // Try to locate on mount
        handleLocate();
    }, [map]);

    return (
        <>
            <button
                onClick={handleLocate}
                className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-md text-primary-600 active:scale-95"
                title="Mi Ubicación"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><crosshairs cx="12" cy="12" r="10"></crosshairs><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
            </button>
            {position && (
                <Marker position={position}>
                    <Popup>¡Estás aquí!</Popup>
                </Marker>
            )}
        </>
    );
}

function MapMoveTracker({ onMapMove }) {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            if (onMapMove) {
                onMapMove({ lat: center.lat, lng: center.lng });
            }
        },
    });

    return null;
}

export default function MapView({ center = [21.8853, -102.2916], zoom = 13, onMapMove }) { // Aguascalientes coords
    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                {onMapMove && <MapMoveTracker onMapMove={onMapMove} />}
            </MapContainer>
        </div>
    );
}
