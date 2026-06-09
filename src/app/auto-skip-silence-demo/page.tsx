'use client';

import React, { useState } from 'react';
import AdaptiveVideoPlayer from '@/components/AdaptiveVideoPlayer';
import VideoPlayer from '@/components/VideoPlayer';
import VideoPlayerSync from '@/components/VideoPlayerSync';

export default function AutoSkipSilenceDemo() {
  const [enableSilence, setEnableSilence] = useState(true);
  const [threshold, setThreshold] = useState(20);
  const [minDuration, setMinDuration] = useState(1.5);
  const [totalSkipped, setTotalSkipped] = useState(0);

  const handleSilenceSkip = (start: number, end: number) => {
    console.log(`Skipped silence from ${start.toFixed(2)}s to ${end.toFixed(2)}s`);
    setTotalSkipped(prev => prev + (end - start));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Auto-Skip Silence Feature Demo
          </h1>
          <p className="text-gray-400">
            Detect and skip silent parts of videos automatically to save time
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enable/Disable Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enable Silence Skip
              </label>
              <button
                onClick={() => setEnableSilence(!enableSilence)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${enableSilence
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {enableSilence ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Threshold Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Silence Threshold: {threshold}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = more sensitive (5-50)
              </p>
            </div>

            {/* Minimum Duration Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Duration: {minDuration}s
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={minDuration}
                onChange={(e) => setMinDuration(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum silence to skip (0.5-5s)
              </p>
            </div>
          </div>

          {/* Stats */}
          {totalSkipped > 0 && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 font-medium">
                ⏱️ Total Time Skipped: {totalSkipped.toFixed(2)} seconds
              </p>
            </div>
          )}
        </div>

        {/* Demo 1: AdaptiveVideoPlayer */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Demo 1: AdaptiveVideoPlayer
          </h2>
          <AdaptiveVideoPlayer
            sources={[
              { quality: '720p', url: '/videos/demo-video.mp4' },
            ]}
            lessonId="demo-lesson-1"
            title="Sample Lecture with Silence"
            enableSilenceSkip={enableSilence}
            silenceThreshold={threshold}
            minSilenceDuration={minDuration}
            onSilenceSkip={handleSilenceSkip}
          />
        </div>

        {/* Demo 2: VideoPlayer */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Demo 2: VideoPlayer
          </h2>
          <VideoPlayer
            videoId="demo-video-2"
            videoUrl="/videos/demo-video.mp4"
            title="Tutorial with Pauses"
            enableSilenceSkip={enableSilence}
            silenceThreshold={threshold}
            minSilenceDuration={minDuration}
          />
        </div>

        {/* Demo 3: VideoPlayerSync */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Demo 3: VideoPlayerSync
          </h2>
          <VideoPlayerSync
            videoId="demo-video-3"
            src="/videos/demo-video.mp4"
            enableSilenceSkip={enableSilence}
            silenceThreshold={threshold}
            minSilenceDuration={minDuration}
          />
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            How to Use
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">1.</span>
              <span>Configure the silence detection settings above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">2.</span>
              <span>Play any video and the silence will be detected automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">3.</span>
              <span>Use the "Skip Silence" button in the video controls to toggle on/off</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">4.</span>
              <span>Watch for the "Skipping..." indicator when silence is detected</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">5.</span>
              <span>Check the "Time Saved" counter to see how much time you've saved</span>
            </li>
          </ul>
        </div>

        {/* Acceptance Criteria Checklist */}
        <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3">
            ✅ Acceptance Criteria
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Detect silence:</strong> Real-time audio analysis using Web Audio API</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Skip automatically:</strong> Seamlessly jumps over silent portions</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              <span><strong>Toggle feature:</strong> Easy on/off control in video player</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
