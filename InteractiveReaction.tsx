'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Heart, ThumbsUp, MessageCircle, Share2, Bookmark, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReactionType = 'like' | 'love' | 'comment' | 'share' | 'bookmark';

interface InteractiveReactionProps {
  reactionType: ReactionType;
  count: number;
  onReact?: () => void;
  isActive?: boolean;
  className?: string;
  showCount?: boolean;
}

const iconMap: Record<ReactionType, LucideIcon> = {
  like: ThumbsUp,
  love: Heart,
  comment: MessageCircle,
  share: Share2,
  bookmark: Bookmark,
};

const InteractiveReaction: React.FC<InteractiveReactionProps> = ({
  reactionType,
  count,
  onReact,
  isActive = false,
  className,
  showCount = true,
}) => {
  const [prevCount, setPrevCount] = useState(count);
  const controls = useAnimation();
  const Icon = iconMap[reactionType];

  useEffect(() => {
    if (count !== prevCount) {
      setPrevCount(count);
      // Trigger a small bump animation on count change
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.2 }
      });
    }
  }, [count, prevCount, controls]);

  const handleClick = () => {
    if (onReact) {
      onReact();
    }
    
    // Trigger specific animation based on type
    if (reactionType === 'love') {
      controls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.4, type: "spring" }
      });
    } else if (reactionType === 'like') {
      controls.start({
        rotate: [0, -20, 20, -10, 0],
        transition: { duration: 0.5 }
      });
    } else {
      controls.start({
        scale: [1, 0.9, 1.1, 1],
        transition: { duration: 0.3 }
      });
    }
  };

  // Color mapping
  const activeColorClass: Record<ReactionType, string> = {
    like: 'text-blue-500',
    love: 'text-red-500',
    comment: 'text-green-500',
    share: 'text-indigo-500',
    bookmark: 'text-yellow-500',
  };

  const fillClass = isActive && ['love', 'like', 'bookmark'].includes(reactionType) ? "fill-current" : "";

  return (
    <motion.button
      className={cn(
        "group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50",
        isActive ? activeColorClass[reactionType] : "text-gray-500 dark:text-gray-400",
        className
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        animate={controls}
        className="relative flex items-center justify-center"
      >
        <Icon 
            size={20} 
            className={cn("transition-colors", fillClass)} 
        />
      </motion.div>
      
      {showCount && (
        <div className="relative h-5 min-w-[1ch] flex flex-col justify-center overflow-hidden">
             <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  initial={{ y: count > prevCount ? 15 : -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: count > prevCount ? -15 : 15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="font-medium text-sm leading-none"
                >
                  {count}
                </motion.span>
             </AnimatePresence>
        </div>
      )}
    </motion.button>
  );
};

export default InteractiveReaction;