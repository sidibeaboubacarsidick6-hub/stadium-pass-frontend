import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Confirmation } from './confirmation'
import { generateOrderNumber } from './format'
import { StepInformation } from './step-information'
import { StepPayment } from './step-payment'
import { StepSelection } from './step-selection'
import { Stepper } from './stepper'
import type { CheckoutFlowProps, CheckoutResult, CustomerInfo, PaymentMethodId } from './types'

type Step = 1 | 2 | 3 | 4

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
}

export function CheckoutFlow({
  match,
  categories,
  onComplete,
  onExit,
  onViewTicket,
  onGoHome,
  initialCategoryId,
  initialQuantity,
}: CheckoutFlowProps & { initialCategoryId?: number; initialQuantity?: number }) {
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState(1)
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId ?? null)
  const [quantity, setQuantity] = useState(initialQuantity ?? 2)
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptedTerms: false,
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [result, setResult] = useState<CheckoutResult | null>(null)

  const category = categories.find((c) => c.id === categoryId) ?? null

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (id: number) => {
    setCategoryId(id)
    const selected = categories.find((c) => c.id === id)
    if (selected) setQuantity((q) => Math.max(1, Math.min(q, selected.remaining, 10)))
  }

  const handleBack = () => {
    if (step === 1 || step === 4) onExit?.()
    else goTo((step - 1) as Step)
  }

  const handlePay = async () => {
    if (!category || !paymentMethod || !customer.acceptedTerms || isPaying) return
    setIsPaying(true)
    setPaymentError(null)
    try {
      const payload = {
        categoryId: category.id,
        quantity,
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        paymentMethod,
      }
      const response = onComplete
        ? await onComplete(payload)
        : { orderNumber: generateOrderNumber(), total: category.price * quantity }
      setResult(response)
      goTo(4)
    } catch (err) {
      setPaymentError(
        (err as Error).message ||
          'Le paiement a échoué. Veuillez réessayer ou choisir un autre moyen de paiement.',
      )
    } finally {
      setIsPaying(false)
    }
  }

  const ticketLabel = `${quantity} billet${quantity > 1 ? 's' : ''}`

  return (
    <Card className="mx-auto w-full max-w-[640px] gap-0 overflow-visible rounded-2xl border-0 bg-card py-0 shadow-[0_8px_32px_-12px_rgba(10,40,25,0.18)] ring-0">
      <header className="sticky top-0 z-10 flex flex-col gap-5 rounded-t-2xl border-b border-border bg-card/95 px-5 pt-5 pb-4 backdrop-blur sm:px-8 sm:pt-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleBack}
            disabled={isPaying || (step === 1 && !onExit) || step === 4}
            aria-label="Retour"
            className="-ml-2 rounded-full"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight sm:text-xl">
              {step === 4 ? 'Commande confirmée' : 'Finaliser la commande'}
            </h1>
            <p className="text-sm text-muted-foreground">{ticketLabel} • Paiement sécurisé</p>
          </div>
        </div>
        {step < 4 && <Stepper current={step} />}
      </header>

      <div className="overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {step === 1 && (
              <StepSelection
                match={match}
                categories={categories}
                categoryId={categoryId}
                quantity={quantity}
                onCategoryChange={handleCategoryChange}
                onQuantityChange={setQuantity}
                onContinue={() => category && goTo(2)}
              />
            )}
            {step === 2 && (
              <StepInformation
                value={customer}
                onChange={setCustomer}
                onBack={() => goTo(1)}
                onContinue={() => goTo(3)}
              />
            )}
            {step === 3 && category && (
              <StepPayment
                match={match}
                category={category}
                quantity={quantity}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onBack={() => goTo(2)}
                onPay={handlePay}
                isPaying={isPaying}
                error={paymentError}
              />
            )}
            {step === 4 && category && result && (
              <Confirmation
                orderNumber={result.orderNumber}
                matchTitle={match.title}
                categoryName={category.name}
                quantity={quantity}
                total={result.total}
                email={customer.email}
                onViewTicket={() => onViewTicket?.(result.orderNumber)}
                onGoHome={() => onGoHome?.()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default CheckoutFlow

