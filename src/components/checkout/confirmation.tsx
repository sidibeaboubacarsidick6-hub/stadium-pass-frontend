import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFCFA } from './format'

interface ConfirmationProps {
  orderNumber: string
  matchTitle: string
  categoryName: string
  quantity: number
  total: number
  email: string
  onViewTicket: () => void
  onGoHome: () => void
}

export function Confirmation({
  orderNumber,
  matchTitle,
  categoryName,
  quantity,
  total,
  email,
  onViewTicket,
  onGoHome,
}: ConfirmationProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex size-24 items-center justify-center rounded-full bg-primary shadow-[0_0_0_10px_rgba(10,92,58,0.1)]"
      >
        <svg viewBox="0 0 24 24" className="size-12 text-primary-foreground" fill="none" aria-hidden="true">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-2"
      >
        <h2 className="text-2xl font-bold text-balance">Votre billet est prêt !</h2>
        <p className="text-sm text-muted-foreground">
          Commande <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
        </p>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex w-full flex-col gap-2.5 rounded-2xl bg-muted p-4 text-left text-sm"
      >
        <SummaryRow label="Match" value={matchTitle} />
        <SummaryRow label="Catégorie" value={categoryName} />
        <SummaryRow label="Quantité" value={`${quantity} billet${quantity > 1 ? 's' : ''}`} />
        <div className="mt-1 flex items-baseline justify-between border-t border-border pt-3">
          <dt className="font-semibold">Total payé</dt>
          <dd className="text-xl font-bold text-primary tabular-nums">{formatFCFA(total)}</dd>
        </div>
      </motion.dl>

      <p className="flex items-center gap-2 text-sm text-muted-foreground text-pretty">
        <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          Un email de confirmation vous a été envoyé à{' '}
          <span className="font-medium text-foreground">{email}</span>
        </span>
      </p>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onViewTicket}
          className="h-12 w-full sm:w-auto sm:flex-1 rounded-xl bg-orange text-base font-semibold text-white hover:bg-orange-dark"
        >
          Voir mon billet
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGoHome}
          className="h-12 w-full sm:w-auto sm:flex-1 rounded-xl text-base"
        >
          {"Retour à l'accueil"}
        </Button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
