import { Link } from 'react-router-dom'
import { Handshake } from 'lucide-react'

export default function Logo({ size = 'md', linkTo = null }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-sm' },
  }
  const s = sizes[size]

  const content = (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} flex shrink-0 items-center justify-center rounded-xl bg-primary-950 text-primary-400`}>
        <Handshake className="w-1/2 h-1/2" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`${s.text} font-bold text-primary-950`}>DRC Sponsoring Link</span>
        <span className={`${s.sub} font-medium text-neutral-500`}>Étude de marché · RDC</span>
      </div>
    </div>
  )

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>
  }
  return content
}
