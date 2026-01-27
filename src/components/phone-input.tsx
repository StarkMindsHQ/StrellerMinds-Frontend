'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  error,
  className,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('+234');

  return (
    <div className={cn('flex w-full', className)}>
      <div className="relative">
        <button
          type="button"
          className="flex items-center justify-between px-2 sm:px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700 text-sm whitespace-nowrap"
        >
          <span>{countryCode}</span>
          <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
      <input
        id="phone"
        name="phone"
        type="tel"
        placeholder="Enter phone number"
        className={cn(
          'flex-1 min-w-0 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 text-sm',
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-red-100',
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
