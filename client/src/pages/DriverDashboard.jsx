import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRideStore from '../store/useRideStore';
import socket from '../services/socket';
import api from '../services/api';
import Map from '../components/Map';
import Button from '../components/Button';
import { ToggleRight, ToggleLeft, User, MapPin, CheckCircle, Navigation, TrendingUp, Clock, Calendar } from 'lucide-react';

const DriverDashboard = () => {
    const { user } = useAuthStore();
    const { currentRide, setCurrentRide, driverLocation, setDriverLocation } = useRideStore();

    const [isAvailable, setIsAvailable] = useState(user?.driverProfile?.isAvailable || false);
    const [incomingRequest, setIncomingRequest] = useState(null);
    const [stats, setStats] = useState({ todayEarnings: 1250, trips: 8, onlineHours: 4.5 });

    useEffect(() => {
        // Current location mock toggle (every 5 secs)
        const interval = setInterval(() => {
            if (currentRide && currentRide.status === 'DRIVER_EN_ROUTE') {
                const newCoords = [-74.006 + Math.random() * 0.01, 40.7128 + Math.random() * 0.01];
                setDriverLocation(newCoords);
                socket.emit('driver_location_update', { rideId: currentRide._id, coordinates: newCoords });
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentRide, setDriverLocation]);

    useEffect(() => {
        socket.on('ride_request', (rideData) => {
            if (!currentRide) {
                setIncomingRequest(rideData);
            }
        });

        socket.on('cancel_ride_request', ({ rideId }) => {
            if (incomingRequest && incomingRequest._id === rideId) {
                setIncomingRequest(null);
            }
        });

        return () => {
            socket.off('ride_request');
            socket.off('cancel_ride_request');
        };
    }, [currentRide, incomingRequest]);

    const toggleAvailability = async () => {
        try {
            const res = await api.patch('/driver/availability');
            setIsAvailable(res.data.isAvailable);

            if (res.data.isAvailable) {
                // Mock location for testing spatial queries
                await api.patch('/driver/location', { coordinates: [-74.006, 40.7128] });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAcceptRide = () => {
        socket.emit('driver_accept', { rideId: incomingRequest._id });
        const acceptedRide = { ...incomingRequest, status: 'ACCEPTED' };
        setCurrentRide(acceptedRide);
        setIncomingRequest(null);
    };

    const handleRejectRide = () => {
        socket.emit('driver_reject', { rideId: incomingRequest._id });
        setIncomingRequest(null);
    };

    const updateRideStatus = (status) => {
        socket.emit('ride_status_update', { rideId: currentRide._id, status });
        setCurrentRide({ ...currentRide, status });
        if (status === 'COMPLETED') {
            setTimeout(() => setCurrentRide(null), 3000); // clear after 3s
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* Left Panel - Status & Controls */}
            <div className="w-full md:w-[400px] shadow-2xl z-20 flex flex-col border-r border-gray-100 overflow-y-auto">

                {/* Header Toggle */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {isAvailable ? 'Online' : 'Offline'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isAvailable ? 'Waiting for requests...' : 'Go online to receive rides'}
                            </p>
                        </div>
                        <button
                            onClick={toggleAvailability}
                            className={`p-2 rounded-full transition-colors ${isAvailable ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                            {isAvailable ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                        </button>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="p-6 flex-1">
                    {incomingRequest && !currentRide && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-md animate-pulse-slow">
                            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-ping"></div>
                                New Ride Request
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start">
                                    <div className="bg-black text-white p-1.5 rounded-md mr-3 mt-0.5"><MapPin size={16} /></div>
                                    <div>
                                        <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Pickup</p>
                                        <p className="font-semibold text-gray-900">{incomingRequest.pickupLocation.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-600 text-white p-1.5 rounded-md mr-3 mt-0.5"><Navigation size={16} /></div>
                                    <div>
                                        <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Dropoff</p>
                                        <p className="font-semibold text-gray-900">{incomingRequest.destination.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-lg border border-blue-100">
                                <div>
                                    <p className="text-xs text-gray-500">Est. Earnings</p>
                                    <p className="text-2xl font-bold text-green-600">₹{incomingRequest.fare}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Distance</p>
                                    <p className="font-semibold">{incomingRequest.distance} km</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={handleRejectRide} variant="outline" className="flex-1 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200">Decline</Button>
                                <Button onClick={handleAcceptRide} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20">Accept</Button>
                            </div>
                        </div>
                    )}

                    {currentRide && (
                        <div className="bg-white border rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-black text-white p-4 text-center">
                                <h3 className="font-bold text-lg">{currentRide.status.replace(/_/g, ' ')}</h3>
                            </div>
                            <div className="p-5">
                                <div className="mb-6 space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="text-gray-400 mt-1 mr-3" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 line-clamp-1">{currentRide.pickupLocation.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Navigation className="text-blue-600 mt-1 mr-3" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 line-clamp-1">{currentRide.destination.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {currentRide.status === 'ACCEPTED' && (
                                        <Button onClick={() => updateRideStatus('DRIVER_EN_ROUTE')} className="w-full h-12">
                                            Head to Pickup
                                        </Button>
                                    )}
                                    {currentRide.status === 'DRIVER_EN_ROUTE' && (
                                        <Button onClick={() => updateRideStatus('STARTED')} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                                            Start Trip
                                        </Button>
                                    )}
                                    {currentRide.status === 'STARTED' && (
                                        <Button onClick={() => updateRideStatus('COMPLETED')} className="w-full h-12 bg-green-600 hover:bg-green-700">
                                            <CheckCircle size={20} className="mr-2" /> Complete & Collect ₹{currentRide.fare}
                                        </Button>
                                    )}
                                    {currentRide.status === 'COMPLETED' && (
                                        <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg font-medium">
                                            Trip Completed Successfully!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {!incomingRequest && !currentRide && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-lg">
                                <h3 className="text-gray-400 font-medium mb-1">Today's Earnings</h3>
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-bold">₹{stats.todayEarnings}</span>
                                    <span className="flex items-center text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-lg">
                                        <TrendingUp size={16} className="mr-1" /> +12%
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border rounded-2xl p-5 shadow-sm text-center">
                                    <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{stats.trips}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Trips Today</p>
                                </div>
                                <div className="bg-white border rounded-2xl p-5 shadow-sm text-center">
                                    <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600">
                                        <Clock size={20} />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{stats.onlineHours}h</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Online</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center h-48 text-center opacity-60 mt-4 border-2 border-dashed border-gray-200 rounded-2xl">
                                <MapPin size={32} className="text-gray-300 mb-3" />
                                <p className="text-lg font-semibold text-gray-500">
                                    {isAvailable ? 'Finding nearby rides...' : 'Go online to start earning'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Map Area */}
            <div className="flex-1 bg-gray-100 relative">
                <Map
                    driverLocation={driverLocation || [-74.006, 40.7128]}
                    pickup={currentRide || incomingRequest ? { coordinates: (currentRide || incomingRequest).pickupLocation.coordinates } : null}
                    destination={currentRide || incomingRequest ? { coordinates: (currentRide || incomingRequest).destination.coordinates } : null}
                />
            </div>
        </div>
    );
};

export default DriverDashboard;
