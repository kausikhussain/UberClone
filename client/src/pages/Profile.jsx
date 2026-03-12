import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Phone, Shield, Star, Award, Settings, Edit3, Camera } from 'lucide-react';
import Button from '../components/Button';

const Profile = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });

    const handleSave = (e) => {
        e.preventDefault();
        // Simulate API update
        setIsEditing(false);
        // Ideal: update user store with new details
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Settings className="mr-3 text-gray-400" /> Account Settings
                </h1>
                <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="w-auto h-10 px-4 text-sm flex items-center">
                    <Edit3 size={16} className="mr-2" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - ID Card & Stats */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="h-24 w-24 bg-gray-100 rounded-full border-4 border-white shadow-lg mx-auto flex items-center justify-center text-gray-400">
                                <User size={40} />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors shadow-md">
                                <Camera size={14} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase">{user?.role}</span>
                            {user?.role === 'driver' && (
                                <span className="flex items-center text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    <Star size={12} className="text-yellow-500 mr-1 fill-current" />
                                    {user?.driverProfile?.rating?.toFixed(1) || '5.0'}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
                            <Shield size={14} className="mr-1" /> Verified Member Since 2026
                        </p>
                    </div>

                    {user?.role === 'driver' && (
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center"><Award size={18} className="mr-2 text-yellow-400" /> Driver Status</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Vehicle</span>
                                    <span className="font-semibold">{user?.driverProfile?.vehicleType}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Plate</span>
                                    <span className="font-semibold">{user?.driverProfile?.vehicleNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">License</span>
                                    <span className="font-semibold">{user?.driverProfile?.licenseNumber}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Details Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-6 text-gray-900">Personal Information</h3>

                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black bg-gray-50 hover:bg-white transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Mail size={14} className="mr-1" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Phone size={14} className="mr-1" /> Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black bg-gray-50 hover:bg-white transition-colors"
                                        required
                                    />
                                </div>
                                <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-auto h-11 px-6">Cancel</Button>
                                    <Button type="submit" className="w-auto h-11 px-8">Save Changes</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                                        <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center">Email Address</p>
                                        <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center">Phone</p>
                                        <p className="text-lg font-semibold text-gray-900">{formData.phone}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wider">Account Security</h4>
                                    <Button variant="outline" className="w-auto h-10 text-sm">Change Password</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
