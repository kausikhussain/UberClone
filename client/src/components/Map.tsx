import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
const libraries = ['places'];

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

const Map = ({ pickup, destination, driverLocation, interactive = true }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleApiKey,
        libraries,
    });

    const [mapInstance, setMapInstance] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);

    const center = useMemo(() => ({ lat: 40.7128, lng: -74.006 }), []);

    const onLoad = useCallback((map) => setMapInstance(map), []);
    const onUnmount = useCallback(() => setMapInstance(null), []);

    useEffect(() => {
        if (!pickup || !destination) {
            setDirectionsResponse(null);
            return;
        }
        const origin = { lat: pickup.coordinates[1], lng: pickup.coordinates[0] };
        const dest = { lat: destination.coordinates[1], lng: destination.coordinates[0] };

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            { origin, destination: dest, travelMode: window.google.maps.TravelMode.DRIVING },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);
                }
            }
        );
    }, [pickup?.coordinates?.[0], destination?.coordinates?.[0]]);

    useEffect(() => {
        if (!mapInstance) return;
        if (driverLocation) {
             mapInstance.panTo({ lat: driverLocation[1], lng: driverLocation[0] });
        } else if (pickup && !destination) {
             mapInstance.panTo({ lat: pickup.coordinates[1], lng: pickup.coordinates[0] });
             mapInstance.setZoom(15);
        }
    }, [driverLocation, pickup, destination, mapInstance]);

    if (loadError) return <div className="p-8 text-center text-red-500">Maps Failed to Load</div>;
    if (!isLoaded) return <div className="w-full h-full bg-[#0a0a0a] animate-pulse"></div>;

    const mkCoords = (coords) => coords ? { lat: coords[1], lng: coords[0] } : null;

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
            {(!googleApiKey) ? (
                 <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10 text-white">
                        <p>Provide a valid Google Maps API Key in .env</p>
                 </div>
            ) : (
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{ disableDefaultUI: true, zoomControl: interactive, gestureHandling: interactive ? 'auto' : 'none', styles: darkMapStyle }}
                >
                    {pickup && destination && directionsResponse && (
                        <DirectionsRenderer 
                            options={{ directions: directionsResponse, suppressMarkers: true, polylineOptions: { strokeColor: '#00f2fe', strokeWeight: 6 } }} 
                        />
                    )}
                    {pickup && <MarkerF position={mkCoords(pickup.coordinates)} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, strokeColor: '#00f2fe', strokeWeight: 3 }} />}
                    {destination && <MarkerF position={mkCoords(destination.coordinates)} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, strokeColor: '#ef4444', strokeWeight: 4 }} />}
                    {driverLocation && <MarkerF position={mkCoords(driverLocation)} icon={{ path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6, fillColor: '#00f2fe', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 1 }} zIndex={999} />}
                </GoogleMap>
            )}
        </div>
    );
};
export default React.memo(Map);
