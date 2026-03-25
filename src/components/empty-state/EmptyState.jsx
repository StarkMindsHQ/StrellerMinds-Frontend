import React from "react";

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-900 rounded-2xl border border-gray-800">
      
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-green-400 text-4xl">
          {icon}
        </div>
      )}

      {/* Title */}
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-gray-400 text-sm mt-2 max-w-md">
          {description}
        </p>
      )}

      {/* CTA */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;