'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSimpleStorage } from '@/lib/web3/hooks';
import { Loader2, Save, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function SimpleStorageDemo() {
  const [inputValue, setInputValue] = useState('');
  const {
    storeValue,
    storedValue,
    isPending,
    isReading,
    isConfirming,
    isConfirmed,
    hash,
  } = useSimpleStorage();

  const handleStoreValue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }
    storeValue(value);
  };

  const viewOnExplorer = () => {
    if (hash) {
      window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Simple Storage Contract
          <Badge variant="secondary">Learning Demo</Badge>
        </CardTitle>
        <CardDescription>
          Interact with a simple storage smart contract. Store and retrieve
          values on the blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Current Stored Value
              </Label>
              <div className="text-2xl font-bold mt-1">
                {isReading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  storedValue?.toString() || '0'
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              disabled={isReading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isReading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <Label htmlFor="value-input">Store New Value</Label>
          <div className="flex gap-2">
            <Input
              id="value-input"
              type="number"
              placeholder="Enter a number to store"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button
              onClick={handleStoreValue}
              disabled={isPending || isConfirming || !inputValue}
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isPending || isConfirming ? 'Storing...' : 'Store Value'}
            </Button>
          </div>
        </div>

        {/* Transaction Status */}
        {(hash || isConfirming) && (
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Transaction Status
                </Label>
                <div className="mt-1">
                  {isConfirming ? (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Confirming transaction...</span>
                    </div>
                  ) : isConfirmed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span>Transaction confirmed!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Transaction submitted</span>
                    </div>
                  )}
                </div>
                {hash && (
                  <div className="mt-2 text-xs text-muted-foreground font-mono">
                    Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                  </div>
                )}
              </div>
              {hash && (
                <Button variant="outline" size="sm" onClick={viewOnExplorer}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium mb-2 block">
            Smart Contract Function
          </Label>
          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
            {`// Store value function
function store(uint256 _newValue) public {
    storedData = _newValue;
}

// Retrieve value function
function retrieve() public view returns (uint256) {
    return storedData;
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
