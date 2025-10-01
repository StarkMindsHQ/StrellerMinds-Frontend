'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function WalletConnect() {
  const [connected, setConnected] = useState(false);

  return (
    <Button
      onClick={() => setConnected((v) => !v)}
      variant={connected ? 'secondary' : 'default'}
    >
      {connected ? 'Wallet Connected' : 'Connect Wallet'}
    </Button>
  );
}
