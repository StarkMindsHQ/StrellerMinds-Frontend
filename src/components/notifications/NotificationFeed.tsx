'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  MessageSquare,
  Trophy,
  BookOpen,
  Star,
  AlertCircle,
  Users,
  Heart,
  Share2,
  Calendar,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
  Archive,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Types
export type NotificationType =
  | 'message'
  | 'achievement'
  | 'course'
  | 'review'
  | 'alert'
  | 'social'
  | 'system'
  | 'mention'
  | 'follow'
  | 'like'
  | 'comment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    fromUser?: {
      id: string;
      name: string;
      avatar?: string;
    };
    course?: {
      id: string;
      name: string;
    };
    amount?: number;
    expiresAt?: Date;
  };
  groupId?: string; // For grouping similar notifications
}

interface NotificationGroup {
  id: string;
  type: NotificationType;
  notifications: Notification[];
  latestTimestamp: Date;
  unreadCount: number;
}

interface NotificationFeedProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  onDeleteAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
  enableRealTime?: boolean;
  showGrouping?: boolean;
  maxItems?: number;
}

// Mock data generator
const generateMockNotifications = (count: number): Notification[] => {
  const types: NotificationType[] = [
    'message',
    'achievement',
    'course',
    'review',
    'alert',
    'social',
    'system',
    'mention',
    'follow',
    'like',
    'comment',
  ];

  const users = [
    { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
    { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    { id: '3', name: 'Mike Wilson', avatar: '/avatars/mike.jpg' },
    { id: '4', name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg' },
  ];

  const courses = [
    { id: '1', name: 'Advanced TypeScript' },
    { id: '2', name: 'Blockchain Fundamentals' },
    { id: '3', name: 'DeFi Mastery' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const hoursAgo = Math.floor(Math.random() * 72);

    return {
      id: `notif-${i + 1}`,
      type,
      title: generateTitle(type, user, course),
      description: generateDescription(type, user, course),
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
      read: Math.random() > 0.3,
      priority: ['alert', 'system'].includes(type)
        ? 'high'
        : Math.random() > 0.7
          ? 'medium'
          : 'low',
      actionUrl: '#',
      actionText: generateActionText(type),
      metadata: {
        fromUser: user,
        course: course,
        ...(type === 'achievement' && {
          amount: Math.floor(Math.random() * 100) + 10,
        }),
      },
      groupId:
        type === 'like' || type === 'comment' ? `social-${user.id}` : undefined,
    };
  });
};

const generateTitle = (
  type: NotificationType,
  user: any,
  course: any,
): string => {
  const titles = {
    message: `${user.name} sent you a message`,
    achievement: '🎉 Achievement unlocked!',
    course: `New content in ${course.name}`,
    review: `${user.name} reviewed your work`,
    alert: '⚠️ Important notice',
    social: 'New social activity',
    system: 'System update',
    mention: `${user.name} mentioned you`,
    follow: `${user.name} started following you`,
    like: `${user.name} liked your post`,
    comment: `${user.name} commented on your post`,
  };
  return titles[type] || 'New notification';
};

const generateDescription = (
  type: NotificationType,
  user: any,
  course: any,
): string => {
  const descriptions = {
    message: `Check your messages from ${user.name}`,
    achievement: "You've completed another milestone in your learning journey",
    course: `${course.name} has new lessons and assignments ready`,
    review: `${user.name} left detailed feedback on your recent submission`,
    alert: 'Please review this important announcement',
    social: "There's new activity in your network",
    system: 'System maintenance scheduled for tonight',
    mention: `You were mentioned in a discussion about ${course.name}`,
    follow: `${user.name} is now following your progress`,
    like: `${user.name} liked your recent achievement`,
    comment: `${user.name} commented: "Great work on this!"`,
  };
  return descriptions[type] || 'Click to view details';
};

const generateActionText = (type: NotificationType): string => {
  const actions = {
    message: 'View Message',
    achievement: 'View Badge',
    course: 'Go to Course',
    review: 'See Review',
    alert: 'View Details',
    social: 'View Activity',
    system: 'Learn More',
    mention: 'View Mention',
    follow: 'View Profile',
    like: 'View Post',
    comment: 'Reply',
  };
  return actions[type] || 'View';
};

// Icon mapping
const NotificationIcon: Record<NotificationType, React.ReactNode> = {
  message: <MessageSquare className="h-4 w-4" />,
  achievement: <Trophy className="h-4 w-4" />,
  course: <BookOpen className="h-4 w-4" />,
  review: <Star className="h-4 w-4" />,
  alert: <AlertCircle className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
  mention: <MessageSquare className="h-4 w-4" />,
  follow: <Users className="h-4 w-4" />,
  like: <Heart className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
};

// Color mapping
const NotificationColor: Record<NotificationType, string> = {
  message: 'bg-blue-500',
  achievement: 'bg-yellow-500',
  course: 'bg-purple-500',
  review: 'bg-green-500',
  alert: 'bg-red-500',
  social: 'bg-indigo-500',
  system: 'bg-gray-500',
  mention: 'bg-blue-500',
  follow: 'bg-pink-500',
  like: 'bg-red-500',
  comment: 'bg-blue-500',
};

// Priority color
const PriorityColor: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-300',
};

// Time formatting
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

// Group similar notifications
const groupNotifications = (
  notifications: Notification[],
): NotificationGroup[] => {
  const groups: Record<string, NotificationGroup> = {};

  notifications.forEach((notif) => {
    if (notif.groupId) {
      if (!groups[notif.groupId]) {
        groups[notif.groupId] = {
          id: notif.groupId,
          type: notif.type,
          notifications: [],
          latestTimestamp: notif.timestamp,
          unreadCount: 0,
        };
      }
      groups[notif.groupId].notifications.push(notif);
      groups[notif.groupId].unreadCount += notif.read ? 0 : 1;
      groups[notif.groupId].latestTimestamp = new Date(
        Math.max(
          groups[notif.groupId].latestTimestamp.getTime(),
          notif.timestamp.getTime(),
        ),
      );
    }
  });

  return Object.values(groups).sort(
    (a, b) => b.latestTimestamp.getTime() - a.latestTimestamp.getTime(),
  );
};

// Individual notification item
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
}> = ({ notification, onMarkRead, onDelete, onClick }) => {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent/50',
        !notification.read && 'bg-primary/5 border-primary/20',
        PriorityColor[notification.priority],
      )}
      onClick={() => onClick(notification)}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-white',
            NotificationColor[notification.type],
          )}
        >
          {NotificationIcon[notification.type]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4
              className={cn(
                'text-sm font-medium line-clamp-1',
                !notification.read && 'font-semibold',
              )}
            >
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(notification.timestamp)}
              </span>
              {notification.priority === 'high' && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  High
                </Badge>
              )}
              {notification.metadata?.fromUser && (
                <div className="flex items-center gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={notification.metadata.fromUser.avatar} />
                    <AvatarFallback className="text-xs">
                      {notification.metadata.fromUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {notification.metadata.fromUser.name}
                  </span>
                </div>
              )}
            </div>

            {/* Action button */}
            {notification.actionText && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs text-primary mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(notification);
                }}
              >
                {notification.actionText} →
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleMarkAsRead}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAsRead}>
                  <Check className="h-3 w-3 mr-2" />
                  Mark as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </motion.div>
  );
};

// Grouped notification item
const NotificationGroupItem: React.FC<{
  group: NotificationGroup;
  onMarkGroupRead: (groupId: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
}> = ({ group, onMarkGroupRead, onMarkRead, onDelete, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMarkGroupAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkGroupRead(group.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border rounded-lg overflow-hidden"
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Group icon */}
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-white relative',
            NotificationColor[group.type],
          )}
        >
          {NotificationIcon[group.type]}
          {group.unreadCount > 1 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {group.unreadCount}
            </Badge>
          )}
        </div>

        {/* Group summary */}
        <div className="flex-1">
          <h4 className="text-sm font-medium">
            {group.notifications[0].title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {group.notifications.length} notifications •{' '}
            {formatTimeAgo(group.latestTimestamp)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {group.unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkGroupAsRead}>
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm">
            {isExpanded ? 'Show less' : 'Show all'}
          </Button>
        </div>
      </div>

      {/* Expanded notifications */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t bg-muted/30"
          >
            {group.notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 border-b last:border-b-0"
              >
                <NotificationItem
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onDelete={onDelete}
                  onClick={onClick}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main Notification Feed Component
export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  notifications: externalNotifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onDeleteAll,
  onNotificationClick,
  className,
  enableRealTime = true,
  showGrouping = true,
  maxItems = 50,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>(
    'all',
  );
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(enableRealTime);
  const [isLoading, setIsLoading] = useState(false);
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize notifications
  useEffect(() => {
    const initialNotifications =
      externalNotifications || generateMockNotifications(20);
    setNotifications(initialNotifications);
    setFilteredNotifications(initialNotifications);
  }, [externalNotifications]);

  // Real-time updates simulation
  useEffect(() => {
    if (isRealTimeEnabled) {
      realTimeIntervalRef.current = setInterval(() => {
        const newNotification = generateMockNotifications(1)[0];
        setNotifications((prev) =>
          [newNotification, ...prev].slice(0, maxItems),
        );
      }, 15000); // Add new notification every 15 seconds
    }

    return () => {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
      }
    };
  }, [isRealTimeEnabled, maxItems]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notif.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply tab filter
    if (activeTab === 'unread') {
      filtered = filtered.filter((notif) => !notif.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, activeTab]);

  // Handle mark as read
  const handleMarkRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
      onMarkRead?.(id);
    },
    [onMarkRead],
  );

  // Handle mark all as read
  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    onMarkAllRead?.();
  }, [onMarkAllRead]);

  // Handle delete
  const handleDelete = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      onDelete?.(id);
    },
    [onDelete],
  );

  // Handle delete all
  const handleDeleteAll = useCallback(() => {
    setNotifications([]);
    onDeleteAll?.();
  }, [onDeleteAll]);

  // Handle notification click
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      handleMarkRead(notification.id);
      onNotificationClick?.(notification);
    },
    [handleMarkRead, onNotificationClick],
  );

  // Handle mark group as read
  const handleMarkGroupRead = useCallback((groupId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.groupId === groupId ? { ...notif, read: true } : notif,
      ),
    );
  }, []);

  // Get grouped notifications
  const groupedNotifications = groupNotifications(filteredNotifications);
  const ungroupedNotifications = filteredNotifications.filter(
    (notif) => !notif.groupId,
  );
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <Card className={cn('w-full max-h-[800px]', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 min-w-5 rounded-full px-1.5 text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
            {isRealTimeEnabled ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            >
              {isRealTimeEnabled ? (
                <WifiOff className="h-4 w-4" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-3 w-3 mr-2" />
                  Mark all read
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLoading(!isLoading)}
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="px-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            {showGrouping && (
              <TabsTrigger value="groups" className="text-xs">
                Groups ({groupedNotifications.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <NotificationList
              notifications={ungroupedNotifications}
              groups={groupedNotifications}
              showGrouping={showGrouping}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onMarkGroupRead={handleMarkGroupRead}
              onClick={handleNotificationClick}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <NotificationList
              notifications={ungroupedNotifications.filter((n) => !n.read)}
              groups={groupedNotifications.filter((g) => g.unreadCount > 0)}
              showGrouping={showGrouping}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onMarkGroupRead={handleMarkGroupRead}
              onClick={handleNotificationClick}
            />
          </TabsContent>

          {showGrouping && (
            <TabsContent value="groups" className="mt-4">
              <NotificationList
                notifications={[]}
                groups={groupedNotifications}
                showGrouping={true}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                onMarkGroupRead={handleMarkGroupRead}
                onClick={handleNotificationClick}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Notification list component
const NotificationList: React.FC<{
  notifications: Notification[];
  groups: NotificationGroup[];
  showGrouping: boolean;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkGroupRead: (groupId: string) => void;
  onClick: (notification: Notification) => void;
}> = ({
  notifications,
  groups,
  showGrouping,
  onMarkRead,
  onDelete,
  onMarkGroupRead,
  onClick,
}) => {
  if (notifications.length === 0 && groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] px-6 pb-6">
      <div className="space-y-3">
        <AnimatePresence>
          {/* Show groups first */}
          {showGrouping &&
            groups.map((group) => (
              <NotificationGroupItem
                key={group.id}
                group={group}
                onMarkGroupRead={onMarkGroupRead}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
                onClick={onClick}
              />
            ))}

          {/* Show individual notifications */}
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              onClick={onClick}
            />
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

export default NotificationFeed;
