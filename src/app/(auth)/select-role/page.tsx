'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'student',
      label: 'Student',
      description: 'Learn and explore courses',
    },
    {
      id: 'instructor',
      label: 'Instructor',
      description: 'Create and teach courses',
    },
    { id: 'admin', label: 'Admin', description: 'Manage the platform' },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      // TODO: Save role selection
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-xl font-semibold mb-2 text-center">
        Select Your Role
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Choose how you want to use the platform
      </p>

      <div className="space-y-3 mb-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium">{role.label}</div>
            <div className="text-sm text-gray-600">{role.description}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
