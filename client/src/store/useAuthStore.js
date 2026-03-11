import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/auth/login', { email, password });
                    localStorage.setItem('token', res.data.token);
                    connectSocket(res.data.token);
                    set({
                        user: res.data,
                        token: res.data.token,
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        loading: false,
                    });
                }
            },

            register: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/auth/register', userData);
                    localStorage.setItem('token', res.data.token);
                    connectSocket(res.data.token);
                    set({
                        user: res.data,
                        token: res.data.token,
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        loading: false,
                    });
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                disconnectSocket();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            // Optional: onRehydrateStorage
        }
    )
);

export default useAuthStore;
