// Mock data for contributor dashboard
import { Task } from '@/types/task';
import { Milestone, Activity, ProfileData, EarningsData } from '@/types/contributor';

export const mockEarningsData: EarningsData = {
  totalEarnings: 12450,
  monthlyEarnings: 3200,
  pendingPayments: 850,
  completedProjects: 12,
  activeProjects: 4,
};

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Update documentation for API v2",
    description: "Review and update API documentation with new endpoints",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-02-25",
    assignee: "You",
    project: "API Documentation"
  },
  {
    id: 2,
    title: "Fix responsive layout issues on mobile",
    description: "Address mobile responsiveness issues reported by QA team",
    status: "pending",
    priority: "medium",
    dueDate: "2024-03-01",
    assignee: "You",
    project: "Frontend Optimization"
  },
  {
    id: 3,
    title: "Implement new authentication flow",
    description: "Develop OAuth 2.0 integration for third-party logins",
    status: "completed",
    priority: "high",
    dueDate: "2024-02-20",
    assignee: "You",
    project: "Security Enhancement"
  },
  {
    id: 4,
    title: "Code review for payment module",
    description: "Review and approve pull request #482 for payment processing",
    status: "review",
    priority: "low",
    dueDate: "2024-02-28",
    assignee: "You",
    project: "Payment System"
  }
];

export const mockMilestones: Milestone[] = [
  {
    id: 1,
    title: "Q1 Feature Release",
    description: "Complete core feature development",
    progress: 75,
    targetDate: "2024-03-31",
    status: "on-track"
  },
  {
    id: 2,
    title: "Performance Optimization",
    description: "Improve application load times by 50%",
    progress: 45,
    targetDate: "2024-04-15",
    status: "delayed"
  },
  {
    id: 3,
    title: "Mobile App Launch",
    description: "Deploy native mobile application",
    progress: 90,
    targetDate: "2024-03-10",
    status: "on-track"
  }
];

export const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Submitted pull request",
    description: "PR #482: Added new authentication flow",
    timestamp: "2 hours ago",
    type: "code",
    project: "Security Enhancement"
  },
  {
    id: 2,
    title: "Completed task",
    description: "Fixed responsive layout issues on mobile",
    timestamp: "5 hours ago",
    type: "task",
    project: "Frontend Optimization"
  },
  {
    id: 3,
    title: "Commented on issue",
    description: "#345: Suggested solution for API rate limiting",
    timestamp: "Yesterday",
    type: "comment",
    project: "API Documentation"
  },
  {
    id: 4,
    title: "Created new issue",
    description: "#489: Mobile navigation menu not collapsing",
    timestamp: "2 days ago",
    type: "issue",
    project: "UI Components"
  },
  {
    id: 5,
    title: "Joined project",
    description: "Started contributing to Payment System",
    timestamp: "1 week ago",
    type: "join",
    project: "Payment System"
  }
];

export const mockProfileData: ProfileData = {
  name: "Alex Johnson",
  role: "Senior Frontend Developer",
  joinDate: "Jan 2023",
  completedTasks: 42,
  activeTasks: 3,
  satisfactionRate: 98,
  avatar: "/avatars/sarah.jpg"
};