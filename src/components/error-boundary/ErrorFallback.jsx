import React from 'react';

const ErrorFallback = ({ error, onRetry }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
      {/* Icon */}
      <div className="text-red-400 text-4xl mb-4">⚠️</div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>

      {/* Message */}
      <p className="text-gray-400 text-sm mt-2 max-w-md">
        An unexpected error occurred. Please try again.
      </p>

      {/* Optional error message (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs text-red-400 mt-4 bg-black/40 p-3 rounded overflow-auto max-w-full">
          {error?.message}
        </pre>
      )}

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="mt-6 px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
