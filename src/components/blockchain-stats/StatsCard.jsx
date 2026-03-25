import React from "react";

const StatsCard = ({ label, value }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-green-400 mt-1">
        {value ?? "--"}
      </p>
    </div>
  );
};

export default StatsCard;