// Enhanced elective data structure for search and filtering functionality
export interface ElectiveData {
  // Core required properties
  id: string;
  name: string;
  description: string;
  category: string;
  creditHours: number;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';

  // Additional properties for enhanced functionality
  duration: string; // e.g., "12 weeks", "1 semester"
  prerequisites?: string[];
  studentsEnrolled: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  tags: string[];

  // Metadata for filtering and sorting
  dateAdded: string;
  popularity: number;
  isActive: boolean;
}

// Mock electives data for demonstration
export const allElectives: ElectiveData[] = [
  {
    id: 'blockchain-ethics',
    name: 'Blockchain Ethics and Governance',
    description:
      'Explore the ethical implications of blockchain technology and decentralized governance models.',
    category: 'Ethics & Philosophy',
    creditHours: 3,
    instructor: 'Dr. Sarah Mitchell',
    level: 'Intermediate',
    duration: '12 weeks',
    prerequisites: ['Blockchain Fundamentals'],
    studentsEnrolled: 245,
    rating: 4.7,
    reviewCount: 89,
    imageUrl: '/images/electives/blockchain-ethics.jpg',
    tags: ['Ethics', 'Governance', 'Philosophy', 'Blockchain'],
    dateAdded: '2024-01-15',
    popularity: 85,
    isActive: true,
  },
  {
    id: 'crypto-economics',
    name: 'Cryptocurrency Economics',
    description:
      'Deep dive into the economic principles behind cryptocurrencies and token economics.',
    category: 'Economics',
    creditHours: 4,
    instructor: 'Prof. Michael Chen',
    level: 'Advanced',
    duration: '16 weeks',
    prerequisites: ['Blockchain Fundamentals', 'Basic Economics'],
    studentsEnrolled: 189,
    rating: 4.9,
    reviewCount: 67,
    imageUrl: '/images/electives/crypto-economics.jpg',
    tags: ['Economics', 'Token Economics', 'Finance', 'Advanced'],
    dateAdded: '2024-02-01',
    popularity: 92,
    isActive: true,
  },
  {
    id: 'web3-ux-design',
    name: 'Web3 User Experience Design',
    description:
      'Learn to design intuitive user interfaces for decentralized applications.',
    category: 'Design',
    creditHours: 3,
    instructor: 'Emma Rodriguez',
    level: 'Beginner',
    duration: '10 weeks',
    prerequisites: [],
    studentsEnrolled: 312,
    rating: 4.6,
    reviewCount: 124,
    imageUrl: '/images/electives/web3-ux-design.jpg',
    tags: ['Design', 'UX', 'Web3', 'UI'],
    dateAdded: '2024-01-20',
    popularity: 78,
    isActive: true,
  },
  {
    id: 'decentralized-finance-protocols',
    name: 'Advanced DeFi Protocol Development',
    description:
      'Build complex DeFi protocols including AMMs, lending platforms, and yield farming.',
    category: 'Development',
    creditHours: 5,
    instructor: 'Alex Thompson',
    level: 'Advanced',
    duration: '20 weeks',
    prerequisites: ['Smart Contract Development', 'Solidity Programming'],
    studentsEnrolled: 156,
    rating: 4.8,
    reviewCount: 45,
    imageUrl: '/images/electives/decentralized-finance-protocols.jpg',
    tags: ['Decentralized Finance', 'Development', 'Advanced', 'Protocols'],
    dateAdded: '2024-02-10',
    popularity: 88,
    isActive: true,
  },
  {
    id: 'nft-art-creation',
    name: 'NFT Art Creation and Marketplace',
    description:
      'Create, mint, and sell digital art as NFTs on various blockchain platforms.',
    category: 'Art & Creativity',
    creditHours: 2,
    instructor: 'Luna Park',
    level: 'Beginner',
    duration: '8 weeks',
    prerequisites: [],
    studentsEnrolled: 428,
    rating: 4.4,
    reviewCount: 156,
    imageUrl: '/images/electives/nft-art-creation.jpg',
    tags: ['NFT', 'Art', 'Creativity', 'Marketplace'],
    dateAdded: '2024-01-05',
    popularity: 95,
    isActive: true,
  },
  {
    id: 'blockchain-law',
    name: 'Blockchain and Legal Frameworks',
    description:
      'Understand the legal implications and regulatory landscape of blockchain technology.',
    category: 'Law & Regulation',
    creditHours: 3,
    instructor: 'Dr. James Wilson',
    level: 'Intermediate',
    duration: '14 weeks',
    prerequisites: ['Blockchain Fundamentals'],
    studentsEnrolled: 198,
    rating: 4.5,
    reviewCount: 78,
    imageUrl: '/images/electives/blockchain-law.jpg',
    tags: ['Law', 'Regulation', 'Legal', 'Compliance'],
    dateAdded: '2024-01-25',
    popularity: 72,
    isActive: true,
  },
  {
    id: 'crypto-trading-advanced',
    name: 'Advanced Cryptocurrency Trading',
    description:
      'Master advanced trading strategies, technical analysis, and risk management.',
    category: 'Trading & Finance',
    creditHours: 4,
    instructor: 'Maria Santos',
    level: 'Advanced',
    duration: '16 weeks',
    prerequisites: ['Basic Trading', 'Market Analysis'],
    studentsEnrolled: 267,
    rating: 4.7,
    reviewCount: 98,
    imageUrl: '/images/electives/crypto-trading-advanced.jpg',
    tags: ['Trading', 'Finance', 'Technical Analysis', 'Risk Management'],
    dateAdded: '2024-02-05',
    popularity: 89,
    isActive: true,
  },
  {
    id: 'dao-governance',
    name: 'DAO Creation and Governance',
    description:
      'Learn to create and manage Decentralized Autonomous Organizations.',
    category: 'Governance',
    creditHours: 3,
    instructor: 'David Kim',
    level: 'Intermediate',
    duration: '12 weeks',
    prerequisites: ['Blockchain Fundamentals', 'Smart Contracts'],
    studentsEnrolled: 134,
    rating: 4.6,
    reviewCount: 52,
    imageUrl: '/images/electives/dao-governance.jpg',
    tags: ['DAO', 'Governance', 'Management', 'Decentralization'],
    dateAdded: '2024-02-15',
    popularity: 76,
    isActive: true,
  },
  {
    id: 'blockchain-sustainability',
    name: 'Sustainable Blockchain Technologies',
    description:
      'Explore eco-friendly blockchain solutions and sustainable development practices.',
    category: 'Sustainability',
    creditHours: 2,
    instructor: 'Dr. Green Thompson',
    level: 'Beginner',
    duration: '8 weeks',
    prerequisites: [],
    studentsEnrolled: 289,
    rating: 4.3,
    reviewCount: 112,
    imageUrl: '/images/electives/blockchain-sustainability.jpg',
    tags: ['Sustainability', 'Environment', 'Green Tech', 'Innovation'],
    dateAdded: '2024-01-30',
    popularity: 68,
    isActive: true,
  },
  {
    id: 'virtual-worlds-development',
    name: 'Virtual Worlds and Immersive Experiences',
    description:
      'Build immersive virtual experiences and interactive digital environments.',
    category: 'Virtual Reality',
    creditHours: 4,
    instructor: 'Ryan Foster',
    level: 'Advanced',
    duration: '18 weeks',
    prerequisites: ['3D Programming', 'Blockchain Fundamentals'],
    studentsEnrolled: 178,
    rating: 4.8,
    reviewCount: 67,
    imageUrl: '/images/electives/virtual-worlds-development.jpg',
    tags: ['Virtual Worlds', 'VR', 'Immersive Tech', 'Development'],
    dateAdded: '2024-02-20',
    popularity: 91,
    isActive: true,
  },
  {
    id: 'blockchain-security-audit',
    name: 'Blockchain Security Auditing',
    description:
      'Learn to audit smart contracts and blockchain applications for security vulnerabilities.',
    category: 'Security',
    creditHours: 5,
    instructor: 'Dr. Security Expert',
    level: 'Advanced',
    duration: '20 weeks',
    prerequisites: ['Smart Contract Development', 'Cybersecurity Basics'],
    studentsEnrolled: 98,
    rating: 4.9,
    reviewCount: 34,
    imageUrl: '/images/electives/blockchain-security-audit.jpg',
    tags: ['Security', 'Auditing', 'Smart Contracts', 'Cybersecurity'],
    dateAdded: '2024-02-25',
    popularity: 87,
    isActive: true,
  },
  {
    id: 'crypto-journalism',
    name: 'Cryptocurrency Journalism',
    description:
      'Learn to report on blockchain and cryptocurrency news with accuracy and insight.',
    category: 'Media & Communication',
    creditHours: 2,
    instructor: 'Sarah News',
    level: 'Beginner',
    duration: '10 weeks',
    prerequisites: [],
    studentsEnrolled: 156,
    rating: 4.2,
    reviewCount: 67,
    imageUrl: '/images/electives/crypto-journalism.jpg',
    tags: ['Journalism', 'Media', 'Communication', 'News'],
    dateAdded: '2024-01-10',
    popularity: 64,
    isActive: true,
  },
];

// Helper function to get unique categories for filtering
export const getUniqueCategories = (): string[] => {
  const categories = allElectives.map((elective) => elective.category);
  return Array.from(new Set(categories)).sort();
};

// Helper function to get credit hour ranges for filtering
export const getCreditHourRanges = (): {
  label: string;
  min: number;
  max: number;
}[] => {
  return [
    { label: '1-2 Credits', min: 1, max: 2 },
    { label: '3 Credits', min: 3, max: 3 },
    { label: '4 Credits', min: 4, max: 4 },
    { label: '5+ Credits', min: 5, max: 10 },
  ];
};
