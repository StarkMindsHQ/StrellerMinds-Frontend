'use client';

import React, { useState } from 'react';
import VideoDetailModal from './VideoDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Info, Settings, Eye, MessageCircle, Heart } from 'lucide-react';

// Example usage component
export default function VideoDetailModalExample() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    showRelatedVideos: true,
    enableComments: true,
    enableStats: true,
  });

  // Mock video data for demonstration
  const mockVideos = [
    {
      id: 'video-1',
      title: 'Advanced React Patterns and Performance',
      thumbnail: '🎬',
      duration: '1h 30m',
      views: '45.2K',
      level: 'Advanced',
    },
    {
      id: 'video-2',
      title: 'TypeScript Deep Dive: Advanced Types',
      thumbnail: '📚',
      duration: '2h 15m',
      views: '32.1K',
      level: 'Intermediate',
    },
    {
      id: 'video-3',
      title: 'Building Scalable Node.js Applications',
      thumbnail: '⚡',
      duration: '3h 00m',
      views: '28.7K',
      level: 'Advanced',
    },
    {
      id: 'video-4',
      title: 'Modern CSS Grid and Flexbox Mastery',
      thumbnail: '🎨',
      duration: '1h 45m',
      views: '19.3K',
      level: 'Beginner',
    },
  ];

  const openVideoModal = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideoId(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Video Detail Modal Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience smooth modal animations with dynamic content loading and
            interactive features.
          </p>
        </div>

        {/* Configuration Panel */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Modal Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={modalConfig.showRelatedVideos}
                    onChange={(e) =>
                      setModalConfig((prev) => ({
                        ...prev,
                        showRelatedVideos: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Related Videos
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display related video recommendations
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={modalConfig.enableComments}
                    onChange={(e) =>
                      setModalConfig((prev) => ({
                        ...prev,
                        enableComments: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Enable Comments
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show comment section with interactions
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={modalConfig.enableStats}
                    onChange={(e) =>
                      setModalConfig((prev) => ({
                        ...prev,
                        enableStats: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Statistics
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display video performance metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Click any video to view details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVideos.map((video) => (
              <Card
                key={video.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                onClick={() => openVideoModal(video.id)}
              >
                <CardHeader className="pb-3">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    <div className="text-4xl">{video.thumbnail}</div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <CardTitle className="text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full',
                        getLevelColor(video.level),
                      )}
                    >
                      {video.level}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal(video.id);
                      }}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mb-2">
                  <span className="text-2xl">🎭</span>
                </div>
                <h4 className="font-medium mb-1">Smooth Animations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scale and fade entrance effects
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-2">
                  <span className="text-2xl">⏳</span>
                </div>
                <h4 className="font-medium mb-1">Skeleton Loading</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Elegant loading states during API calls
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-2">
                  <span className="text-2xl">💬</span>
                </div>
                <h4 className="font-medium mb-1">Interactive Comments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Like, reply, and engage with content
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-medium mb-1">Dynamic Stats</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time video performance metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                {
                  '<VideoDetailModal videoId="video-123" isOpen={isOpen} onClose={handleClose} />'
                }
              </code>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Click on any video card to open the detail modal</li>
              <li>Watch the smooth scale/fade entrance animation</li>
              <li>Observe the skeleton loader while content is fetching</li>
              <li>Interact with comments - like and reply functionality</li>
              <li>Toggle configuration options to customize modal features</li>
              <li>Try the like, share, and download action buttons</li>
              <li>Scroll through the modal content to see all sections</li>
            </ul>
          </CardContent>
        </Card>

        {/* Current Selection Info */}
        {selectedVideoId && (
          <Card className="mt-8 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle>Currently Selected</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Video ID: {selectedVideoId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Modal is {isModalOpen ? 'open' : 'closed'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Video Detail Modal */}
      <VideoDetailModal
        videoId={selectedVideoId || ''}
        isOpen={isModalOpen}
        onClose={closeModal}
        showRelatedVideos={modalConfig.showRelatedVideos}
        enableComments={modalConfig.enableComments}
        enableStats={modalConfig.enableStats}
      />
    </div>
  );
}
