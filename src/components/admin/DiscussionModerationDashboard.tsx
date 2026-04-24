'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  User, 
  MessageSquare, 
  Clock, 
  Eye,
  Ban,
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Types
interface ReportedContent {
  id: string;
  type: 'post' | 'comment' | 'reply';
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  reporter: {
    id: string;
    name: string;
    reason: string;
  };
  reportedAt: string;
  status: 'pending' | 'approved' | 'removed';
  severity: 'low' | 'medium' | 'high';
  reports: number;
}

interface ModerationAction {
  id: string;
  action: 'approved' | 'removed' | 'user_warned' | 'user_suspended';
  contentId: string;
  moderator: string;
  timestamp: string;
  reason?: string;
}

// Mock data
const mockReportedContent: ReportedContent[] = [
  {
    id: '1',
    type: 'post',
    content: 'This is a sample post that has been reported for inappropriate content...',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar: '/avatars/john.jpg',
      role: 'student'
    },
    reporter: {
      id: 'reporter1',
      name: 'Jane Smith',
      reason: 'Inappropriate language'
    },
    reportedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    severity: 'high',
    reports: 3
  },
  {
    id: '2',
    type: 'comment',
    content: 'This comment contains spam links and promotional content...',
    author: {
      id: 'user2',
      name: 'Mike Wilson',
      role: 'instructor'
    },
    reporter: {
      id: 'reporter2',
      name: 'Admin',
      reason: 'Spam content'
    },
    reportedAt: '2024-01-15T09:15:00Z',
    status: 'pending',
    severity: 'medium',
    reports: 2
  },
  {
    id: '3',
    type: 'reply',
    content: 'Off-topic discussion that derails the conversation...',
    author: {
      id: 'user3',
      name: 'Sarah Johnson',
      role: 'student'
    },
    reporter: {
      id: 'reporter3',
      name: 'Moderator',
      reason: 'Off-topic'
    },
    reportedAt: '2024-01-15T08:45:00Z',
    status: 'approved',
    severity: 'low',
    reports: 1
  }
];

const mockModerationActions: ModerationAction[] = [
  {
    id: '1',
    action: 'removed',
    contentId: 'post-123',
    moderator: 'Admin User',
    timestamp: '2024-01-15T11:00:00Z',
    reason: 'Violation of community guidelines'
  },
  {
    id: '2',
    action: 'user_warned',
    contentId: 'comment-456',
    moderator: 'Moderator',
    timestamp: '2024-01-15T10:30:00Z',
    reason: 'First offense warning'
  }
];

export const DiscussionModerationDashboard: React.FC = () => {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>(mockReportedContent);
  const [selectedContent, setSelectedContent] = useState<ReportedContent | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Filter content by status
  const pendingContent = reportedContent.filter(item => item.status === 'pending');
  const approvedContent = reportedContent.filter(item => item.status === 'approved');
  const removedContent = reportedContent.filter(item => item.status === 'removed');

  // Handle moderation actions
  const handleApprove = (contentId: string) => {
    setReportedContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'approved' as const }
          : item
      )
    );
  };

  const handleRemove = (contentId: string) => {
    setReportedContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'removed' as const }
          : item
      )
    );
  };

  const handleUserAction = (contentId: string, action: 'warn' | 'suspend') => {
    // In a real implementation, this would call an API
    console.log(`${action} user for content:`, contentId);
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'removed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Content item component
  const ContentItem: React.FC<{ content: ReportedContent }> = ({ content }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={content.author.avatar} />
              <AvatarFallback>{content.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{content.author.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {content.author.role}
                </Badge>
                <Badge className={`text-xs ${getSeverityColor(content.severity)}`}>
                  {content.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {content.type} • {content.reports} reports
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(content.status)}
            <span className="text-sm text-muted-foreground">
              {new Date(content.reportedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-2 line-clamp-3">{content.content}</p>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Reported by {content.reporter.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Reason: {content.reporter.reason}
            </p>
          </div>
        </div>

        {content.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApprove(content.id)}
              className="flex items-center space-x-1"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemove(content.id)}
              className="flex items-center space-x-1"
            >
              <XCircle className="h-4 w-4" />
              <span>Remove</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUserAction(content.id, 'warn')}
              className="flex items-center space-x-1"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Warn User</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUserAction(content.id, 'suspend')}
              className="flex items-center space-x-1"
            >
              <Ban className="h-4 w-4" />
              <span>Suspend User</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Stats cards
  const statsCards = [
    {
      title: 'Pending Review',
      value: pendingContent.length,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      change: '+2 from yesterday'
    },
    {
      title: 'Approved Today',
      value: approvedContent.filter(item => 
        new Date(item.reportedAt).toDateString() === new Date().toDateString()
      ).length,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      change: '+1 from yesterday'
    },
    {
      title: 'Removed Today',
      value: removedContent.filter(item => 
        new Date(item.reportedAt).toDateString() === new Date().toDateString()
      ).length,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      change: 'Same as yesterday'
    },
    {
      title: 'Total Reports',
      value: reportedContent.reduce((acc, item) => acc + item.reports, 0),
      icon: <Flag className="h-5 w-5 text-blue-500" />,
      change: '+5 from yesterday'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discussion Moderation</h2>
          <p className="text-muted-foreground">
            Manage community content and maintain quality standards
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reported Content List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and moderate community-reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending ({pendingContent.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved ({approvedContent.length})
                  </TabsTrigger>
                  <TabsTrigger value="removed">
                    Removed ({removedContent.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                  <ScrollArea className="h-[600px]">
                    {pendingContent.length > 0 ? (
                      pendingContent.map(content => (
                        <ContentItem key={content.id} content={content} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pending content to review</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="approved" className="mt-4">
                  <ScrollArea className="h-[600px]">
                    {approvedContent.length > 0 ? (
                      approvedContent.map(content => (
                        <ContentItem key={content.id} content={content} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No approved content</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="removed" className="mt-4">
                  <ScrollArea className="h-[600px]">
                    {removedContent.length > 0 ? (
                      removedContent.map(content => (
                        <ContentItem key={content.id} content={content} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No removed content</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent moderation actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {mockModerationActions.map(action => (
                    <div key={action.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        {action.action === 'removed' && <XCircle className="h-4 w-4 text-red-500" />}
                        {action.action === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {action.action === 'user_warned' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {action.action === 'user_suspended' && <Ban className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {action.action.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {action.moderator}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(action.timestamp).toLocaleString()}
                        </p>
                        {action.reason && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
