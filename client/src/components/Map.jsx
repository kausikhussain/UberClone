import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

const Map = ({ pickup, destination, driverLocation, interactive = true }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const driverMarkerRef = useRef(null);

    // Initialize Map
    useEffect(() => {
        if (!mapboxgl.accessToken || map.current) return;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11', // Premium Dark Map Style
            center: [-74.006, 40.7128], // Default to NYC
            zoom: 13,
            interactive: interactive,
            pitch: 45 // 3D Perspective out of the box
        });

    }, [interactive]);

    // Handle Route Fetching & Drawing
    useEffect(() => {
        if (!map.current || !pickup || !destination) return;

        const getRoute = async () => {
            try {
                const query = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.coordinates[0]},${pickup.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                );
                const json = await query.json();
                if (!json.routes || json.routes.length === 0) return;

                const data = json.routes[0];
                const route = data.geometry.coordinates;
                
                const geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };

                if (map.current.getSource('route')) {
                    map.current.getSource('route').setData(geojson);
                } else {
                    map.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: geojson
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#00f2fe',
                            'line-width': 5,
                            'line-opacity': 0.8
                        }
                    });
                }

                // Fit map bounds to the route
                const coordinates = json.routes[0].geometry.coordinates;
                const bounds = new mapboxgl.LngLatBounds(
                    coordinates[0],
                    coordinates[0]
                );
                for (const coord of coordinates) {
                    bounds.extend(coord);
                }
                map.current.fitBounds(bounds, { padding: 50 });

            } catch (error) {
                console.error("Failed to fetch route", error);
            }
        };

        map.current.on('load', getRoute);
        // If map is already loaded
        if (map.current.isStyleLoaded()) {
            getRoute();
        }

    }, [pickup, destination]);

    // Handle Markers (Pickup, Dest, Driver)
    useEffect(() => {
        if (!map.current) return;

        // Note: In a robust production app, we would track marker instances and remove them before adding new ones
        if (pickup) {
            new mapboxgl.Marker({ color: '#ffffff' })
                .setLngLat(pickup.coordinates)
                .addTo(map.current);
            if (!destination) map.current.flyTo({ center: pickup.coordinates, zoom: 15 });
        }

        if (destination) {
            new mapboxgl.Marker({ color: '#ef4444' })
                .setLngLat(destination.coordinates)
                .addTo(map.current);
        }

        if (driverLocation) {
            if (!driverMarkerRef.current) {
                // Create a custom pulsing HTML element for the driver exactly as drafted
                const el = document.createElement('div');
                el.className = 'relative flex items-center justify-center w-8 h-8';
                
                // The pinging aura
                const pulse = document.createElement('div');
                pulse.className = 'absolute inline-flex w-full h-full rounded-full bg-[#00f2fe] opacity-75 animate-[radar_2s_cubic-bezier(0,0,0.2,1)_infinite]';
                
                // The vehicle solid core
                const core = document.createElement('div');
                core.className = 'relative inline-flex rounded-full w-4 h-4 bg-white shadow-[0_0_10px_#00f2fe] border-2 border-[#00f2fe]';
                
                el.appendChild(pulse);
                el.appendChild(core);

                driverMarkerRef.current = new mapboxgl.Marker(el)
                    .setLngLat(driverLocation)
                    .addTo(map.current);
            } else {
                driverMarkerRef.current.setLngLat(driverLocation);
            }
        }

    }, [pickup, destination, driverLocation]);

    return (
        <div className="w-full h-full relative overflow-hidden shadow-2xl">
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Premium Fallback Overlay if mapbox token missing */}
            {(!mapboxgl.accessToken) && (
                <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20"></div>
                    <div className="dark-glass-panel relative z-20 text-center p-10 max-w-md mx-4 rounded-3xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="text-3xl">🗺️</span>
                        </div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Map Engine Disabled</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Provide a valid <span className="text-[#00f2fe]">Mapbox Token</span> in your <code className="bg-black/50 px-2 py-1 rounded text-sm select-all">.env</code> file to enable real-time dynamic routing and 3D perspectives.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
