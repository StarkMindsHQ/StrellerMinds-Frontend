// Mock data service for InfiniteScrollFeed demonstration
import { VideoItem, FetchVideosResponse } from './InfiniteScrollFeed';

// Generate mock video data
const generateMockVideo = (index: number): VideoItem => {
  const titles = [
    'Advanced React Patterns and Performance',
    'Building Scalable Node.js Applications',
    'TypeScript Deep Dive: Advanced Types',
    'Modern CSS Grid and Flexbox Mastery',
    'Vue 3 Composition API Guide',
    'Docker Containerization Best Practices',
    'GraphQL API Design and Implementation',
    'AWS Cloud Architecture Patterns',
    'Machine Learning with JavaScript',
    'Blockchain Development with Solidity',
    'Progressive Web App Development',
    'Microservices Architecture Guide',
    'React Native Mobile Development',
    'Python Data Science Fundamentals',
    'Kubernetes Orchestration Deep Dive',
  ];

  const instructors = [
    'Dr. Sarah Chen',
    'Michael Rodriguez',
    'Emily Thompson',
    'James Wilson',
    'Lisa Anderson',
    'David Martinez',
    'Jennifer Taylor',
    'Robert Brown',
    'Maria Garcia',
    'William Davis',
  ];

  const levels: Array<'Beginner' | 'Intermediate' | 'Advanced'> = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];
  const tags = [
    'React',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Python',
    'Docker',
    'AWS',
    'GraphQL',
    'Vue',
    'CSS',
    'HTML',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Kubernetes',
    'Machine Learning',
    'AI',
    'Blockchain',
    'Web3',
  ];

  const title = titles[index % titles.length];
  const instructor = instructors[index % instructors.length];
  const level = levels[index % levels.length];
  const videoTags = tags
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 4) + 2);

  return {
    id: `video-${index + 1}`,
    title,
    description: `Comprehensive guide to ${title.toLowerCase()} with practical examples and best practices for modern development.`,
    duration: Math.floor(Math.random() * 3600) + 600, // 10 minutes to 1 hour
    instructor,
    studentsCount: Math.floor(Math.random() * 50000) + 1000,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
    level,
    tags: videoTags,
    views: Math.floor(Math.random() * 1000000) + 10000,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    isLive: Math.random() > 0.9, // 10% chance of being live
  };
};

// Mock API service
class MockVideoService {
  private totalVideos = 150; // Total number of videos available
  private delay = 800; // Simulated network delay

  async fetchVideos(cursor?: string, limit = 12): Promise<FetchVideosResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Parse cursor to get starting index
    const startIndex = cursor ? parseInt(cursor, 10) : 0;

    // Calculate end index
    const endIndex = Math.min(startIndex + limit, this.totalVideos);

    // Generate videos for this batch
    const videos = [];
    for (let i = startIndex; i < endIndex; i++) {
      videos.push(generateMockVideo(i));
    }

    // Determine if there are more videos
    const hasMore = endIndex < this.totalVideos;

    // Generate next cursor
    const nextCursor = hasMore ? endIndex.toString() : undefined;

    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch videos. Please try again.');
    }

    return {
      videos,
      hasMore,
      nextCursor,
      totalCount: this.totalVideos,
    };
  }

  // Method to simulate real-time updates
  async fetchNewVideos(since?: string): Promise<VideoItem[]> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    // Occasionally return new videos
    if (Math.random() > 0.7) {
      const newVideoCount = Math.floor(Math.random() * 3) + 1;
      const newVideos = [];

      for (let i = 0; i < newVideoCount; i++) {
        newVideos.push(generateMockVideo(this.totalVideos + i));
      }

      this.totalVideos += newVideoCount;
      return newVideos;
    }

    return [];
  }

  // Method to search videos (for future features)
  async searchVideos(query: string, limit = 12): Promise<FetchVideosResponse> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));

    const allVideos = Array.from(
      { length: Math.min(50, this.totalVideos) },
      (_, i) => generateMockVideo(i),
    );

    const filteredVideos = allVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        ),
    );

    return {
      videos: filteredVideos.slice(0, limit),
      hasMore: filteredVideos.length > limit,
      totalCount: filteredVideos.length,
    };
  }
}

export const mockVideoService = new MockVideoService();
