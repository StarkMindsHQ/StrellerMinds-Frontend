import { NextRequest, NextResponse } from 'next/server';
import { validateQueryParams, createApiSuccess, createApiError } from '@/lib/api-validation';

// Mock course data with prerequisites
const mockCourseGraph = {
  nodes: [
    {
      id: 'blockchain-fundamentals',
      title: 'Blockchain Fundamentals',
      level: 'Beginner',
      durationHours: 6,
      status: 'completed',
      progress: 100,
      description: 'Learn the core concepts of blockchain technology',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
    },
    {
      id: 'stellar-smart-contract',
      title: 'Stellar Smart Contract Development',
      level: 'Intermediate',
      durationHours: 8,
      status: 'available',
      progress: 30,
      description: 'Master smart contract development on Stellar',
      instructor: 'Alex Rodriguez',
      rating: 4.9,
    },
    {
      id: 'defi-stellar',
      title: 'DeFi on Stellar',
      level: 'Advanced',
      durationHours: 10,
      status: 'locked',
      description: 'Build decentralized finance applications',
      instructor: 'Michael Thompson',
      rating: 4.7,
    },
    {
      id: 'blockchain-security',
      title: 'Blockchain Security',
      level: 'Intermediate',
      durationHours: 7,
      status: 'available',
      progress: 0,
      description: 'Learn security best practices for blockchain',
      instructor: 'Dr. Emily Davis',
      rating: 4.6,
    },
    {
      id: 'nft-development',
      title: 'NFT Development',
      level: 'Advanced',
      durationHours: 12,
      status: 'locked',
      description: 'Build NFT marketplaces and collections',
      instructor: 'Sarah Johnson',
      rating: 4.9,
    },
  ],
  edges: [
    { from: 'blockchain-fundamentals', to: 'stellar-smart-contract', type: 'required' },
    { from: 'stellar-smart-contract', to: 'defi-stellar', type: 'required' },
    { from: 'blockchain-fundamentals', to: 'blockchain-security', type: 'required' },
    { from: 'stellar-smart-contract', to: 'nft-development', type: 'required' },
    { from: 'blockchain-security', to: 'nft-development', type: 'recommended' },
  ],
};

// Mock user progress data
const mockUserProgress = {
  'user@example.com': {
    completedCourses: ['blockchain-fundamentals'],
    inProgressCourses: ['stellar-smart-contract'],
    courseProgress: {
      'blockchain-fundamentals': 100,
      'stellar-smart-contract': 30,
      'defi-stellar': 0,
      'blockchain-security': 0,
      'nft-development': 0,
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    if (!userId) {
      return createApiError('User ID is required', 400);
    }

    // Get user progress
    const userProgress = mockUserProgress[userId as keyof typeof mockUserProgress];
    if (!userProgress) {
      return createApiError('User not found', 404);
    }

    // Update node statuses based on user progress
    const updatedNodes = mockCourseGraph.nodes.map(node => {
      const isCompleted = userProgress.completedCourses.includes(node.id);
      const inProgress = userProgress.inProgressCourses.includes(node.id);
      const progress = userProgress.courseProgress[node.id] || 0;

      // Check if prerequisites are met
      const prerequisites = mockCourseGraph.edges
        .filter(edge => edge.to === node.id && edge.type === 'required')
        .map(edge => edge.from);

      const prerequisitesMet = prerequisites.every(prereqId => 
        userProgress.completedCourses.includes(prereqId)
      );

      let status: 'completed' | 'available' | 'locked' = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (prerequisitesMet) {
        status = 'available';
      }

      return {
        ...node,
        status,
        progress: isCompleted ? 100 : progress,
      };
    });

    // Filter by specific course if requested
    let filteredNodes = updatedNodes;
    let filteredEdges = mockCourseGraph.edges;

    if (courseId) {
      // Get all nodes that are related to the specified course (prerequisites and dependents)
      const relatedNodeIds = new Set<string>();
      
      // Add the course itself
      relatedNodeIds.add(courseId);
      
      // Add prerequisites
      mockCourseGraph.edges
        .filter(edge => edge.to === courseId)
        .forEach(edge => relatedNodeIds.add(edge.from));
      
      // Add dependent courses
      mockCourseGraph.edges
        .filter(edge => edge.from === courseId)
        .forEach(edge => relatedNodeIds.add(edge.to));

      // Recursively add all related nodes
      let changed = true;
      while (changed) {
        changed = false;
        mockCourseGraph.edges.forEach(edge => {
          if (relatedNodeIds.has(edge.from) && !relatedNodeIds.has(edge.to)) {
            relatedNodeIds.add(edge.to);
            changed = true;
          }
          if (relatedNodeIds.has(edge.to) && !relatedNodeIds.has(edge.from)) {
            relatedNodeIds.add(edge.from);
            changed = true;
          }
        });
      }

      filteredNodes = updatedNodes.filter(node => relatedNodeIds.has(node.id));
      filteredEdges = mockCourseGraph.edges.filter(edge => 
        relatedNodeIds.has(edge.from) && relatedNodeIds.has(edge.to)
      );
    }

    return createApiSuccess('Prerequisite graph retrieved successfully', {
      nodes: filteredNodes,
      edges: filteredEdges,
      userProgress: {
        completedCourses: userProgress.completedCourses,
        inProgressCourses: userProgress.inProgressCourses,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/courses/prerequisites/graph:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}
