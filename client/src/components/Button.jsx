import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const baseStyle = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-black text-black hover:bg-gray-100"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
