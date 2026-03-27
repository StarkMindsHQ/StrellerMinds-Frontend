export const CONTRIBUTOR_STATS = [
  {
    label: 'Total Earnings',
    value: '$4,250.00',
    trend: '+12.5%',
    icon: 'DollarSign',
  },
  { label: 'Tasks Completed', value: '24', trend: '+3', icon: 'CheckCircle2' },
  { label: 'Active Projects', value: '5', trend: '0', icon: 'Briefcase' },
  { label: 'Hours Tracked', value: '164h', trend: '+18h', icon: 'Clock' },
];

export const ASSIGNED_TASKS = [
  {
    id: 'task-1',
    title: 'Audit Smart Contract V2',
    project: 'Core Protocol',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-03-25',
    progress: 65,
  },
  {
    id: 'task-2',
    title: 'Implement Multi-sig Wallet',
    project: 'Governance',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2024-03-30',
    progress: 0,
  },
  {
    id: 'task-3',
    title: 'Update Documentation',
    project: 'Ecosystem',
    status: 'Review',
    priority: 'Low',
    dueDate: '2024-03-22',
    progress: 90,
  },
];

export const MILESTONES = [
  {
    id: 'm-1',
    title: 'Mainnet Alpha Launch',
    deadline: 'April 15, 2024',
    progress: 75,
    status: 'active',
  },
  {
    id: 'm-2',
    title: 'Stakeholder Beta Testing',
    deadline: 'March 10, 2024',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'm-3',
    title: 'Security Audit Completion',
    deadline: 'May 01, 2024',
    progress: 30,
    status: 'pending',
  },
];

export const ACTIVITY_TIMELINE = [
  {
    id: 'a-1',
    type: 'task_completed',
    user: 'You',
    content: 'completed Audit Smart Contract V1',
    timestamp: '2 hours ago',
  },
  {
    id: 'a-2',
    type: 'comment',
    user: 'Sarah Chen',
    content: 'left a comment on Implement Multi-sig Wallet',
    timestamp: '5 hours ago',
  },
  {
    id: 'a-3',
    type: 'project_joined',
    user: 'You',
    content: 'were added to Governance project',
    timestamp: 'Yesterday at 4:30 PM',
  },
];

export const CONTRIBUTOR_PROFILE = {
  name: 'Alex Rivera',
  role: 'Senior Smart Contract Developer',
  company: 'StarkMinds Foundation',
  location: 'Madrid, Spain',
  skills: ['Solidity', 'Rust', 'Cairo', 'Web3.js'],
  avatar: '/placeholder-avatar.jpg',
  coverage: 92,
  reputation: 4.9,
};
