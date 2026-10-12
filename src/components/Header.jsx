import Logo from './Logo.jsx'
import { Link } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo size="md" linkTo="/" />
        <Link
          to="/resultats"
          className="btn-ghost"
        >
          <BarChart3 className="w-4 h-4" />
          Résultats
        </Link>
      </div>
    </header>
  )
}
