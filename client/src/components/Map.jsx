import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibW9ja3Rva2VuIiwiYSI6Im1vY2t0b2tlbiJ9.mock';

const Map = ({ pickup, destination, driverLocation, interactive = true }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-74.006, 40.7128], // Default to NYC
            zoom: 12,
            interactive: interactive
        });
    }, [interactive]);

    // Handle markers
    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers logically here (simplified for demo)

        if (pickup) {
            new mapboxgl.Marker({ color: '#000000' })
                .setLngLat(pickup.coordinates) // [lng, lat]
                .addTo(map.current);
            map.current.flyTo({ center: pickup.coordinates, zoom: 14 });
        }

        if (destination) {
            new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat(destination.coordinates)
                .addTo(map.current);
        }

        if (driverLocation) {
            new mapboxgl.Marker({ color: '#3b82f6' }) // Blue for driver
                .setLngLat(driverLocation)
                .addTo(map.current);
        }

    }, [pickup, destination, driverLocation]);

    return (
        <div className="w-full h-full relative border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Fallback Overlay if mapbox token missing */}
            {(!import.meta.env.VITE_MAPBOX_TOKEN) && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center bg-opacity-80 z-10 backdrop-blur-sm">
                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">Map Visualization</p>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs">Mapbox Maps disabled in demo mode. Provide a valid token in .env to render real maps.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
