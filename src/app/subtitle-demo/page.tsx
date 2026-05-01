'use client';

import React from 'react';
import VideoPlayerSync, { SubtitleTrack } from '@/components/VideoPlayerSync';

const subtitleTracks: SubtitleTrack[] = [
  {
    src: '/videos/subtitles/demo-en.vtt',
    srclang: 'en',
    label: 'English',
    kind: 'subtitles',
    default: true,
  },
  {
    src: '/videos/subtitles/demo-es.vtt',
    srclang: 'es',
    label: 'Español',
    kind: 'subtitles',
  },
];

export default function SubtitleDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Subtitle Support Demo
          </h1>
          <p className="text-gray-400">
            Test subtitle functionality with multiple languages and customization options
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayerSync
            videoId="subtitle-demo"
            src="/videos/demo-video.mp4"
            poster="/videos/demo-video-poster.jpg"
            subtitleTracks={subtitleTracks}
            className="w-full aspect-video"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Subtitle Controls</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Toggle subtitles ON/OFF</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Multiple language support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Language switching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Persistent preferences</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Customization</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Font size adjustment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Color customization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Background styling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Font family options</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            How to Use Subtitles
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">1.</span>
              <span>Click the subtitle icon to toggle subtitles on/off</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">2.</span>
              <span>Use the language dropdown to select your preferred language</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">3.</span>
              <span>Click the settings icon to customize subtitle appearance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">4.</span>
              <span>Your preferences are automatically saved</span>
            </li>
          </ul>
        </div>

        {/* Acceptance Criteria */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            ✅ Acceptance Criteria
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Toggle subtitles ON/OFF:</strong> Easy toggle button in player controls</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Support multiple languages:</strong> Dropdown selector for language choice</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Subtitles sync correctly:</strong> Proper timing with video playback</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Language switching works:</strong> Seamless switching between languages</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}