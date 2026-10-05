import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFCFA } from './format'
import type { MatchInfo, TicketCategory } from './types'

interface SelectionRecapProps {
  match: MatchInfo
  category: TicketCategory
  quantity: number
  onEdit: () => void
}

export function SelectionRecap({ match, category, quantity, onEdit }: SelectionRecapProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 p-3">
      <div className="flex min-w-0 flex-col gap-0.5 text-sm">
        <span className="truncate font-medium">
          {category.name} × {quantity}
        </span>
        <span className="truncate text-xs text-muted-foreground">{match.title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-semibold text-primary tabular-nums">
          {formatFCFA(category.price * quantity)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 gap-1.5 rounded-lg text-xs"
        >
          <Pencil className="size-3" aria-hidden="true" />
          Modifier
        </Button>
      </div>
    </div>
  )
}