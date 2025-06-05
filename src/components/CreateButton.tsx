// components/CreateButton.tsx
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const CreateButton: React.FC = () => (
  <Link
    href="/Create"
    className={`
      ${inter.className}
      inline-block
      bg-[#FF6B6B]
      hover:bg-[#e25a5a]
      text-white
      font-medium
      py-2
      px-4
      rounded
      transition-colors
      duration-200
    `}
  >
    create new coin
  </Link>
)

export default CreateButton
