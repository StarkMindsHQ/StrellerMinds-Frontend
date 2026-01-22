'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useERC20Token } from '@/lib/web3/hooks';
import { Loader2, Send, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function TokenDemo() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [spender, setSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

  const {
    transfer,
    approve,
    balance,
    isPending,
    isReadingBalance,
    isConfirming,
    isConfirmed,
    hash,
  } = useERC20Token('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as `0x${string}`);

  const handleTransfer = () => {
    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }
    transfer(recipient as `0x${string}`, amount);
  };

  const handleApprove = () => {
    if (!spender || !approveAmount) {
      toast.error('Please fill in all fields');
      return;
    }
    approve(spender as `0x${string}`, approveAmount);
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
          ERC20 Token Contract
          <Badge variant="secondary">Learning Demo</Badge>
        </CardTitle>
        <CardDescription>
          Interact with an ERC20 token contract. Transfer tokens and approve spending.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium">Token Balance</Label>
          <div className="text-2xl font-bold mt-1">
            {isReadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </div>
            ) : (
              `${parseFloat(balance?.toString() || '0').toFixed(2)} Tokens`
            )}
          </div>
        </div>

        {/* Transfer Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-sm font-medium">Transfer Tokens</Label>
          <div className="space-y-2">
            <Input
              placeholder="Recipient address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button
              onClick={handleTransfer}
              disabled={isPending || isConfirming || !recipient || !amount}
              className="w-full"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isPending || isConfirming ? 'Transferring...' : 'Transfer Tokens'}
            </Button>
          </div>
        </div>

        {/* Approve Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-sm font-medium">Approve Spending</Label>
          <div className="space-y-2">
            <Input
              placeholder="Spender address (0x...)"
              value={spender}
              onChange={(e) => setSpender(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Input
              type="number"
              placeholder="Approval amount"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button
              onClick={handleApprove}
              disabled={isPending || isConfirming || !spender || !approveAmount}
              variant="outline"
              className="w-full"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isPending || isConfirming ? 'Approving...' : 'Approve Tokens'}
            </Button>
          </div>
        </div>

        {/* Transaction Status */}
        {(hash || isConfirming) && (
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Transaction Status</Label>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={viewOnExplorer}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Smart Contract Functions</Label>
          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`// Transfer function
function transfer(address recipient, uint256 amount) public returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
}

// Approve function
function approve(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
