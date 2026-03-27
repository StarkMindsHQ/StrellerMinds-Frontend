import React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'container' | 'full-width';
  padding?: 'none' | 'small' | 'medium' | 'large';
  background?: 'default' | 'gray' | 'transparent';
}

import { Breadcrumbs } from './ui/Breadcrumbs';

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  variant = 'container',
  padding = 'medium',
  background = 'default',
}) => {
  const baseClasses = 'min-h-screen';

  const backgroundClasses = {
    default: 'bg-background text-foreground',
    gray: 'bg-muted text-foreground',
    transparent: '',
  };

  const paddingClasses = {
    none: '',
    small: 'py-4',
    medium: 'py-8 md:py-12',
    large: 'py-12 md:py-16 lg:py-20',
  };

  const variantClasses = {
    default: 'container mx-auto px-4 sm:px-6 lg:px-8',
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    'full-width': '',
  };

  if (variant === 'full-width') {
    return (
      <main
        className={cn(
          baseClasses,
          backgroundClasses[background as keyof typeof backgroundClasses],
          className,
        )}
        id="main-content"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs />
        </div>
        {children}
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className={cn(
        baseClasses,
        backgroundClasses[background as keyof typeof backgroundClasses],
        className,
      )}
    >
      <div
        className={cn(
          variantClasses[variant as keyof typeof variantClasses],
          paddingClasses[padding as keyof typeof paddingClasses],
        )}
      >
        <Breadcrumbs />
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
