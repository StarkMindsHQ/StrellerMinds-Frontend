'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccount, useChainId } from 'wagmi';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  description: string;
  timestamp: number;
  gasUsed?: string;
  gasFee?: string;
}

export function TransactionManager() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`transactions_${address}`);
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    }
  }, [address]);

  // Save transactions to localStorage
  const saveTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    if (address) {
      localStorage.setItem(`transactions_${address}`, JSON.stringify(updated));
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
    if (address) {
      localStorage.removeItem(`transactions_${address}`);
    }
    toast.success('Transaction history cleared');
  };

  const viewOnExplorer = (hash: string) => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      11155111: 'https://sepolia.etherscan.io',
      5: 'https://goerli.etherscan.io',
    };
    const baseUrl = explorers[chainId] || explorers[1];
    window.open(`${baseUrl}/tx/${hash}`, '_blank');
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  // Expose function to add transactions globally
  useEffect(() => {
    (window as any).addTransaction = saveTransaction;
    return () => {
      delete (window as any).addTransaction;
    };
  }, [transactions]);

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Connect your wallet to view transaction history
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Track your Web3 transactions and their status
            </CardDescription>
          </div>
          {transactions.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearTransactions}>
              Clear History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">
              Start interacting with smart contracts to see your transaction
              history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatHash(tx.hash)} • {formatTimestamp(tx.timestamp)}
                    </div>
                    {tx.gasFee && (
                      <div className="text-xs text-muted-foreground">
                        Gas: {tx.gasFee} ETH
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(tx.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewOnExplorer(tx.hash)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
