import React from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  options, 
  error, 
  className, 
  ...props 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label 
          htmlFor={props.id} 
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          'w-full px-3 py-2 border rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'text-gray-900 placeholder-gray-500',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export { Select };
export default Select;
