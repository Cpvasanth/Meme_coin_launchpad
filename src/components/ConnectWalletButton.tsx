// components/ConnectWalletButton.tsx
'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ConnectWalletButton() {
  const { connected, publicKey } = useWallet()

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Wallet connected! 🥳')
      console.log('Public Key:', publicKey.toBase58())
    }
  }, [connected, publicKey])

  return <WalletMultiButton />
}
