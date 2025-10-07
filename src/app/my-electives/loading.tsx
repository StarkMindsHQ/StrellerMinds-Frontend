import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

export default function MyElectivesLoading() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Electives
              </h1>
              <p className="text-gray-600">
                Manage your enrolled elective courses
              </p>
            </div>
            <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your enrolled courses...</p>
        </div>
      </div>
    </MainLayout>
  );
}
