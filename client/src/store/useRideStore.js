import { create } from 'zustand';
import api from '../services/api';

const useRideStore = create((set, get) => ({
    currentRide: null,
    rideHistory: [],
    isSearching: false,
    driverLocation: null,

    requestRide: async (pickupLocation, destination, distance) => {
        set({ isSearching: true });
        try {
            const res = await api.post('/ride/request', {
                pickupLocation,
                destination,
                distance
            });
            set({ currentRide: res.data, isSearching: false });
            return res.data;
        } catch (error) {
            set({ isSearching: false });
            console.error('Failed to request ride:', error);
            throw error;
        }
    },

    setCurrentRide: (ride) => set({ currentRide: ride }),

    setDriverLocation: (location) => set({ driverLocation: location }),

    fetchRideHistory: async (role) => {
        try {
            const endpoint = role === 'driver' ? '/ride/driver-rides' : '/ride/rider-rides';
            const res = await api.get(endpoint);
            set({ rideHistory: res.data });
        } catch (error) {
            console.error('Failed to fetch ride history:', error);
        }
    },

    clearCurrentRide: () => set({ currentRide: null, driverLocation: null })
}));

export default useRideStore;
