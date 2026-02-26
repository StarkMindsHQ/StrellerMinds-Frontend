'use client';

import React, { useState } from 'react';
import AdaptiveThumbnail, { ThumbnailSources } from './AdaptiveThumbnail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Monitor, Smartphone, Tablet, Zap, Database, Image as ImageIcon, Play } from 'lucide-react';

// Example usage component
export default function AdaptiveThumbnailExample() {
  const [selectedConfig, setSelectedConfig] = useState({
    hoverEffect: 'zoom' as 'zoom' | 'fade' | 'slide' | 'none',
    showPlayButton: true,
    enableCache: true,
    lazy: true,
  });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Mock thumbnail URLs with different sizes
  const mockThumbnails = {
    single: 'https://picsum.photos/seed/video1/800/450.jpg',
    responsive: {
      xs: 'https://picsum.photos/seed/video2/300/169.jpg',
      sm: 'https://picsum.photos/seed/video2/400/225.jpg',
      md: 'https://picsum.photos/seed/video2/500/281.jpg',
      lg: 'https://picsum.photos/seed/video2/600/338.jpg',
      xl: 'https://picsum.photos/seed/video2/700/394.jpg',
      xxl: 'https://picsum.photos/seed/video2/800/450.jpg',
    } as ThumbnailSources,
    placeholder: 'https://picsum.photos/seed/placeholder/400/225.jpg',
    error: 'https://invalid-url-that-will-fail.com/image.jpg',
  };

  // Mock video data
  const mockVideos = [
    {
      id: 'video-1',
      title: 'Advanced React Patterns',
      thumbnail: mockThumbnails.single,
      duration: '1h 30m',
      views: '45.2K',
    },
    {
      id: 'video-2',
      title: 'TypeScript Deep Dive',
      thumbnail: mockThumbnails.responsive,
      duration: '2h 15m',
      views: '32.1K',
    },
    {
      id: 'video-3',
      title: 'Node.js Performance',
      thumbnail: mockThumbnails.placeholder,
      duration: '1h 45m',
      views: '28.7K',
    },
    {
      id: 'video-4',
      title: 'CSS Grid Mastery',
      thumbnail: mockThumbnails.error, // This will show error state
      duration: '3h 00m',
      views: '19.3K',
    },
  ];

  // Track window size for demo
  React.useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleThumbnailClick = (videoId: string) => {
    console.log('Clicked video:', videoId);
    // In a real app, this would navigate to video page or open modal
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
  };

  const handleImageError = (error: Error) => {
    console.error('Image load failed:', error.message);
  };

  const getCurrentBreakpoint = () => {
    const width = windowSize.width;
    if (width <= 575) return 'xs (0-575px)';
    if (width <= 767) return 'sm (576-767px)';
    if (width <= 991) return 'md (768-991px)';
    if (width <= 1199) return 'lg (992-1199px)';
    if (width <= 1399) return 'xl (1200-1399px)';
    return 'xxl (1400px+)';
  };

  const clearCache = () => {
    // Clear thumbnail cache (would need to expose this from the component)
    console.log('Cache cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Adaptive Thumbnail Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience optimized thumbnail loading with lazy loading, responsive sizing, and smooth animations.
          </p>
        </div>

        {/* Window Size Indicator */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Current Viewport</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {windowSize.width}px × {windowSize.height}px
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Window Size
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getCurrentBreakpoint()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Breakpoint
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedConfig.lazy ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Lazy Loading
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Thumbnail Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Hover Effect */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hover Effect
                </label>
                <select
                  value={selectedConfig.hoverEffect}
                  onChange={(e) => setSelectedConfig(prev => ({ 
                    ...prev, 
                    hoverEffect: e.target.value as any 
                  }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                >
                  <option value="zoom">Zoom</option>
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Play Button */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={selectedConfig.showPlayButton}
                    onChange={(e) => setSelectedConfig(prev => ({ 
                      ...prev, 
                      showPlayButton: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Play Button
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display play button on hover
                </p>
              </div>

              {/* Cache */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={selectedConfig.enableCache}
                    onChange={(e) => setSelectedConfig(prev => ({ 
                      ...prev, 
                      enableCache: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Enable Cache
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Local thumbnail caching
                </p>
              </div>

              {/* Lazy Loading */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={selectedConfig.lazy}
                    onChange={(e) => setSelectedConfig(prev => ({ 
                      ...prev, 
                      lazy: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Lazy Loading
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Load on viewport entry
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={clearCache} variant="outline" size="sm">
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Thumbnails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <AdaptiveThumbnail
                    thumbnailUrl={video.thumbnail}
                    altText={video.title}
                    onClick={() => handleThumbnailClick(video.id)}
                    sources={video.thumbnail === mockThumbnails.responsive ? video.thumbnail : undefined}
                    hoverEffect={selectedConfig.hoverEffect}
                    showPlayButton={selectedConfig.showPlayButton}
                    enableCache={selectedConfig.enableCache}
                    lazy={selectedConfig.lazy}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className="w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                  {video.thumbnail === mockThumbnails.error && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      Error state demo
                    </div>
                  )}
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
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto" />
                </div>
                <h4 className="font-medium mb-1">Lazy Loading</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Images load only when needed
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-2">
                  <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                </div>
                <h4 className="font-medium mb-1">Responsive Images</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized for every screen size
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-2">
                  <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto" />
                </div>
                <h4 className="font-medium mb-1">Local Caching</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stores frequently viewed images
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-2">
                  <ImageIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto" />
                </div>
                <h4 className="font-medium mb-1">Smooth Animations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hover effects and transitions
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
                {'<AdaptiveThumbnail thumbnailUrl="url" altText="description" onClick={handleClick} />'}
              </code>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Resize your browser window to see responsive image loading</li>
              <li>Scroll down and up to test lazy loading behavior</li>
              <li>Hover over thumbnails to see animation effects</li>
              <li>Toggle configuration options to see different behaviors</li>
              <li>Notice the loading spinners and error states</li>
              <li>Check console for load/error callbacks</li>
              <li>Try the cache clear functionality</li>
            </ul>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Performance Benefits:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Reduced initial page load time</li>
                <li>• Optimized bandwidth usage</li>
                <li>• Better user experience with smooth loading</li>
                <li>• Cached images for instant subsequent loads</li>
                <li>• Responsive sizing for all devices</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
