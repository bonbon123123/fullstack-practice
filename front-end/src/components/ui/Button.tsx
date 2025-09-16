import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) => {
    const baseClasses =
        'font-medium rounded-lg transition-colors duration-200 focus:outline-none ' +
        'focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ' +
            'dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 ' +
            'dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-400',
        danger:
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 ' +
            'dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
