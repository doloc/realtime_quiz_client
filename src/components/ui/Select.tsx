import { FC, SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string; label: string }>;
}

export const Select: FC<SelectProps> = ({
    label,
    error,
    options,
    className,
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                {label}
                </label>
            )}
            <select
                className={clsx(
                'w-full rounded-lg border px-3 py-2 outline-none transition-colors',
                'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                error ? 'border-red-500' : 'border-gray-300',
                className
                )}
                {...props}
            >
                {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};