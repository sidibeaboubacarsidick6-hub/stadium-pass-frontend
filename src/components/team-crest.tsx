import { cn } from '@/lib/utils'

interface TeamCrestProps {
  name: string
  className?: string
}

export function TeamCrest({ name, className }: TeamCrestProps) {
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
        'flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-white/15 to-white/5 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <span className="text-sm font-black tracking-tight text-white">
        {initials || '?'}
      </span>
    </div>
  )
}
