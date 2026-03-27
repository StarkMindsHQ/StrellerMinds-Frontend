import React from 'react';

const UserProfileSummaryCard = ({ user }) => {
  const {
    name = 'Anonymous User',
    email,
    avatar,
    coursesCompleted = 0,
  } = user || {};

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
      {/* Top Section */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border border-gray-700"
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-600 text-white font-semibold">
            {getInitials(name)}
          </div>
        )}

        {/* User Info */}
        <div>
          <h2 className="text-white font-semibold text-lg">{name}</h2>
          {email && <p className="text-gray-400 text-sm">{email}</p>}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-5" />

      {/* Stats Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Courses Completed</p>
          <p className="text-green-400 text-xl font-bold">{coursesCompleted}</p>
        </div>

        {/* Optional Badge */}
        <div className="bg-green-900/30 text-green-400 text-xs px-3 py-1 rounded-full">
          Learner
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummaryCard;
