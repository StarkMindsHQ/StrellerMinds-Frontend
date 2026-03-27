export type CourseProgressProps = {
  totalLessons: number;
  completedLessons: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};
