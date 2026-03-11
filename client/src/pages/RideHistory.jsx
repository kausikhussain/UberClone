import React, { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useRideStore from '../store/useRideStore';
import { Calendar, MapPin, Navigation, Tag } from 'lucide-react';

const RideHistory = () => {
    const { user } = useAuthStore();
    const { rideHistory, fetchRideHistory } = useRideStore();

    useEffect(() => {
        if (user?.role) {
            fetchRideHistory(user.role);
        }
    }, [user, fetchRideHistory]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
                {user?.role === 'driver' ? 'Earnings & Trip History' : 'Your Past Rides'}
            </h1>

            {rideHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium text-lg">No past rides found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {rideHistory.map((ride) => (
                        <div key={ride._id} className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
                                        {ride.status}
                                    </div>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        {new Date(ride.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">₹{ride.fare}</p>
                                    <p className="text-sm text-gray-500 flex items-center justify-end">
                                        <Tag size={12} className="mr-1" /> {ride.distance} km
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-1.5 rounded-full mr-3 mt-0.5"><MapPin size={14} className="text-gray-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Pickup</p>
                                        <p className="text-gray-800">{ride.pickupLocation.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-1.5 rounded-full mr-3 mt-0.5"><Navigation size={14} className="text-blue-600" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Dropoff</p>
                                        <p className="text-gray-800">{ride.destination.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RideHistory;
