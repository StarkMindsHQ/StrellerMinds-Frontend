'use client';

import React, { useState } from 'react';
import { TransactionStatusTracker } from './TransactionStatusTracker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

/**
 * Example usage for TransactionStatusTracker.
 * Demonstrates simulation of hashing and transaction lifecycle.
 */
export const TransactionStatusTrackerExample: React.FC = () => {
  const [activeTxHash, setActiveTxHash] = useState<`0x${string}` | undefined>();
  const [description, setDescription] = useState('Enrolling in Stellar Advanced Course');

  const simulateTransaction = () => {
    // Generate a random mock hash
    const mockHash = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}` as `0x${string}`;
    setActiveTxHash(mockHash);
    toast.info('Transaction submitted to blockchain');
  };

  const handleConfirmed = (receipt: any) => {
    console.log('Transaction Confirmed:', receipt);
    // You could update global state or trigger a refresh here
  };

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>Transaction Simulation Lab</CardTitle>
          <CardDescription>
            Test the real-time tracker by submitting a mock transaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tx-desc">Transaction Description</Label>
            <Input 
              id="tx-desc" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Buying Course #123"
            />
          </div>
          <Button 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
            onClick={simulateTransaction}
            disabled={!!activeTxHash}
          >
            {activeTxHash ? 'Transaction Pending...' : 'Simulate Submission'}
          </Button>

          {activeTxHash && (
             <Button 
              variant="link" 
              className="w-full text-xs opacity-60"
              onClick={() => setActiveTxHash(undefined)}
            >
              Reset for Next Lab Test
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Real-Time Tracker Widget Area */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">
          Active Monitoring
        </h3>
        
        <TransactionStatusTracker 
          txHash={activeTxHash}
          description={description}
          onConfirmed={handleConfirmed}
          onFailed={(err) => console.error(err)}
          autoHide={true}
          autoHideDuration={8000}
        />

        {!activeTxHash && (
          <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground opacity-30">
            <p className="text-sm italic">Status: Monitoring system idle</p>
          </div>
        )}
      </div>
    </div>
  );
};
