"use client"

import React, { useState } from "react"
import { TokenBalance } from "@/components/web3/TokenBalance"

export default function TokenBalanceTestPage() {
  const [balance, setBalance] = useState(125.45)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const handleRefresh = () => {
    setIsLoading(true)
    setError(null)
    
    // Simulate API call
    setTimeout(() => {
      const newBalance = +(balance + Math.random() * 10).toFixed(2)
      setBalance(newBalance)
      setLastUpdated(new Date())
      setIsLoading(false)
      
      // Randomly simulate error 10% of the time for testing
      if (Math.random() < 0.1) {
        setError(new Error("Network simulation error"))
      }
    }, 1500)
  }

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen bg-background text-foreground space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">TokenBalance Component</h1>
        <p className="text-muted-foreground">Demo of the premium blockchain balance display</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Success State */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Default / Success State</h2>
          <TokenBalance 
            balance={balance} 
            symbol="ETH" 
            isLoading={isLoading}
            onRefresh={handleRefresh}
            lastUpdated={lastUpdated}
            label="Ether Balance"
          />
        </div>

        {/* Loading State */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Initial Loading State</h2>
          <TokenBalance 
            isLoading={true}
            symbol="STRL"
            label="Streller Points"
          />
        </div>

        {/* Error State */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Error State</h2>
          <TokenBalance 
            error={new Error("Failed to fetch")}
            onRefresh={() => console.log("Retrying...")}
            label="Governance Tokens"
          />
        </div>

        {/* Compact / No Refresh */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Compact (No Refresh)</h2>
          <TokenBalance 
            balance="4,500.00" 
            symbol="USDT" 
            label="My USDT"
          />
        </div>
      </div>
      
      <div className="p-8 border border-border rounded-xl bg-card max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Glassmorphism:</strong> Uses backdrop-blur and semi-transparent borders.</li>
          <li><strong>Real-time:</strong> Tooltip shows relative "Last Sync" time (e.g., "Just now", "2m ago").</li>
          <li><strong>Animation:</strong> The refresh icon rotates during the loading phase.</li>
          <li><strong>Accessibility:</strong> Tooltip provides additional context for screen readers and power users.</li>
        </ul>
      </div>
    </div>
  )
}
