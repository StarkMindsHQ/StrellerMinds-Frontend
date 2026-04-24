'use client';

import { useState } from 'react';

export interface Reaction {
  emoji: string;
  label: string;
}

export interface ReactionSystemProps {
  targetId: string;
  initialReactions?: Record<string, number>;
  initialUserReaction?: string | null;
  reactions?: Reaction[];
  onReact?: (targetId: string, emoji: string | null) => void;
  className?: string;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '🔥', label: 'Fire' },
];

export function ReactionSystem({
  targetId,
  initialReactions = {},
  initialUserReaction = null,
  reactions = DEFAULT_REACTIONS,
  onReact,
  className = '',
}: ReactionSystemProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialReactions);
  const [userReaction, setUserReaction] = useState<string | null>(initialUserReaction);
  const [showPicker, setShowPicker] = useState(false);

  const handleReact = (emoji: string) => {
    setCounts((prev) => {
      const next = { ...prev };
      if (userReaction === emoji) {
        // Toggle off
        next[emoji] = Math.max(0, (next[emoji] ?? 0) - 1);
        if (next[emoji] === 0) delete next[emoji];
        setUserReaction(null);
        onReact?.(targetId, null);
      } else {
        // Remove previous reaction
        if (userReaction) {
          next[userReaction] = Math.max(0, (next[userReaction] ?? 0) - 1);
          if (next[userReaction] === 0) delete next[userReaction];
        }
        next[emoji] = (next[emoji] ?? 0) + 1;
        setUserReaction(emoji);
        onReact?.(targetId, emoji);
      }
      return next;
    });
    setShowPicker(false);
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emoji]) => emoji);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Reaction summary */}
      {totalCount > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
          <span>{topReactions.join('')}</span>
          <span className="text-gray-600 dark:text-gray-400">{totalCount}</span>
        </div>
      )}

      {/* React button */}
      <button
        type="button"
        aria-label="Add reaction"
        onClick={() => setShowPicker((v) => !v)}
        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
          userReaction
            ? 'border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-400'
            : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
        }`}
      >
        {userReaction ?? '😊'} React
      </button>

      {/* Emoji picker */}
      {showPicker && (
        <div
          role="dialog"
          aria-label="Reaction picker"
          className="absolute bottom-full left-0 z-10 mb-2 flex gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {reactions.map(({ emoji, label }) => (
            <button
              key={emoji}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => handleReact(emoji)}
              className={`rounded-lg p-1.5 text-xl transition-transform hover:scale-125 ${
                userReaction === emoji ? 'bg-blue-100 dark:bg-blue-900/30' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
