'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  id: string | number;
  question: string;
  answer: React.ReactNode;
}

export interface FaqAccordionProps {
  /** The list of FAQ items to display */
  items: FaqItem[];
  /** Allow multiple accordions to be open at the same time. Default is true. */
  allowMultiple?: boolean;
  /** IDs of items that should be open by default */
  defaultOpenIds?: (string | number)[];
  /** Optional class name to customize the container */
  className?: string;
  /** Optional class name to customize individual accordion items */
  itemClassName?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  allowMultiple = true,
  defaultOpenIds = [],
  className,
  itemClassName,
}) => {
  const [openItems, setOpenItems] = useState<Set<string | number>>(
    new Set(defaultOpenIds),
  );

  const toggleItem = (id: string | number) => {
    setOpenItems((prev) => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        if (!allowMultiple) {
          newOpenItems.clear();
        }
        newOpenItems.add(id);
      }
      return newOpenItems;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string | number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  if (!items?.length) return null;

  return (
    <div
      className={cn('w-full max-w-4xl mx-auto flex flex-col gap-3', className)}
    >
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const headerId = `faq-header-${item.id}`;
        const contentId = `faq-content-${item.id}`;

        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={{
              backgroundColor: isOpen ? 'transparent' : 'transparent',
            }}
            className={cn(
              'group border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300',
              isOpen
                ? 'bg-blue-50/50 dark:bg-blue-900/10 shadow-sm border-blue-200 dark:border-blue-800/50'
                : 'bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700',
              itemClassName,
            )}
          >
            <button
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
            >
              <h3
                className={cn(
                  'text-base md:text-lg font-medium transition-colors duration-300',
                  isOpen
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white',
                )}
              >
                {item.question}
              </h3>
              <div
                className={cn(
                  'flex-shrink-0 ml-4 h-8 w-8 flex items-center justify-center rounded-full transition-colors duration-300',
                  isOpen
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700',
                )}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 pb-6 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
