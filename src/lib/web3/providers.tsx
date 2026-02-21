'use client';

import { WagmiProvider } from 'wagmi';
import { web3Config } from './simple-config';
import { ReactNode } from 'react';

export function Web3Provider({ children }: { children: ReactNode }) {
  return <WagmiProvider config={web3Config}>{children}</WagmiProvider>;
}
