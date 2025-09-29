// Enhanced course data with properties for tab filtering and all CourseCard features
export interface EnhancedCourseData {
  // Core required properties
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  studentsCount: number;
  rating: number;
  imageUrl: string;

  // Enhanced filtering properties
  popularity: number;
  dateAdded: string;
  trendingScore: number;

  // Optional enhanced properties
  instructor?: string;
  duration?: string; // Alternative duration format
  features?: string[]; // Course features/benefits
  tags?: string[]; // Course tags
  price?: number; // Course price
  originalPrice?: number; // Original price for discounts
  reviewCount?: number; // Number of reviews

  // Legacy support
  /** @deprecated Use features instead */
  highlights?: string[]; // Deprecated: use features instead
}

// Type alias for backward compatibility
export type CourseData = EnhancedCourseData;

// This will contain Centralized course data that can be imported by both the home page and courses page
// This is the hard-coded course data in place of when we fetch data in the future
export const allCourses: EnhancedCourseData[] = [
  {
    id: 'blockchain-fundamentals',
    title: 'Fundamentals of Blockchain Technology',
    description:
      'Learn the core concepts of blockchain, distributed ledgers, and consensus mechanisms.',
    level: 'Beginner' as const,
    durationHours: 6,
    studentsCount: 1245,
    rating: 4.8,
    popularity: 95,
    dateAdded: '2023-10-15',
    trendingScore: 75,
    imageUrl: '/images/courses/blockchain-fundamentals.jpg',
    instructor: 'Dr. Sarah Chen',
    price: 99,
    originalPrice: 149,
    features: [
      'Complete blockchain architecture overview',
      'Hands-on cryptography exercises',
      'Real-world case studies',
      'Certificate of completion',
    ],
    tags: ['Blockchain', 'Fundamentals', 'Beginner-Friendly'],
    reviewCount: 324,
  },
  {
    id: 'stellar-smart-contract',
    title: 'Stellar Smart Contract Development',
    description:
      'Master the art of building secure and efficient smart contracts on the Stellar network.',
    level: 'Intermediate' as const,
    durationHours: 8,
    studentsCount: 876,
    rating: 4.9,
    popularity: 85,
    dateAdded: '2023-11-20',
    trendingScore: 90,
    imageUrl: '/images/courses/stellar-smart-contract.jpg',
    instructor: 'Alex Rodriguez',
    price: 159,
    originalPrice: 199,
    features: [
      'Soroban smart contract development',
      'Testing and deployment strategies',
      'Security best practices',
      'Production-ready examples',
      '24/7 community support',
    ],
    tags: ['Stellar', 'Smart Contracts', 'Soroban'],
    reviewCount: 187,
  },
  {
    id: 'defi-stellar',
    title: 'Decentralized Finance (DeFi) on Stellar',
    description:
      'Explore the world of DeFi and learn how to build financial applications on Stellar.',
    level: 'Advanced' as const,
    durationHours: 10,
    studentsCount: 654,
    rating: 4.7,
    popularity: 80,
    dateAdded: '2023-09-05',
    trendingScore: 85,
    imageUrl: '/images/courses/defi-stellar.jpg',
    instructor: 'Michael Thompson',
    price: 249,
    features: [
      'Build complete DeFi protocols',
      'Liquidity pool management',
      'Yield farming strategies',
      'Risk assessment techniques',
      'Portfolio optimization',
    ],
    tags: ['DeFi', 'Advanced', 'Finance'],
    reviewCount: 98,
  },
  {
    id: 'blockchain-security',
    title: 'Blockchain Security Fundamentals',
    description:
      'Learn essential security practices for blockchain applications and smart contracts.',
    level: 'Intermediate' as const,
    durationHours: 7,
    studentsCount: 932,
    rating: 4.6,
    popularity: 88,
    dateAdded: '2023-08-12',
    trendingScore: 70,
    imageUrl: '/images/courses/blockchain-security.jpg',
    instructor: 'Dr. Emily Davis',
    price: 129,
    originalPrice: 179,
    features: [
      'Vulnerability assessment tools',
      'Penetration testing methods',
      'Secure coding practices',
      'Incident response protocols',
    ],
    tags: ['Security', 'Best Practices', 'Enterprise'],
    reviewCount: 156,
  },
  {
    id: 'crypto-trading',
    title: 'Cryptocurrency Trading Strategies',
    description:
      'Master the fundamentals of cryptocurrency trading and portfolio management.',
    level: 'Beginner' as const,
    durationHours: 5,
    studentsCount: 1876,
    rating: 4.5,
    popularity: 98,
    dateAdded: '2023-07-25',
    trendingScore: 65,
    imageUrl: '/images/courses/crypto-trading.jpg',
  },
  {
    id: 'nft-development',
    title: 'NFT Development and Marketplace',
    description:
      'Build your own NFT collection and marketplace on the Stellar blockchain.',
    level: 'Advanced' as const,
    durationHours: 12,
    studentsCount: 543,
    rating: 4.9,
    popularity: 75,
    dateAdded: '2024-01-10',
    trendingScore: 95,
    imageUrl: '/images/courses/nft-development.jpg',
  },
  {
    id: 'blockchain-governance',
    title: 'Blockchain Governance Models',
    description:
      'Explore different governance models for decentralized networks and DAOs.',
    level: 'Advanced' as const,
    durationHours: 9,
    studentsCount: 421,
    rating: 4.8,
    popularity: 70,
    dateAdded: '2024-02-05',
    trendingScore: 80,
    imageUrl: '/images/courses/blockchain-governance.jpg',
  },
];
