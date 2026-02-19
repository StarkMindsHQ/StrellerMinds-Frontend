'use client';

import React from 'react';

const EarningsSummaryCard = ({ earningsData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Earnings Summary</h2>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Monthly</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">${earningsData.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-500">Monthly</p>
            <p className="font-semibold text-gray-900">${earningsData.monthlyEarnings.toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="font-semibold text-gray-900">${earningsData.pendingPayments.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-500">Active Projects</p>
            <p className="font-semibold text-gray-900">{earningsData.activeProjects}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-semibold text-gray-900">{earningsData.completedProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummaryCard;