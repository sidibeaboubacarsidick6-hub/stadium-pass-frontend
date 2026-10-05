import { cn } from '@/lib/utils'

interface TeamCrestProps {
  name: string
  tone?: 'home' | 'away'
  className?: string
}

export function TeamCrest({ name, tone = 'home', className }: TeamCrestProps) {
  // Récupère les 2-3 premières lettres significatives
  const initials = name
    .split(' ')
    .filter((w) => w.length > 2 || w === name.split(' ')[0])
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-sm',
        tone === 'home'
          ? 'border-emerald-400/40 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10'
          : 'border-orange-400/40 bg-gradient-to-br from-orange-400/20 to-orange-600/10',
        className
      )}
    >
      <span className="text-sm font-black tracking-tight text-white">
        {initials || '?'}
      </span>
    </div>
  )
}