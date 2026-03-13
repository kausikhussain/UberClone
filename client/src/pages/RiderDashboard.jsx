import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRideStore from '../store/useRideStore';
import Map from '../components/Map';
import Input from '../components/Input';
import Button from '../components/Button';
import socket from '../services/socket';
import { MapPin, Navigation, Clock, Star, Zap, Tag, Share2 } from 'lucide-react';
import useToastStore from '../store/useToastStore';

const RiderDashboard = () => {
    const { user } = useAuthStore();
    const { requestRide, currentRide, driverLocation, setDriverLocation, setCurrentRide, isSearching } = useRideStore();
    const { addToast } = useToastStore();

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submittedRating, setSubmittedRating] = useState(false);
    
    // Simulate high demand in the area randomly when opening the app
    const [isSurgePricing] = useState(Math.random() > 0.4); // 60% chance of surge
    
    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0); // Between 0 and 1 (e.g. 0.2 for 20%)

    // Mock coordinates for demo
    const mockPickupCoords = [-74.006, 40.7128];
    const mockDestCoords = [-73.985, 40.7484];

    useEffect(() => {
        socket.on('ride_accepted', (ride) => {
            setCurrentRide(ride);
        });

        socket.on('driver_location', (coords) => {
            setDriverLocation(coords);
        });

        socket.on('ride_status_changed', (ride) => {
            setCurrentRide(ride);
        });

        return () => {
            socket.off('ride_accepted');
            socket.off('driver_location');
            socket.off('ride_status_changed');
        };
    }, [setCurrentRide, setDriverLocation]);

    const handleRequestRide = async (e) => {
        e.preventDefault();
        if (!pickup || !destination) return;

        const pickupLocation = { address: pickup, coordinates: mockPickupCoords };
        const destLocation = { address: destination, coordinates: mockDestCoords };

        // Request via REST API, which will broadcast via socket. Increase price by 1.5x if surge is active
        const baseMultiplier = isSurgePricing ? 1.5 : 1;
        const discountMultiplier = 1 - discountApplied;
        const ride = await requestRide(pickupLocation, destLocation, 5.5 * baseMultiplier * discountMultiplier);

        // Wait for driver to accept
        socket.emit('request_ride', ride);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* Left Panel - Booking Flow */}
            <div className="w-full md:w-[400px] lg:w-[450px] shadow-2xl flex flex-col z-20 overflow-y-auto border-r border-gray-100">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Where to, {user?.name?.split(' ')[0]}?</h2>

                    {!currentRide ? (
                        <form onSubmit={handleRequestRide} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                </div>
                                <Input
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                    placeholder="Pickup location"
                                    className="pl-10 !mb-0 bg-gray-50 border-transparent focus:bg-white"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <div className="w-2 h-2 bg-blue-600 rounded-none border border-blue-600"></div>
                                </div>
                                <Input
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Destination"
                                    className="pl-10 mb-4 bg-gray-50 border-transparent focus:bg-white"
                                    required
                                />
                            </div>

                            {pickup && destination && !currentRide && (
                                <div className="flex space-x-2 mb-6">
                                    <div className="relative flex-1">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Tag size={16} />
                                        </div>
                                        <Input
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            placeholder="Promo Code (Optional)"
                                            className="pl-10 !mb-0 text-sm bg-gray-50 uppercase"
                                            disabled={discountApplied > 0}
                                        />
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant={discountApplied > 0 ? "outline" : "primary"}
                                        onClick={() => {
                                            if (discountApplied > 0) {
                                                setDiscountApplied(0);
                                                setPromoCode('');
                                                addToast('Promo code removed', 'info');
                                            } else if (promoCode === 'RIDE50') {
                                                setDiscountApplied(0.5);
                                                addToast('50% Off Applied!', 'success');
                                            } else if (promoCode) {
                                                addToast('Invalid Promo Code', 'error');
                                            }
                                        }}
                                        className="w-auto px-4 h-[42px] mt-1 text-sm font-semibold"
                                    >
                                        {discountApplied > 0 ? 'Remove' : 'Apply'}
                                    </Button>
                                </div>
                            )}

                            {pickup && destination && (
                                <div className={`p-4 rounded-xl border mb-6 transition-colors ${isSurgePricing ? 'bg-orange-50/50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-gray-800 flex items-center">
                                            <Navigation size={18} className="mr-2 text-blue-600" /> Estimate
                                        </span>
                                        <div className="text-right">
                                            {isSurgePricing && (
                                                <span className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full mr-2 line-through opacity-70">
                                                    ₹{Math.round(50 + (5.5 * 15))}
                                                </span>
                                            )}
                                            {discountApplied > 0 && (
                                                <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full mr-2">
                                                    -{discountApplied * 100}% OFF
                                                </span>
                                            )}
                                            <span className="text-xl font-bold">
                                                ₹{Math.round((50 + (5.5 * 15 * (isSurgePricing ? 1.5 : 1))) * (1 - discountApplied))}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 flex flex-col space-y-2 mt-2">
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-1" /> ~15 min ride • 5.5 km
                                        </div>
                                        {isSurgePricing && (
                                            <div className="flex items-center text-orange-600 font-medium text-xs bg-orange-100/50 p-1.5 rounded-md">
                                                <Zap size={12} className="mr-1 fill-current" /> High demand. Fares are slightly higher to ensure reliability.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button type="submit" disabled={isSearching || !pickup || !destination} className="h-14 text-lg mt-4 shadow-lg">
                                {isSearching ? 'Connecting to drivers...' : 'Confirm Ride'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                                <h3 className="text-xl font-bold text-blue-900 mb-1">{currentRide.status.replace(/_/g, ' ')}</h3>
                                <p className="text-blue-700 font-medium">Driver {currentRide.driverId?.userId?.name || 'assigned'}</p>
                                <div className="mt-4 pt-4 border-t border-blue-200/50 flex justify-between">
                                    <span className="text-gray-600 font-medium">Fare</span>
                                    <span className="font-bold text-xl">₹{currentRide.fare}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider mb-0.5">Live Tracking</p>
                                    <p className="text-sm font-medium text-blue-900">Share your ride status with friends</p>
                                </div>
                                <Button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`https://rideflow.app/track/${currentRide._id}`);
                                        addToast('Tracking link copied to clipboard!', 'success');
                                    }}
                                    variant="outline"
                                    className="w-auto h-9 px-3 bg-white hover:bg-blue-50 text-blue-700 border-blue-200 shadow-sm text-sm"
                                >
                                    <Share2 size={14} className="mr-1.5" /> Share
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <MapPin className="text-black mt-1 mr-3" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500">Pickup</p>
                                        <p className="font-medium">{currentRide.pickupLocation.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Navigation className="text-blue-600 mt-1 mr-3" size={20} />
                                    <div>
                                        <p className="text-sm text-gray-500">Destination</p>
                                        <p className="font-medium">{currentRide.destination.address}</p>
                                    </div>
                                </div>
                            </div>

                            {currentRide.status === 'COMPLETED' && (
                                <div className="mt-8">
                                    {!submittedRating ? (
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center mb-6">
                                            <h4 className="font-bold text-gray-900 mb-2">Rate your driver</h4>
                                            <p className="text-sm text-gray-500 mb-4">How was your trip with {currentRide.driverId?.userId?.name}?</p>
                                            <div className="flex justify-center space-x-2 mb-6">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            size={32}
                                                            className={`${
                                                                (hoverRating || rating) >= star
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-300'
                                                            } transition-colors duration-200`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <Button 
                                                onClick={() => setSubmittedRating(true)} 
                                                disabled={!rating}
                                                className="w-full"
                                            >
                                                Submit Feedback
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium mb-6">
                                            Thank you for your feedback! ⭐
                                        </div>
                                    )}

                                    <Button onClick={() => {
                                        setCurrentRide(null);
                                        setRating(0);
                                        setSubmittedRating(false);
                                        setPickup('');
                                        setDestination('');
                                    }} className="w-full bg-gray-900">
                                        Book Another Ride
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Map Area */}
            <div className="flex-1 bg-gray-100 relative">
                <Map
                    pickup={currentRide ? { coordinates: currentRide.pickupLocation.coordinates } : pickup ? { coordinates: mockPickupCoords } : null}
                    destination={currentRide ? { coordinates: currentRide.destination.coordinates } : destination ? { coordinates: mockDestCoords } : null}
                    driverLocation={driverLocation}
                />
            </div>
        </div>
    );
};

export default RiderDashboard;
