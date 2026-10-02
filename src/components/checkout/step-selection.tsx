import { motion } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatFCFA, formatNumber } from './format'
import { MatchSummary } from './match-summary'
import { MAX_QUANTITY, type MatchInfo, type TicketCategory } from './types'

interface StepSelectionProps {
  match: MatchInfo
  categories: TicketCategory[]
  categoryId: number | null
  quantity: number
  onCategoryChange: (id: number) => void
  onQuantityChange: (quantity: number) => void
  onContinue: () => void
}

export function StepSelection({
  match,
  categories,
  categoryId,
  quantity,
  onCategoryChange,
  onQuantityChange,
  onContinue,
}: StepSelectionProps) {
  const selected = categories.find((c) => c.id === categoryId) ?? null
  const maxQuantity = selected ? Math.min(MAX_QUANTITY, selected.remaining) : MAX_QUANTITY
  const total = selected ? selected.price * quantity : 0

  return (
    <div className="flex flex-col gap-6">
      <MatchSummary match={match} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-base font-semibold">Choisissez votre catégorie</legend>
        <div role="radiogroup" aria-label="Catégorie de billet" className="flex flex-col gap-3">
          {categories.map((category) => {
            const isSelected = category.id === categoryId
            return (
              <motion.button
                key={category.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={category.is_sold_out}
                onClick={() => onCategoryChange(category.id)}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className={cn(
                  'relative flex w-full items-center justify-between gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                  category.is_sold_out && 'cursor-not-allowed opacity-50',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
                    )}
                  >
                    {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.is_sold_out ? 'Épuisé' : `${formatNumber(category.remaining)} places`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-primary tabular-nums">{formatFCFA(category.price)}</span>
                  {category.is_sold_out ? (
                    <Badge variant="secondary">Complet</Badge>
                  ) : category.remaining < 1000 ? (
                    <Badge className="bg-orange/10 text-orange">Places limitées</Badge>
                  ) : null}
                </div>
              </motion.button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
        <div className="flex flex-col">
          <span id="quantity-label" className="font-semibold">
            Nombre de billets
          </span>
          <span className="text-sm text-muted-foreground">Maximum {maxQuantity} par commande</span>
        </div>
        <div role="group" aria-labelledby="quantity-label" className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Retirer un billet"
          >
            <Minus aria-hidden="true" />
          </Button>
          <span className="w-6 text-center text-lg font-bold tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            aria-label="Ajouter un billet"
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground">Total</span>
          <motion.span
            key={total}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-primary tabular-nums"
            aria-live="polite"
          >
            {formatFCFA(total)}
          </motion.span>
        </div>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className="h-12 w-full rounded-xl bg-orange text-base font-semibold text-white hover:bg-orange-dark"
        >
          {selected ? 'Continuer' : 'Sélectionnez une catégorie'}
        </Button>
      </div>
    </div>
  )
}
