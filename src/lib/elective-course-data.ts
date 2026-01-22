// Elective course data structure
export interface ElectiveCourseData {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  studentsCount: number;
  rating: number;
  imageUrl: string;
  instructor?: string;
  price?: number;
  originalPrice?: number;
  features?: string[];
  tags?: string[];
  category: string;
  isElective: true; // Flag to distinguish elective courses
}

// Mock elective courses data
export const electiveCourses: ElectiveCourseData[] = [
  {
    id: 'web3-frontend',
    title: 'Web3 Frontend Development',
    description:
      'Learn to build modern Web3 applications with React, wagmi, and smart contract integration. Master wallet connectivity, transaction management, and DApp development.',
    level: 'Intermediate',
    durationHours: 8,
    studentsCount: 543,
    rating: 4.7,
    imageUrl: '/images/courses/web3-frontend.jpg',
    instructor: 'Sarah Martinez',
    price: 149,
    originalPrice: 199,
    features: [
      'Real wallet integration',
      'Smart contract interaction',
      'DApp architecture',
      'Gas fee optimization',
      'Transaction management',
      'Error handling',
    ],
    tags: ['Web3', 'Frontend', 'React', 'Blockchain'],
    category: 'Development',
    isElective: true,
  },
  {
    id: 'blockchain-analytics',
    title: 'Blockchain Data Analytics',
    description:
      'Master data analysis techniques for blockchain networks and transactions.',
    level: 'Advanced',
    durationHours: 10,
    studentsCount: 321,
    rating: 4.8,
    imageUrl: '/images/courses/blockchain-analytics.jpg',
    instructor: 'Dr. James Wilson',
    price: 199,
    originalPrice: 249,
    features: [
      'On-chain analysis',
      'Data visualization',
      'Pattern recognition',
      'Predictive modeling',
    ],
    tags: ['Analytics', 'Data Science', 'Advanced'],
    category: 'Analytics',
    isElective: true,
  },
  {
    id: 'tokenomics-design',
    title: 'Tokenomics and Token Design',
    description:
      'Design sustainable token economies and understand token mechanics.',
    level: 'Intermediate',
    durationHours: 6,
    studentsCount: 456,
    rating: 4.6,
    imageUrl: '/images/courses/tokenomics.jpg',
    instructor: 'Emma Thompson',
    price: 129,
    features: [
      'Token economic models',
      'Incentive design',
      'Distribution strategies',
      'Case studies',
    ],
    tags: ['Tokenomics', 'Economics', 'Design'],
    category: 'Economics',
    isElective: true,
  },
  {
    id: 'dao-governance',
    title: 'DAO Governance and Management',
    description:
      'Learn how to create and manage Decentralized Autonomous Organizations.',
    level: 'Advanced',
    durationHours: 9,
    studentsCount: 289,
    rating: 4.9,
    imageUrl: '/images/courses/dao-governance.jpg',
    instructor: 'Marcus Chen',
    price: 179,
    originalPrice: 229,
    features: [
      'DAO frameworks',
      'Voting mechanisms',
      'Treasury management',
      'Community building',
    ],
    tags: ['DAO', 'Governance', 'Management'],
    category: 'Governance',
    isElective: true,
  },
  {
    id: 'cryptography-fundamentals',
    title: 'Applied Cryptography for Blockchain',
    description:
      'Deep dive into cryptographic principles used in blockchain technology.',
    level: 'Advanced',
    durationHours: 12,
    studentsCount: 234,
    rating: 4.8,
    imageUrl: '/images/courses/cryptography.jpg',
    instructor: 'Dr. Alice Kumar',
    price: 219,
    features: [
      'Hash functions',
      'Digital signatures',
      'Zero-knowledge proofs',
      'Encryption schemes',
    ],
    tags: ['Cryptography', 'Security', 'Advanced'],
    category: 'Security',
    isElective: true,
  },
];

// Mock delete function (until API is ready)
export const mockDeleteElectiveCourse = async (
  courseId: string,
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate success response
  return {
    success: true,
    message: `Course "${courseId}" has been successfully deleted.`,
  };
};

// Helper function to get elective course by ID
export const getElectiveCourseById = (
  courseId: string,
): ElectiveCourseData | undefined => {
  return electiveCourses.find((course) => course.id === courseId);
};
