"use client"

import React from "react"
import { Button } from "@/components/ui/button"

type WalletConnectProps = React.ComponentProps<typeof Button>

export default function WalletConnect(props: WalletConnectProps) {
  return (
    <Button {...props}>
      Connect Wallet
    </Button>
  )
}


