// Task interface for contributor dashboard
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
  project: string;
}