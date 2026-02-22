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
import { useNFTContract } from '@/lib/web3/hooks';
import { Loader2, Send, Image, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function NFTDemo() {
  const [recipient, setRecipient] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenURI, setTokenURI] = useState(
    'https://gateway.pinata.cloud/ipfs/QmExample',
  );

  const {
    mintNFT,
    transferNFT,
    tokenURI: storedTokenURI,
    balance,
    isPending,
    isReading,
    isReadingBalance,
    isConfirming,
    isConfirmed,
    hash,
  } = useNFTContract(
    '0xfedcbafedcbafedcbafedcbafedcbafedcbafed' as `0x${string}`,
  );

  const handleMint = () => {
    if (!tokenURI) {
      toast.error('Please provide a token URI');
      return;
    }
    mintNFT(tokenURI);
  };

  const handleTransfer = () => {
    if (!recipient || !tokenId) {
      toast.error('Please fill in all fields');
      return;
    }
    transferNFT(recipient as `0x${string}`, parseInt(tokenId));
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
          NFT Contract (ERC-721)
          <Badge variant="secondary">Learning Demo</Badge>
        </CardTitle>
        <CardDescription>
          Interact with an NFT contract. Mint new NFTs and transfer ownership.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium">NFT Balance</Label>
          <div className="text-2xl font-bold mt-1">
            {isReadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </div>
            ) : (
              `${balance?.toString() || '0'} NFTs`
            )}
          </div>
        </div>

        {/* Token URI Display */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-sm font-medium">
            Current Token URI (Token ID: 1)
          </Label>
          <div className="mt-1 p-2 bg-background rounded border text-xs font-mono break-all">
            {isReading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              (storedTokenURI as string | undefined) || 'No token URI found'
            )}
          </div>
        </div>

        {/* Mint Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-sm font-medium">Mint New NFT</Label>
          <div className="space-y-2">
            <Input
              placeholder="Token URI (IPFS link)"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button
              onClick={handleMint}
              disabled={isPending || isConfirming || !tokenURI}
              className="w-full"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Image className="h-4 w-4 mr-2" />
              )}
              {isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
            </Button>
          </div>
        </div>

        {/* Transfer Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <Label className="text-sm font-medium">Transfer NFT</Label>
          <div className="space-y-2">
            <Input
              placeholder="Recipient address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Input
              type="number"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <Button
              onClick={handleTransfer}
              disabled={isPending || isConfirming || !recipient || !tokenId}
              variant="outline"
              className="w-full"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isPending || isConfirming ? 'Transferring...' : 'Transfer NFT'}
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
            Smart Contract Functions
          </Label>
          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
            {`// Mint NFT function
function mintNFT(string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    return newItemId;
}

// Transfer function
function safeTransferFrom(address from, address to, uint256 tokenId) public {
    _safeTransfer(from, to, tokenId, "");
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
