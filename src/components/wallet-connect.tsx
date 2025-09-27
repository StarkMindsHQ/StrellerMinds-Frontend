"use client";

import { useState } from 'react';

interface WalletConnectProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
}

export default function WalletConnect({ 
  variant = "default", 
  size = "md",
  className = ""
}: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };

  return (
    <button 
      onClick={() => setIsConnected(!isConnected)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isConnected ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
}