import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ChevronRight, Shield, Clock, Map } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <div className="flex flex-col flex-1 bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-black text-white py-24 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-90 z-0"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Get anywhere with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">RideFlow</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto sm:mx-0">
                            Request a ride, hop in, and go. A premium real-time ride-sharing experience designed for speed and reliability.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                            {isAuthenticated ? (
                                <Link to={user?.role === 'driver' ? '/driver' : '/rider'} className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                                    Go to Dashboard <ChevronRight className="ml-2" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                                        Get started
                                    </Link>
                                    <Link to="/login" className="bg-transparent border border-gray-600 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center justify-center">
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden lg:block w-1/2 p-8">
                        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700 group">
                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                            {/* Fallback pattern since we don't have an image generator at hand right now. A generic beautiful map abstract could be used here. For now just a gradient block */}
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-inner">
                                <Map size={120} className="text-white opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why choose RideFlow?</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
                            <p className="text-gray-600">Connect with nearby drivers in seconds via our rapid WebSocket-powered matching engine.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                                <Map size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Live Tracking</h3>
                            <p className="text-gray-600">Watch your driver approach on the map in real-time. No more guessing when your ride will arrive.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Rides</h3>
                            <p className="text-gray-600">Verified drivers, encrypted communication, and in-app support ensure your journey is safe.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
