import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 tracking-tighter">
                            RideFlow
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/help" className="text-sm font-semibold text-gray-500 hover:text-black">
                            Help
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/history" className="text-sm font-semibold text-gray-500 hover:text-black">
                                    History
                                </Link>
                                <Link to="/profile">
                                    <div className="flex items-center space-x-2 text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <User size={18} />
                                        <span>{user?.name}</span>
                                        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full uppercase ml-2">
                                            {user?.role}
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="space-x-3">
                                <Link to="/login" className="text-gray-600 font-medium hover:text-black transition-colors px-3 py-2">
                                    Log in
                                </Link>
                                <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-sm">
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
