/**
 * Mock data for instructor interface (no API integration).
 */

export interface MockCourse {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  enrolledCount: number;
  modulesCount: number;
  lastUpdated: string;
}

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
  lastActivity: string;
}

export interface MockApplication {
  id: string;
  applicantName: string;
  email: string;
  course: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: '1',
    title: 'Introduction to Blockchain',
    slug: 'intro-blockchain',
    status: 'published',
    enrolledCount: 124,
    modulesCount: 8,
    lastUpdated: '2025-02-18',
  },
  {
    id: '2',
    title: 'Smart Contracts & Solidity',
    slug: 'smart-contracts-solidity',
    status: 'published',
    enrolledCount: 89,
    modulesCount: 12,
    lastUpdated: '2025-02-15',
  },
  {
    id: '3',
    title: 'DeFi Fundamentals',
    slug: 'defi-fundamentals',
    status: 'draft',
    enrolledCount: 0,
    modulesCount: 10,
    lastUpdated: '2025-02-20',
  },
  {
    id: '4',
    title: 'Web3 Development',
    slug: 'web3-development',
    status: 'published',
    enrolledCount: 56,
    modulesCount: 6,
    lastUpdated: '2025-02-10',
  },
];

export const MOCK_STUDENTS: MockStudent[] = [
  { id: 's1', name: 'Alex Johnson', email: 'alex.j@example.com', course: 'Introduction to Blockchain', progress: 100, status: 'completed', lastActivity: '2025-02-18' },
  { id: 's2', name: 'Sam Chen', email: 'sam.chen@example.com', course: 'Smart Contracts & Solidity', progress: 75, status: 'active', lastActivity: '2025-02-20' },
  { id: 's3', name: 'Jordan Lee', email: 'jordan.lee@example.com', course: 'Introduction to Blockchain', progress: 45, status: 'active', lastActivity: '2025-02-19' },
  { id: 's4', name: 'Morgan Taylor', email: 'morgan.t@example.com', course: 'Web3 Development', progress: 20, status: 'active', lastActivity: '2025-02-17' },
  { id: 's5', name: 'Riley Davis', email: 'riley.d@example.com', course: 'Smart Contracts & Solidity', progress: 100, status: 'completed', lastActivity: '2025-02-15' },
  { id: 's6', name: 'Casey Brown', email: 'casey.b@example.com', course: 'Introduction to Blockchain', progress: 60, status: 'active', lastActivity: '2025-02-20' },
  { id: 's7', name: 'Quinn Wilson', email: 'quinn.w@example.com', course: 'Web3 Development', progress: 0, status: 'dropped', lastActivity: '2025-02-01' },
];

export const MOCK_APPLICATIONS: MockApplication[] = [
  { id: 'a1', applicantName: 'Taylor Smith', email: 'taylor.s@example.com', course: 'DeFi Fundamentals', submittedAt: '2025-02-20', status: 'pending', message: 'Interested in the upcoming cohort.' },
  { id: 'a2', applicantName: 'Jamie Martinez', email: 'jamie.m@example.com', course: 'Smart Contracts & Solidity', submittedAt: '2025-02-19', status: 'approved' },
  { id: 'a3', applicantName: 'Reese Anderson', email: 'reese.a@example.com', course: 'Introduction to Blockchain', submittedAt: '2025-02-18', status: 'rejected', message: 'Does not meet prerequisites.' },
  { id: 'a4', applicantName: 'Avery Clark', email: 'avery.c@example.com', course: 'DeFi Fundamentals', submittedAt: '2025-02-21', status: 'pending' },
];

export const MOCK_ANALYTICS = {
  enrollmentByMonth: [
    { month: 'Aug', count: 12 },
    { month: 'Sep', count: 18 },
    { month: 'Oct', count: 24 },
    { month: 'Nov', count: 31 },
    { month: 'Dec', count: 28 },
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
  ],
  completionByCourse: [
    { name: 'Intro to Blockchain', completed: 98, inProgress: 26 },
    { name: 'Smart Contracts', completed: 72, inProgress: 17 },
    { name: 'Web3 Development', completed: 44, inProgress: 12 },
  ],
  activityByDay: [
    { day: 'Mon', active: 120 },
    { day: 'Tue', active: 145 },
    { day: 'Wed', active: 132 },
    { day: 'Thu', active: 168 },
    { day: 'Fri', active: 95 },
    { day: 'Sat', active: 78 },
    { day: 'Sun', active: 62 },
  ],
  summary: {
    totalStudents: 269,
    activeEnrollments: 213,
    completionRate: 72,
    pendingApplications: 2,
  },
};
