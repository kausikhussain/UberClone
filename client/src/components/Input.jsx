import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '' }) => {
    return (
        <div className={`mb-4 w-full ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
        </div>
    );
};

export default Input;
