'use client';

import React from 'react';
import { Milestone } from '@/types/contributor';

interface MilestoneProgressTrackerProps {
  milestones: Milestone[];
}

const MilestoneProgressTracker: React.FC<MilestoneProgressTrackerProps> = ({ milestones }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      case 'at-risk':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'delayed':
        return 'Delayed';
      case 'at-risk':
        return 'At Risk';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Milestone Progress</h2>
        <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          View Details
        </button>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="pb-4 last:pb-0 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">{milestone.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)} text-white`}>
                {getStatusText(milestone.status)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{milestone.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getStatusColor(milestone.status)}`} 
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Target: {milestone.targetDate}</span>
              <span>{milestone.progress}% complete</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneProgressTracker;