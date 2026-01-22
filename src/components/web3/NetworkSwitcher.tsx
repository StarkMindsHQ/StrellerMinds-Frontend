'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { supportedChains, chainConfig } from '@/lib/web3/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const handleSwitchChain = (chainId: number) => {
    switchChain({ chainId });
  };

  const currentChain = supportedChains.find(chain => chain.id === chainId);
  const currentConfig = chainConfig[chainId as keyof typeof chainConfig];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentConfig && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentConfig.color }}
            />
          )}
          <span className="hidden sm:inline">
            {currentChain?.name || 'Unknown Network'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {supportedChains.map((chain) => {
          const config = chainConfig[chain.id as keyof typeof chainConfig];
          return (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleSwitchChain(chain.id)}
              disabled={isPending || chain.id === chainId}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config?.color }}
              />
              <span className="flex-1">{chain.name}</span>
              {chain.id === chainId && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
