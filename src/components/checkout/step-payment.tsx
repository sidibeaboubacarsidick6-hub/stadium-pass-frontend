import { motion } from 'framer-motion'
import { Check, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatFCFA } from './format'
import { PAYMENT_METHODS, type MatchInfo, type PaymentMethodId, type TicketCategory } from './types'

interface StepPaymentProps {
  match: MatchInfo
  category: TicketCategory
  quantity: number
  paymentMethod: PaymentMethodId | null
  onPaymentMethodChange: (id: PaymentMethodId) => void
  onBack: () => void
  onPay: () => void
  isPaying: boolean
  error: string | null
}

const FEES = 0

export function StepPayment({
  match,
  category,
  quantity,
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onPay,
  isPaying,
  error,
}: StepPaymentProps) {
  const subtotal = category.price * quantity
  const total = subtotal + FEES

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="recap-title" className="rounded-2xl border border-border p-4">
        <h2 id="recap-title" className="mb-3 text-base font-semibold">
          Récapitulatif
        </h2>
        <dl className="flex flex-col gap-2.5 text-sm">
          <Row label="Match" value={match.title} />
          <Row label="Catégorie" value={`${category.name} × ${quantity}`} />
          <Row label="Sous-total" value={formatFCFA(subtotal)} />
          <Row label="Frais" value={formatFCFA(FEES)} />
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-border pt-4">
          <span className="font-semibold">TOTAL</span>
          <span className="text-3xl font-bold text-primary tabular-nums">{formatFCFA(total)}</span>
        </div>
      </section>

      <fieldset>
        <legend className="mb-3 text-base font-semibold">Moyen de paiement</legend>
        <div role="radiogroup" aria-label="Moyen de paiement" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = method.id === paymentMethod
            return (
              <motion.button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isPaying}
                onClick={() => onPaymentMethodChange(method.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-card px-2 py-4 text-center transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={cn('flex size-10 items-center justify-center rounded-xl text-xs font-bold', method.swatch)}
                >
                  {method.short}
                </span>
                <span className="text-sm font-medium">{method.label}</span>
              </motion.button>
            )
          })}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isPaying}
          className="h-12 rounded-xl text-base sm:w-32"
        >
          Retour
        </Button>
        <Button
          type="button"
          onClick={onPay}
          disabled={!paymentMethod || isPaying}
          aria-busy={isPaying}
          className="h-12 w-full sm:w-auto sm:flex-1 gap-2 rounded-xl bg-orange text-base font-semibold text-white hover:bg-orange-dark"
        >
          {isPaying ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Paiement en cours…
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden="true" />
              {paymentMethod ? `Payer ${formatFCFA(total)}` : 'Choisissez un moyen de paiement'}
            </>
          )}
        </Button>
      </div>
      <p className="-mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        Transaction chiffrée et sécurisée
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium tabular-nums">{value}</dd>
    </div>
  )
}
