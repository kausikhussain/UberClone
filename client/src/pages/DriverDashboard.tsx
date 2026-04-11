import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRideStore from '../store/useRideStore';
import socket from '../services/socket';
import api from '../services/api';
import Map from '../components/Map';
import Button from '../components/Button';
import { ToggleRight, ToggleLeft, MapPin, CheckCircle, Navigation, TrendingUp, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DriverDashboard = () => {
    const { user } = useAuthStore();
    const { currentRide, setCurrentRide, driverLocation, setDriverLocation } = useRideStore();

    const [isAvailable, setIsAvailable] = useState(user?.driverProfile?.isAvailable || false);
    const [incomingRequest, setIncomingRequest] = useState(null);
    const [stats, setStats] = useState({ todayEarnings: 1250, trips: 8, onlineHours: 4.5 });

    // Initial Location (Can be acquired via navigator.geolocation in production)
    useEffect(() => {
        if (!driverLocation) {
            setDriverLocation([-74.006, 40.7128]); // Default NYC
        }
    }, []);

    // Smooth Location Interpolation Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentRide && (currentRide.status === 'DRIVER_EN_ROUTE' || currentRide.status === 'STARTED')) {
                const targetLocation = currentRide.status === 'DRIVER_EN_ROUTE' 
                    ? currentRide.pickupLocation.coordinates 
                    : currentRide.destination.coordinates;

                if (driverLocation && targetLocation) {
                    const dx = targetLocation[0] - driverLocation[0];
                    const dy = targetLocation[1] - driverLocation[1];
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 0.0005) { // If far enough, move towards it smoothly
                        const step = 0.05; // 5% chunk of remaining distance per tick
                        const newCoords = [driverLocation[0] + dx * step, driverLocation[1] + dy * step];
                        setDriverLocation(newCoords);
                        socket.emit('driver_location_update', { rideId: currentRide._id, coordinates: newCoords });
                    }
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentRide, driverLocation, setDriverLocation]);

    useEffect(() => {
        socket.on('ride_request', (rideData) => {
            if (!currentRide) setIncomingRequest(rideData);
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

            if (res.data.isAvailable && driverLocation) {
                await api.patch('/driver/location', { coordinates: driverLocation });
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
            setStats(s => ({ ...s, todayEarnings: s.todayEarnings + currentRide.fare, trips: s.trips + 1 }));
            setTimeout(() => setCurrentRide(null), 3000);
        }
    };

    const panelVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0a]">
            {/* Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <Map
                    driverLocation={driverLocation}
                    pickup={currentRide || incomingRequest ? { coordinates: (currentRide || incomingRequest).pickupLocation.coordinates } : null}
                    destination={currentRide || incomingRequest ? { coordinates: (currentRide || incomingRequest).destination.coordinates } : null}
                />
            </div>

            {/* Overlaid UI Shell - Right Side for Drivers */}
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-[calc(100%-32px)] sm:w-[420px] max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar z-20 pointer-events-none">
                
                {/* Header Toggle */}
                <div className={`dark-glass-panel rounded-3xl p-6 transition-colors duration-500 mb-6 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.5)] ${isAvailable ? 'border-[#00f2fe]/30' : 'border-white/10'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center text-white">
                                <span className={`w-3 h-3 rounded-full mr-3 shadow-[0_0_10px_currentColor] transition-colors ${isAvailable ? 'bg-[#00f2fe] text-[#00f2fe]' : 'bg-gray-600 text-gray-600'}`}></span>
                                {isAvailable ? 'Online & Ready' : 'Offline'}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {isAvailable ? 'Scanning network for requests...' : 'Go online to receive rides'}
                            </p>
                        </div>
                        <button
                            onClick={toggleAvailability}
                            className={`p-2 rounded-full transition-all ${isAvailable ? 'text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]' : 'text-gray-500'}`}
                        >
                            {isAvailable ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                        </button>
                    </div>
                </div>

                {/* Dashboard Panels */}
                <div className="pointer-events-auto">
                    <AnimatePresence mode="wait">
                        {incomingRequest && !currentRide && (
                            <motion.div 
                                key="incoming" variants={panelVariants} initial="hidden" animate="visible" exit="exit"
                                className="dark-glass-panel border-[#00f2fe] rounded-3xl p-6 mb-6 shadow-[0_0_30px_rgba(0,242,254,0.2)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#00f2fe] animate-pulse"></div>
                                <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] mr-3 animate-ping shadow-[0_0_10px_#00f2fe]"></div>
                                    New Ride Request !
                                </h3>

                                <div className="space-y-4 mb-6 relative">
                                    <div className="flex items-start">
                                        <div className="mt-1 mr-4 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Pickup</p>
                                            <p className="font-semibold text-white">{incomingRequest.pickupLocation.address}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-1.5 top-5 bottom-8 w-0.5 bg-gradient-to-b from-white/50 to-[#00f2fe]/50 -ml-[5px]"></div>
                                    <div className="flex items-start pt-2">
                                        <div className="mt-1 mr-4 w-3 h-3 bg-[#00f2fe] rounded-sm shadow-[0_0_10px_#00f2fe]"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Dropoff</p>
                                            <p className="font-semibold text-white">{incomingRequest.destination.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Est. Earnings</p>
                                        <p className="text-3xl font-bold text-[#00f2fe]">₹{incomingRequest.fare}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                                        <p className="font-semibold text-white text-lg">{incomingRequest.distance} km</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={handleRejectRide} variant="outline" className="flex-1 bg-transparent hover:bg-red-500/10 text-white border-white/20 hover:border-red-500/50 hover:text-red-400 transition-colors">Decline</Button>
                                    <Button onClick={handleAcceptRide} className="flex-1 bg-[#00f2fe] text-black font-bold hover:bg-[#4facfe] shadow-[0_0_20px_rgba(0,242,254,0.3)]">Accept</Button>
                                </div>
                            </motion.div>
                        )}

                        {currentRide && (
                            <motion.div 
                                key="active" variants={panelVariants} initial="hidden" animate="visible" exit="exit"
                                className="dark-glass-panel rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]"
                            >
                                <div className="bg-gradient-to-r from-[#00f2fe]/20 to-blue-600/20 text-white p-5 text-center border-b border-white/10 backdrop-blur-md">
                                    <h3 className="font-black text-lg uppercase tracking-widest text-[#00f2fe] drop-shadow-md">{currentRide.status.replace(/_/g, ' ')}</h3>
                                </div>
                                <div className="p-6">
                                    <div className="mb-8 space-y-5">
                                        <div className="flex items-start">
                                            <MapPin className="text-white mt-1 mr-4" size={24} />
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Pickup</p>
                                                <p className="font-medium text-white text-lg">{currentRide.pickupLocation.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Navigation className="text-[#00f2fe] mt-1 mr-4 drop-shadow-[0_0_8px_#00f2fe]" size={24} />
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Dropoff</p>
                                                <p className="font-medium text-white text-lg">{currentRide.destination.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {currentRide.status === 'ACCEPTED' && (
                                                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                                    <Button onClick={() => updateRideStatus('DRIVER_EN_ROUTE')} className="w-full h-14 font-bold text-lg bg-white text-black hover:bg-gray-200">
                                                        Head to Pickup
                                                    </Button>
                                                </motion.div>
                                            )}
                                            {currentRide.status === 'DRIVER_EN_ROUTE' && (
                                                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                                    <Button onClick={() => updateRideStatus('STARTED')} className="w-full h-14 font-bold text-lg bg-[#00f2fe] hover:bg-[#4facfe] text-black shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                                                        Start Trip
                                                    </Button>
                                                </motion.div>
                                            )}
                                            {currentRide.status === 'STARTED' && (
                                                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                                    <Button onClick={() => updateRideStatus('COMPLETED')} className="w-full h-14 font-bold text-lg bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] border-none">
                                                        <CheckCircle size={22} className="mr-2" /> Collect ₹{currentRide.fare}
                                                    </Button>
                                                </motion.div>
                                            )}
                                            {currentRide.status === 'COMPLETED' && (
                                                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
                                                    <div className="text-center p-5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-pulse">
                                                        Trip Completed Successfully!
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!incomingRequest && !currentRide && (
                            <motion.div key="stats" variants={panelVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                <div className="dark-glass-panel rounded-3xl p-6 text-white overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00f2fe]/20 blur-3xl rounded-full"></div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Today's Earnings</h3>
                                    <div className="flex items-end justify-between relative z-10">
                                        <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">₹{stats.todayEarnings}</span>
                                        <span className="flex items-center text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1.5 rounded-xl border border-green-400/20">
                                            <TrendingUp size={16} className="mr-1" /> +12%
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="dark-glass-panel rounded-3xl p-6 text-center hover:bg-white/5 transition-colors">
                                        <div className="bg-[#00f2fe]/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00f2fe]/20">
                                            <CheckCircle size={24} className="text-[#00f2fe]" />
                                        </div>
                                        <p className="text-3xl font-bold text-white mb-1">{stats.trips}</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Trips Today</p>
                                    </div>
                                    <div className="dark-glass-panel rounded-3xl p-6 text-center hover:bg-white/5 transition-colors">
                                        <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                                            <Clock size={24} className="text-purple-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white mb-1">{stats.onlineHours}<span className="text-lg">h</span></p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Online</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center h-48 text-center mt-4 border border-white/10 bg-black/40 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                                    {isAvailable && <div className="absolute inset-0 bg-[#00f2fe]/5 animate-[radar_2s_ease-out_infinite]"></div>}
                                    <Zap size={36} className={`mb-4 transition-colors ${isAvailable ? 'text-[#00f2fe] animate-pulse drop-shadow-[0_0_10px_#00f2fe]' : 'text-gray-600'}`} />
                                    <p className="text-lg font-bold text-gray-400 z-10 px-6">
                                        {isAvailable ? 'Radar Online. Scanning network for nearby riders...' : 'Go online to start receiving ride requests'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
