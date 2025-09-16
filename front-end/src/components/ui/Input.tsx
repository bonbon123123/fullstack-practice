import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    const baseClasses =
        'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm ' +
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ' +
        'focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
    const errorClasses = error
        ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
        : '';

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`${baseClasses} ${errorClasses} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};
