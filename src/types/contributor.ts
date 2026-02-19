export interface Milestone {
  id: number;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  status: 'on-track' | 'delayed' | 'at-risk';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'in-progress' | 'pending' | 'completed' | 'review';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
  project: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'code' | 'task' | 'comment' | 'issue' | 'join';
  project: string;
}

export interface ProfileData {
  name: string;
  role: string;
  joinDate: string;
  completedTasks: number;
  activeTasks: number;
  satisfactionRate: number;
  avatar: string;
}

export interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedProjects: number;
  activeProjects: number;
}