import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ChevronRight, Shield, Clock, MapPin, Zap } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <div className="flex flex-col flex-1 bg-[#0a0a0a] min-h-screen text-white overflow-hidden relative">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00f2fe]/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Immersive Hero Section */}
            <div className="relative z-10 pt-24 pb-32 sm:pt-32 sm:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        
                        {/* Title and CTA block */}
                        <div className="max-w-2xl lg:w-1/2 animate-fade-in relative z-20">
                            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
                                <Zap size={16} className="text-[#00f2fe]" />
                                <span className="text-sm font-medium tracking-wide">Next Generation Ride Sharing</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                                Move with <br />
                                <span className="text-gradient-neon filter drop-shadow-lg">Absolute Freedom</span>
                            </h1>
                            
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
                                Experience seamless connectivity, ultra-fast matching, and real-time interactive mapping. RideFlow isn't just transportation; it's an elevated journey.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-5">
                                {isAuthenticated ? (
                                    <Link to={user?.role === 'driver' ? '/driver' : '/rider'} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                                        Open Dashboard <ChevronRight className="ml-2" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.4)] transform hover:-translate-y-1">
                                            Start Riding Now
                                        </Link>
                                        <Link to="/login" className="dark-glass-panel px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center border border-white/20">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Floating Visualization Asset */}
                        <div className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 animate-float perspective-[1000px]">
                            {/* Glass Stats Cards matching the 3D vibe */}
                            <div className="absolute top-10 -left-10 z-20 dark-glass-panel p-4 rounded-2xl flex items-center space-x-4 animate-[float_4s_ease-in-out_infinite_reverse]">
                                <div className="bg-green-500/20 p-2 rounded-lg">
                                    <Clock className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">ETA</p>
                                    <p className="font-bold text-lg">2 mins</p>
                                </div>
                            </div>

                            <div className="absolute bottom-20 -right-10 z-20 dark-glass-panel p-4 rounded-2xl flex items-center space-x-4 animate-[float_5s_ease-in-out_infinite]">
                                <div className="bg-[#00f2fe]/20 p-2 rounded-lg">
                                    <MapPin className="text-[#00f2fe]" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Live Matching</p>
                                    <p className="font-bold text-lg">Connected</p>
                                </div>
                            </div>

                            {/* The Generated Hero Image / Abstract Visual */}
                            <div className="relative w-full aspect-square md:aspect-auto md:h-full rounded-full lg:rounded-3xl overflow-hidden shadow-[0_20px_100px_rgba(0,242,254,0.15)] ring-1 ring-white/10 rotate-y-3 skew-y-2 group">
                                <img 
                                    src="/hero.png" 
                                    alt="RideFlow 3D Map Visualization" 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Features Grid */}
            <div className="py-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="text-4xl font-extrabold tracking-tight mb-4">Engineered for Excellence</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Our technology stack redefines what's possible in urban mobility.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="dark-glass-panel p-10 rounded-3xl hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-[#00f2fe]/20 to-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-[#00f2fe]/30 group-hover:scale-110 transition-transform">
                                <Zap size={32} className="text-[#00f2fe]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Persistent WebSockets</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Instantly connects riders with nearby drivers globally with zero latency mapping updates via specialized socket channels.</p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="dark-glass-panel p-10 rounded-3xl hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30 group-hover:scale-110 transition-transform">
                                <MapPin size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Precision Routing</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Dynamic GeoJSON integration mapping the optimal geometric paths, factoring in real-world road networks and live estimates.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="dark-glass-panel p-10 rounded-3xl hover:bg-white/5 transition-colors group">
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-green-500/30 group-hover:scale-110 transition-transform">
                                <Shield size={32} className="text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Enterprise Grade Security</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Military-grade JWT authentication mechanisms coupled with robust data encryption for total privacy enforcement.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
