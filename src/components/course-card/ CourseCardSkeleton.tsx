const CourseCardSkeleton = ({ layout }: { layout: 'grid' | 'list' }) => {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-2xl bg-white shadow-sm',
        layout === 'list' ? 'flex gap-4 p-4 items-center' : 'flex flex-col',
      )}
    >
      <div
        className={clsx(
          'bg-gray-200',
          layout === 'list' ? 'w-32 h-20 rounded-lg' : 'w-full h-40',
        )}
      />

      <div
        className={clsx('flex flex-col flex-1', layout === 'list' ? '' : 'p-4')}
      >
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-2 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
};
