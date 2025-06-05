// app/layout.tsx

import type { Metadata } from 'next'
import Sidebar from '../components/Sidebar'
import CreateButton from '@/components/CreateButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import { WalletContextProvider } from '../contexts/WalletContext'
import '@solana/wallet-adapter-react-ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rugoff.fun',
  description: 'Create your memecoin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <WalletContextProvider>
          {/* Sidebar */}
          <Sidebar />

          {/* Content area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex justify-end items-center gap-4  p-4">
              <ConnectWalletButton />
              <CreateButton />
            </header>

            {/* Main content */}
            <main className="flex-1 px-2 overflow-auto">
              {children}
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  )
}
