'use client';

import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertCircle } from 'lucide-react';

// Temporary format functions
function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SimpleWeb3Status() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            Wallet Not Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Connect your wallet to start learning Web3 development
        </CardContent>
      </Card>
    );
  }

  const currentConfig = chainId
    ? {
        [1]: {
          name: 'Ethereum Mainnet',
          color: '#627EEA',
          explorer: 'https://etherscan.io',
        },
        [11155111]: {
          name: 'Sepolia Testnet',
          color: '#627EEA',
          explorer: 'https://sepolia.etherscan.io',
        },
      }[chainId]
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Address:</span>
          <span className="text-sm font-mono">
            {formatAddress(address || '')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {currentConfig && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentConfig.color }}
              />
            )}
            {currentConfig?.name || 'Unknown'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
