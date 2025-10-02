/* eslint-disable prettier/prettier */
'use client';
import React from 'react';

interface LoadingProps {
  message?: string;

  className?: string;
}

export default function Loading({
  message = 'Loading...',
  className = '',
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
    >
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
}
