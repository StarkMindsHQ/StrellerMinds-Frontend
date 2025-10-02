/* eslint-disable prettier/prettier */
'use client';
import React from 'react';
import Loading from './loading';

interface LoadingWrapperProps {
  isLoading: boolean;

  children: React.ReactNode;

  fallbackMessage?: string;

  className?: string;
}

export default function LoadingWrapper({
  isLoading,
  children,
  fallbackMessage = 'Loading...',
  className = '',
}: LoadingWrapperProps) {
  if (isLoading) {
    return <Loading message={fallbackMessage} className={className} />;
  }

  return <>{children}</>;
}
