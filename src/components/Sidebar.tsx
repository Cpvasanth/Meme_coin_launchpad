// components/Sidebar.tsx
'use client'

import { FC, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface NavItem {
  label: string
  href: string
  icon?: string
}

const categories: NavItem[] = [
  { label: 'Home',     href: '/',          icon: '/home.svg' },
  { label: 'Advance',  href: '/advance',   icon: '/search.svg' },
  { label: 'Live',     href: '/live',      icon: '/radio.svg' },
]

const others: NavItem[] = [
  { label: 'Support Center', href: '/support',    icon: '/phone.svg' },
  { label: 'How to Use',     href: '/how-to-use', icon: '/notepad-text.svg' },
  { label: 'Settings',       href: '/settings',    icon: '/more-horizontal.svg' },
]

const Sidebar: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="sm:hidden flex items-center justify-between bg-[#252525] text-white px-4 py-3">
        <div className="flex items-center">
          <Image src="/rugoff_logo.png" alt="Rugoff.fun" width={32} height={32} />
          <span className="ml-2 text-lg font-semibold">Rugoff.fun</span>
        </div>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className="focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                open
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          ${inter.className}
          fixed inset-y-0 left-0 z-50 w-64 bg-[#252525] text-white
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:relative
        `}
        aria-label="Main navigation"
      >
        {/* Desktop Logo */}
        <div className="hidden sm:flex items-center px-4 py-6">
          <Image src="/rugoff_logo.png" alt="Rugoff.fun" width={32} height={32} />
          <span className="ml-3 text-xl font-semibold">Rugoff.fun</span>
        </div>

        <nav className="px-2">
          {/* Categories */}
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-xs font-semibold uppercase text-gray-400 px-2">
              Categories
            </h2>
            <ul className="mt-2 space-y-1">
              {categories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {item.icon && (
                      <span className="w-5 h-5 mr-3 flex-shrink-0">
                        <Image src={item.icon} alt="" width={20} height={20} />
                      </span>
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Others */}
          <section aria-labelledby="others-heading" className="mt-6">
            <h2 id="others-heading" className="text-xs font-semibold uppercase text-gray-400 px-2">
              Others
            </h2>
            <ul className="mt-2 space-y-1">
              {others.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center px-2 py-2 text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {item.icon && (
                      <span className="w-5 h-5 mr-3 flex-shrink-0">
                        <Image src={item.icon} alt="" width={20} height={20} />
                      </span>
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
