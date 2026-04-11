import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f2fe] tracking-tighter drop-shadow-md">
                            RideFlow
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-6">
                        <Link to="/help" className="hidden sm:block text-sm font-semibold text-gray-400 hover:text-[#00f2fe] transition-colors">
                            Help
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/history" className="hidden sm:block text-sm font-semibold text-gray-400 hover:text-[#00f2fe] transition-colors">
                                    History
                                </Link>
                                <Link to="/profile">
                                    <div className="flex items-center space-x-2 text-white font-medium bg-white/5 px-2 sm:px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shadow-sm">
                                        <User size={16} className="text-[#00f2fe]" />
                                        <span className="text-sm max-w-[80px] sm:max-w-none truncate">{user?.name?.split(' ')[0]}</span>
                                        <span className="text-[10px] sm:text-xs bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 px-2 py-0.5 rounded-full uppercase ml-1 sm:ml-2 font-bold">
                                            {user?.role}
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors flex items-center"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3 text-sm">
                                <Link to="/login" className="text-gray-400 font-medium hover:text-white transition-colors px-2 sm:px-3 py-2">
                                    Log in
                                </Link>
                                <Link to="/signup" className="bg-[#00f2fe] text-black px-4 py-2 rounded-full font-bold hover:bg-[#4facfe] transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
