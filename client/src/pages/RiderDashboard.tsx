import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRideStore from '../store/useRideStore';
import Map from '../components/Map';
import Input from '../components/Input';
import Button from '../components/Button';
import socket from '../services/socket';
import { MapPin, Navigation, Clock, Star, Zap, Tag, Share2 } from 'lucide-react';
import useToastStore from '../store/useToastStore';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';

const libraries = ['places'];
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

const RiderDashboard = () => {
    const { user } = useAuthStore();
    const { requestRide, currentRide, driverLocation, setDriverLocation, setCurrentRide, isSearching } = useRideStore();
    const { addToast } = useToastStore();
    
    // Maps Script loading
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleApiKey,
        libraries,
    });

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

    const pickupRef = useRef(null);
    const destRef = useRef(null);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submittedRating, setSubmittedRating] = useState(false);
    
    const [isSurgePricing] = useState(Math.random() > 0.4); 
    
    const [promoCode, setPromoCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0);

    useEffect(() => {
        socket.on('ride_accepted', (ride) => setCurrentRide(ride));
        socket.on('driver_location', (coords) => setDriverLocation(coords));
        socket.on('ride_status_changed', (ride) => setCurrentRide(ride));
        return () => {
            socket.off('ride_accepted');
            socket.off('driver_location');
            socket.off('ride_status_changed');
        };
    }, [setCurrentRide, setDriverLocation]);

    const onPickupSelected = () => {
        if (!pickupRef.current) return;
        const place = pickupRef.current.getPlace();
        if (place.geometry) {
            setPickupCoords([place.geometry.location.lng(), place.geometry.location.lat()]);
            setPickup(place.formatted_address || place.name);
        }
    };

    const onDestSelected = () => {
        if (!destRef.current) return;
        const place = destRef.current.getPlace();
        if (place.geometry) {
            setDestCoords([place.geometry.location.lng(), place.geometry.location.lat()]);
            setDestination(place.formatted_address || place.name);
        }
    };

    const handleRequestRide = async (e) => {
        e.preventDefault();
        if (!pickup || !destination || !pickupCoords || !destCoords) {
             addToast('Please select valid locations from the dropdown list.', 'error');
             return;
        }

        const pickupLocation = { address: pickup, coordinates: pickupCoords };
        const destLocation = { address: destination, coordinates: destCoords };

        // Approx distance using basic pythagorean for demo scaling
        const dx = pickupCoords[0] - destCoords[0];
        const dy = pickupCoords[1] - destCoords[1];
        const distanceKm = (Math.sqrt(dx * dx + dy * dy) * 111).toFixed(1);

        const baseMultiplier = isSurgePricing ? 1.5 : 1;
        const discountMultiplier = 1 - discountApplied;
        const estimatedFare = Math.max(50, 50 + (parseFloat(distanceKm) * 15 * baseMultiplier * discountMultiplier));

        const ride = await requestRide(pickupLocation, destLocation, distanceKm);
        ride.fare = Math.round(estimatedFare); 

        socket.emit('request_ride', ride);
    };

    const panelVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0a]">
            <div className="absolute inset-0 z-0">
                <Map
                    pickup={currentRide ? { coordinates: currentRide.pickupLocation.coordinates } : pickupCoords ? { coordinates: pickupCoords } : null}
                    destination={currentRide ? { coordinates: currentRide.destination.coordinates } : destCoords ? { coordinates: destCoords } : null}
                    driverLocation={driverLocation}
                />
            </div>

            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-[calc(100%-32px)] sm:w-[420px] max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar z-20 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentRide ? "active-ride" : "booking"}
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="dark-glass-panel rounded-3xl p-6 sm:p-8 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        {!currentRide ? (
                            <>
                                <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">
                                    Where to, <span className="text-gradient-neon">{user?.name?.split(' ')[0]}</span>?
                                </h2>
                                <form onSubmit={handleRequestRide} className="space-y-4">
                                    {isLoaded ? (
                                        <>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors z-10 pointer-events-none">
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                                </div>
                                                <Autocomplete onLoad={ref => pickupRef.current = ref} onPlaceChanged={onPickupSelected}>
                                                    <Input
                                                        value={pickup}
                                                        onChange={(e) => setPickup(e.target.value)}
                                                        placeholder="Pickup location"
                                                        className="pl-10 !mb-0 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10"
                                                        required
                                                    />
                                                </Autocomplete>
                                            </div>
                                            
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00f2fe] transition-colors z-10 pointer-events-none">
                                                    <div className="w-2.5 h-2.5 bg-[#00f2fe] rounded-sm shadow-[0_0_10px_#00f2fe]"></div>
                                                </div>
                                                <Autocomplete onLoad={ref => destRef.current = ref} onPlaceChanged={onDestSelected}>
                                                    <Input
                                                        value={destination}
                                                        onChange={(e) => setDestination(e.target.value)}
                                                        placeholder="Destination address"
                                                        className="pl-10 mb-4 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:bg-white/10"
                                                        required
                                                    />
                                                </Autocomplete>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-24 w-full flex items-center justify-center text-gray-400 animate-pulse">
                                            Loading Maps API...
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {pickupCoords && destCoords && !currentRide && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex space-x-3 mb-6 mt-2">
                                                    <div className="relative flex-1">
                                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"><Tag size={16} /></div>
                                                        <Input
                                                            value={promoCode}
                                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                            placeholder="Promo Code"
                                                            className="pl-10 !mb-0 text-sm uppercase bg-white/5 border-white/10 text-white"
                                                            disabled={discountApplied > 0}
                                                        />
                                                    </div>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (discountApplied > 0) {
                                                                setDiscountApplied(0); setPromoCode(''); addToast('Promo code removed', 'info');
                                                            } else if (promoCode === 'RIDE50') {
                                                                setDiscountApplied(0.5); addToast('50% Off Applied!', 'success');
                                                            } else if (promoCode) { addToast('Invalid Promo Code', 'error'); }
                                                        }}
                                                        className={`w-auto px-5 h-[50px] mt-[1px] text-sm font-semibold border-white/20 hover:bg-white/10 ${discountApplied > 0 ? 'text-[#00f2fe] border-[#00f2fe]/50 bg-[#00f2fe]/10' : 'text-white'}`}
                                                    >
                                                        {discountApplied > 0 ? 'Remove' : 'Apply'}
                                                    </Button>
                                                </div>

                                                <div className={`p-5 rounded-2xl border transition-all ${isSurgePricing ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-semibold text-white flex items-center">
                                                            <Navigation size={18} className="mr-2 text-[#00f2fe]" /> Estimate
                                                        </span>
                                                        <div className="text-right flex items-center space-x-2">
                                                            {isSurgePricing && <span className="text-xs text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-400/30 line-through opacity-70">Surge Applied</span>}
                                                            {discountApplied > 0 && <span className="text-xs text-green-400 font-bold bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">-{discountApplied * 100}%</span>}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-400 flex flex-col space-y-3">
                                                        <div className="flex items-center font-medium">
                                                            <Clock size={14} className="mr-2 text-gray-300" /> Advanced Fare Calculation Included
                                                        </div>
                                                        {isSurgePricing && (
                                                            <div className="flex items-start text-orange-400 font-medium text-xs bg-orange-500/10 p-2.5 rounded-lg border border-orange-500/20">
                                                                <Zap size={14} className="mr-1.5 mt-0.5 flex-shrink-0" />
                                                                Demand is off the charts. Fares are higher to ensure a driver gets to you.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button 
                                        type="submit" 
                                        disabled={isSearching || !pickupCoords || !destCoords} 
                                        className="w-full h-14 text-lg font-bold mt-6 bg-[#00f2fe] hover:bg-[#4facfe] text-black shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] border-none disabled:opacity-50 disabled:shadow-none transition-all"
                                    >
                                        {isSearching ? 'Pinging Radar...' : 'Confirm Ride'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-[#00f2fe]/20 to-blue-600/20 rounded-2xl border border-[#00f2fe]/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] relative overflow-hidden">
                                     {currentRide.status === 'ACCEPTED' && <div className="absolute top-0 left-0 w-full h-1 bg-[#00f2fe] animate-[radar_2s_linear_infinite]"></div>}
                                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-wider">{currentRide.status.replace(/_/g, ' ')}</h3>
                                    <p className="text-[#00f2fe] font-medium text-lg">Driver: {currentRide.driverId?.userId?.name || 'Assigned'}</p>
                                    <div className="mt-5 pt-5 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-gray-300 font-medium">Final Fare</span>
                                        <span className="font-bold text-3xl text-white">₹{currentRide.fare}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div>
                                        <p className="text-xs text-[#00f2fe] font-bold uppercase tracking-widest mb-1">Live Tracking</p>
                                        <p className="text-sm font-medium text-gray-300">Share your journey safely</p>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(`https://rideflow.app/track/${currentRide._id}`);
                                            addToast('Tracking link copied!', 'success');
                                        }}
                                        variant="outline"
                                        className="w-auto h-[38px] px-4 bg-transparent hover:bg-white/10 text-white border-white/20 text-sm"
                                    >
                                        <Share2 size={16} className="mr-2" /> Share
                                    </Button>
                                </div>

                                <div className="space-y-5 p-4">
                                    <div className="flex items-start">
                                        <div className="mt-1 mr-4 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Pickup</p>
                                            <p className="font-medium text-white">{currentRide.pickupLocation.address}</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-[5px]">
                                         <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/50 to-[#00f2fe]/50 -ml-[5px] my-[-10px]"></div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="mt-1 mr-4 w-3 h-3 bg-[#00f2fe] rounded-sm shadow-[0_0_10px_#00f2fe]"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Destination</p>
                                            <p className="font-medium text-white">{currentRide.destination.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {currentRide.status === 'COMPLETED' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8"
                                        >
                                            {!submittedRating ? (
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center mb-6">
                                                    <h4 className="font-bold text-white text-xl mb-2">Rate your driver</h4>
                                                    <p className="text-sm text-gray-400 mb-6">How was your premium trip with {currentRide.driverId?.userId?.name || 'your driver'}?</p>
                                                    <div className="flex justify-center space-x-3 mb-8">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setRating(star)}
                                                                onMouseEnter={() => setHoverRating(star)}
                                                                onMouseLeave={() => setHoverRating(0)}
                                                                className="focus:outline-none transition-transform hover:scale-125"
                                                            >
                                                                <Star
                                                                    size={36}
                                                                    className={`${
                                                                        (hoverRating || rating) >= star
                                                                            ? 'text-[#00f2fe] fill-current drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]'
                                                                            : 'text-gray-600'
                                                                    } transition-all duration-300`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <Button 
                                                        onClick={() => setSubmittedRating(true)} 
                                                        disabled={!rating}
                                                        className="w-full bg-[#00f2fe] text-black hover:bg-[#4facfe] disabled:bg-gray-700 disabled:text-gray-500 font-bold"
                                                    >
                                                        Submit Feedback
                                                    </Button>
                                                </div>
                                            ) : (
                                                <motion.div 
                                                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                                    className="bg-green-500/20 border border-green-500/30 text-green-400 p-5 rounded-2xl text-center font-bold mb-6 text-lg tracking-wide shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                                                >
                                                    Feedback Recorded! ⭐
                                                </motion.div>
                                            )}

                                            <Button onClick={() => {
                                                setCurrentRide(null);
                                                setRating(0);
                                                setSubmittedRating(false);
                                                setPickup('');
                                                setDestination('');
                                                setPickupCoords(null);
                                                setDestCoords(null);
                                            }} className="w-full h-14 bg-white hover:bg-gray-200 text-black font-bold text-lg">
                                                Book Another Ride
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RiderDashboard;
