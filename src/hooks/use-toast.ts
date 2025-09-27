import { useState } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: { 
    title?: string; 
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "destructive";
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...props };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  
  return { toast, toasts };
};