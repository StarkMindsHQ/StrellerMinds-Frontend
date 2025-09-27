"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'container' | 'full-width';
  padding?: 'none' | 'small' | 'medium' | 'large';
  background?: 'default' | 'gray' | 'transparent';
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  variant = 'container',
  padding = 'medium',
  background = 'default'
}) => {
  const baseClasses = "min-h-screen";
  
  const backgroundClasses = {
    default: "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
    gray: "bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white",
    transparent: ""
  };

  const paddingClasses = {
    none: "",
    small: "py-4",
    medium: "py-8 md:py-12",
    large: "py-12 md:py-16 lg:py-20"
  };

  const variantClasses = {
    'default': "container mx-auto px-4 sm:px-6 lg:px-8",
    'container': "container mx-auto px-4 sm:px-6 lg:px-8",
    'full-width': ""
  };

  if (variant === 'full-width') {
    return (
      <main 
        className={cn(
          baseClasses,
          backgroundClasses[background],
          className
        )}
      >
        {children}
      </main>
    );
  }

  return (
    <main 
      className={cn(
        baseClasses,
        backgroundClasses[background],
        className
      )}
    >
      <div className={cn(
        variantClasses[variant],
        paddingClasses[padding]
      )}>
        {children}
      </div>
    </main>
  );
};

export default MainLayout; 