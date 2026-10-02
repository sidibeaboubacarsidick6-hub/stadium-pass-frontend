import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Sélection', 'Informations', 'Paiement'] as const

export function Stepper({ current }: { current: number }) {
  return (
    <nav aria-label="Étapes de la commande">
      <ol className="flex items-start">
        {STEPS.map((label, index) => {
          const step = index + 1
          const isDone = step < current
          const isActive = step === current
          return (
            <li key={label} className={cn('flex items-start', index < STEPS.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-current={isActive ? 'step' : undefined}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300',
                    isActive && 'border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(10,92,58,0.12)]',
                    isDone && 'border-primary bg-primary text-primary-foreground',
                    !isActive && !isDone && 'border-border bg-muted text-muted-foreground',
                  )}
                >
                  {isDone ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : step}
                  <span className="sr-only">{isDone ? ' (terminée)' : isActive ? ' (en cours)' : ' (à venir)'}</span>
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive || isDone ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="mx-2 mt-[17px] h-0.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                  <div
                    className="h-full bg-primary transition-[width] duration-500 ease-out"
                    style={{ width: isDone ? '100%' : '0%' }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
