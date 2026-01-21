'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleWeb3Status } from '@/components/web3/SimpleWeb3Status';
import { SimpleStorageDemo } from '@/components/web3/SimpleStorageDemo';
import { TokenDemo } from '@/components/web3/TokenDemo';
import { NFTDemo } from '@/components/web3/NFTDemo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Coins, Image } from 'lucide-react';

export default function Web3FrontendPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Web3 Frontend Development</h1>
            <p className="text-muted-foreground">
              Learn to build modern Web3 applications with React and smart contract integration.
            </p>
          </div>
        </div>

        {/* Web3 Status */}
        <SimpleWeb3Status />
      </div>

      {/* Course Content */}
      <div className="grid gap-8 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Overview
            </CardTitle>
            <CardDescription>
              Master Web3 development through hands-on smart contract interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Code className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Smart Contract Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect and interact with Ethereum smart contracts using wagmi and viem
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Token & NFT Operations</h4>
                  <p className="text-sm text-muted-foreground">
                    Implement ERC20 token transfers and ERC721 NFT minting
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Image className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">DApp Architecture</h4>
                  <p className="text-sm text-muted-foreground">
                    Build decentralized applications with proper error handling
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Real-World Projects</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply concepts to practical Web3 application development
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Beginner</Badge>
              <span className="text-sm">Wallet connectivity</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Intermediate</Badge>
              <span className="text-sm">Contract interactions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Advanced</Badge>
              <span className="text-sm">DApp development</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Prerequisites</h4>
              <ul className="text-sm space-y-1">
                <li>• React fundamentals</li>
                <li>• Basic JavaScript/TypeScript</li>
                <li>• Understanding of blockchain concepts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demos */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Interactive Smart Contract Demos</h2>
        <Tabs defaultValue="storage" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="storage">Simple Storage</TabsTrigger>
            <TabsTrigger value="token">ERC20 Token</TabsTrigger>
            <TabsTrigger value="nft">NFT Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="storage" className="mt-6">
            <SimpleStorageDemo />
          </TabsContent>

          <TabsContent value="token" className="mt-6">
            <TokenDemo />
          </TabsContent>

          <TabsContent value="nft" className="mt-6">
            <NFTDemo />
          </TabsContent>
        </Tabs>
      </div>

      {/* Additional Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• <a href="#" className="text-blue-600 hover:underline">wagmi Documentation</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">viem Documentation</a></li>
                <li>• <a href="#" className="text-blue-600 hover:underline">Ethereum Developer Portal</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• MetaMask Browser Extension</li>
                <li>• Sepolia Testnet Faucet</li>
                <li>• Remix IDE</li>
                <li>• Hardhat Development Framework</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Ethereum Stack Exchange</li>
                <li>• Web3 Discord Community</li>
                <li>• GitHub Discussions</li>
                <li>• Developer Forums</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
