import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface UserInfoData {
  username: string;
  avatarUrl?: string;
  coursesCompleted?: number;
  coursesCompletedLabel?: string;
}

export interface UserInfoProps {
  /**
   * User data containing username, avatar, and stats
   */
  user: UserInfoData;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size variant for the component
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Show courses completed stat
   * @default true
   */
  showCoursesCompleted?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'gap-2 p-2',
    avatar: 'h-8 w-8',
    username: 'text-sm font-medium',
    stat: 'text-xs',
  },
  default: {
    container: 'gap-3 p-3',
    avatar: 'h-10 w-10',
    username: 'text-base font-semibold',
    stat: 'text-sm',
  },
  lg: {
    container: 'gap-4 p-4',
    avatar: 'h-14 w-14',
    username: 'text-lg font-bold',
    stat: 'text-base',
  },
};

export function UserInfo({
  user,
  className,
  size = 'default',
  showCoursesCompleted = true,
}: UserInfoProps) {
  const sizeConfig = sizeClasses[size];
  const initials = user.username
    ? user.username
        .split(/[\s_-]+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div
      className={cn(
        'flex items-center rounded-lg bg-card text-card-foreground',
        sizeConfig.container,
        className
      )}
      role="article"
      aria-label={`User profile for ${user.username || 'unknown user'}`}
    >
      {/* Avatar */}
      <Avatar className={sizeConfig.avatar}>
        {user.avatarUrl ? (
          <AvatarImage
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex flex-col min-w-0">
        <span
          className={cn(
            'text-foreground truncate',
            sizeConfig.username
          )}
        >
          {user.username || 'Unknown User'}
        </span>

        {showCoursesCompleted && (
          <span
            className={cn(
              'text-muted-foreground',
              sizeConfig.stat
            )}
          >
            {user.coursesCompleted !== undefined
              ? `${user.coursesCompleted} ${
                  user.coursesCompletedLabel ||
                  (user.coursesCompleted === 1 ? 'Course' : 'Courses')
                } Completed`
              : 'No courses completed'}
          </span>
        )}
      </div>
    </div>
  );
}

export default UserInfo;