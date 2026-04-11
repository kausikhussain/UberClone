import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'rider',
        vehicleType: 'Sedan', vehicleNumber: '', licenseNumber: ''
    });

    const { register, loading, error, isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'driver') navigate('/driver');
            else navigate('/rider');
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (payload.role === 'driver') {
            payload.driverDetails = {
                vehicleType: formData.vehicleType,
                vehicleNumber: formData.vehicleNumber,
                licenseNumber: formData.licenseNumber
            };
        }
        await register(payload);
    };

    return (
        <div className="flex flex-col items-center py-12 bg-gray-50 min-h-[calc(100vh-64px)] px-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join RideFlow to start your journey</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" required />
                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
                        <div className="flex space-x-4">
                            <label className={`flex-1 flex justify-center items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'rider' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                <input type="radio" name="role" value="rider" checked={formData.role === 'rider'} onChange={handleChange} className="hidden" />
                                <span className="font-semibold">Ride</span>
                            </label>
                            <label className={`flex-1 flex justify-center items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'driver' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                <input type="radio" name="role" value="driver" checked={formData.role === 'driver'} onChange={handleChange} className="hidden" />
                                <span className="font-semibold">Drive</span>
                            </label>
                        </div>
                    </div>

                    {formData.role === 'driver' && (
                        <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-800">Vehicle Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black">
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                </select>
                            </div>
                            <Input label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="XYZ-1234" required />
                            <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="DL-123456789" required />
                        </div>
                    )}

                    <div className="mt-8">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
