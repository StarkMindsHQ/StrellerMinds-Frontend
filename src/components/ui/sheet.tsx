"use client";

import { ReactNode } from 'react';

export const Sheet = ({ children }: { children: ReactNode }) => children;

export const SheetContent = ({ 
  children, 
  className = "",
  side = "right"
}: { 
  children: ReactNode; 
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
}) => {
  const sideClasses = {
    left: "inset-y-0 left-0",
    right: "inset-y-0 right-0", 
    top: "inset-x-0 top-0",
    bottom: "inset-x-0 bottom-0"
  };

  return (
    <div className={`fixed ${sideClasses[side]} z-50 h-full w-3/4 border-l bg-background p-6 shadow-lg sm:max-w-sm ${className}`}>
      {children}
    </div>
  );
};

export const SheetHeader = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col space-y-2 text-center sm:text-left">{children}</div>
);

export const SheetTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const SheetTrigger = ({ 
  children, 
  asChild, 
  ...props 
}: { 
  children: ReactNode; 
  asChild?: boolean; 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  if (asChild) {
    return <>{children}</>;
  }
  return <button {...props}>{children}</button>;
};