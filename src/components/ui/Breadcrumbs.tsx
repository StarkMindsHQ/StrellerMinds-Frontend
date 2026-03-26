'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbProps) {
  const pathname = usePathname();

  // Split path and filter out empty segments
  const segments = pathname.split('/').filter((segment) => segment !== '');

  // Function to format labels (e.g., "my-course" -> "My Course")
  const formatLabel = (segment: string) => {
    return segment
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (pathname === '/') return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar',
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors duration-200 group"
      >
        <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
          <Home className="w-4 h-4" />
        </div>
        <span className="sr-only">Home</span>
      </Link>

      {segments.map((segment: string, index: number) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = formatLabel(segment);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[150px] md:max-w-[250px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-primary transition-colors duration-200 truncate max-w-[120px] md:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
