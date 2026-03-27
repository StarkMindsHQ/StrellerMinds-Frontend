import React from 'react';
import clsx from 'clsx';

type CourseCardProps = {
  title: string;
  thumbnail: string;
  progress?: number; // 0 - 100
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  layout?: 'grid' | 'list';
  loading?: boolean;
  onClick?: () => void;
};

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  thumbnail,
  progress = 0,
  difficulty = 'Beginner',
  layout = 'grid',
  loading = false,
  onClick,
}) => {
  if (loading) {
    return <CourseCardSkeleton layout={layout} />;
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        layout === 'list' ? 'flex gap-4 p-4 items-center' : 'flex flex-col',
      )}
    >
      {/* Thumbnail */}
      <div
        className={clsx(
          'overflow-hidden',
          layout === 'list' ? 'w-32 h-20 rounded-lg' : 'w-full h-40',
        )}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div
        className={clsx('flex flex-col', layout === 'list' ? 'flex-1' : 'p-4')}
      >
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>

        {/* Difficulty */}
        <span
          className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full w-fit mt-2',
            difficultyColors[difficulty],
          )}
        >
          {difficulty}
        </span>

        {/* Progress */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
        </div>
      </div>
    </div>
  );
};
