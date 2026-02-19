'use client';

import React from 'react';

interface ProfileData {
  name: string;
  role: string;
  joinDate: string;
  completedTasks: number;
  activeTasks: number;
  satisfactionRate: number;
  avatar: string;
}

interface ProfileQuickViewCardProps {
  profileData: ProfileData;
}

const ProfileQuickViewCard: React.FC<ProfileQuickViewCardProps> = ({ profileData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
      
      <div className="p-6 -mt-12">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
          <p className="text-gray-600 text-sm">{profileData.role}</p>
          <p className="text-gray-500 text-xs mt-1">Member since {profileData.joinDate}</p>
          
          <div className="w-full mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{profileData.completedTasks}</p>
              <p className="text-xs text-gray-500">Tasks Done</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{profileData.activeTasks}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
          
          <div className="w-full mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Satisfaction</span>
              <span className="text-gray-900 font-medium">{profileData.satisfactionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500" 
                style={{ width: `${profileData.satisfactionRate}%` }}
              ></div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuickViewCard;