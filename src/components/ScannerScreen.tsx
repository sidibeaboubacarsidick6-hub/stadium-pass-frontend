'use client'

import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  DoorOpen,
  Keyboard,
  MapPin,
  PhoneCall,
  Power,
  Search,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ScanResult = 'success' | 'already' | 'wrong_match' | 'not_found'

export interface ScanResultData {
  buyerName?: string
  category?: string
  seat?: string
  timestamp?: string
  otherMatch?: string
}

export interface ScannerScreenProps {
  matchTitle: string
  gate: string
  zone: string
  isOnline: boolean
  scannedCount: number
  validCount: number
  rejectedCount: number
  currentResult?: ScanResult | null
  currentResultData?: ScanResultData
  showTestBench?: boolean
  onBack?: () => void
  onManualEntry?: () => void
  onCallSupervisor?: () => void
  onEndSession?: () => void
}

const RESULT_DURATION_MS = 2000

const DEMO_DATA: Record<ScanResult, ScanResultData> = {
  success: { buyerName: 'Jean Dupont', category: 'VIP', seat: 'Rangée F Siège 24' },
  already: { timestamp: '18h42' },
  wrong_match: { otherMatch: 'ASEC vs SOA' },
  not_found: {},
}

interface ResultConfig {
  icon: LucideIcon
  title: string
  shortLabel: string
  surface: string
  foreground: string
  muted: string
  ring: string
  describe: (data: ScanResultData) => { primary?: string; secondary?: string }
}

const RESULT_CONFIG: Record<ScanResult, ResultConfig> = {
  success: {
    icon: CheckCircle,
    title: 'Entrée autorisée',
    shortLabel: 'Succès',
    surface: 'bg-[#0a5c3a]',
    foreground: 'text-white',
    muted: 'text-white/75',
    ring: 'border-white/30',
    describe: (d) => ({
      primary: d.buyerName,
      secondary: [d.category, d.seat].filter(Boolean).join(' — ') || undefined,
    }),
  },
  already: {
    icon: XCircle,
    title: 'Déjà scanné',
    shortLabel: 'Déjà scanné',
    surface: 'bg-[#b3261e]',
    foreground: 'text-white',
    muted: 'text-white/75',
    ring: 'border-white/30',
    describe: (d) => ({ secondary: d.timestamp ? `à ${d.timestamp} ce soir` : undefined }),
  },
  wrong_match: {
    icon: AlertTriangle,
    title: 'Mauvais match',
    shortLabel: 'Mauvais match',
    surface: 'bg-[#ff7a2b]',
    foreground: 'text-[#0d0d0d]',
    muted: 'text-[#0d0d0d]/75',
    ring: 'border-[#0d0d0d]/25',
    describe: (d) => ({
      secondary: d.otherMatch ? `Ce billet est pour ${d.otherMatch}` : undefined,
    }),
  },
  not_found: {
    icon: Search,
    title: 'Billet introuvable',
    shortLabel: 'Introuvable',
    surface: 'bg-[#3a3a3a]',
    foreground: 'text-white',
    muted: 'text-white/70',
    ring: 'border-white/20',
    describe: () => ({ secondary: "Ce billet n'existe pas dans le système" }),
  },
}

const numberFormatter = new Intl.NumberFormat('fr-FR')

interface ActiveResult {
  type: ScanResult
  data: ScanResultData
  id: number
}

export function ScannerScreen({
  matchTitle,
  gate,
  zone,
  isOnline,
  scannedCount,
  validCount,
  rejectedCount,
  currentResult = null,
  currentResultData,
  showTestBench = true,
  onBack,
  onManualEntry,
  onCallSupervisor,
  onEndSession,
}: ScannerScreenProps) {
  const [active, setActive] = useState<ActiveResult | null>(
    currentResult
      ? { type: currentResult, data: currentResultData ?? DEMO_DATA[currentResult], id: 0 }
      : null,
  )
  const [counts, setCounts] = useState({
    scanned: scannedCount,
    valid: validCount,
    rejected: rejectedCount,
  })

  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => setActive(null), RESULT_DURATION_MS)
    return () => clearTimeout(timer)
  }, [active])

  function simulate(type: ScanResult) {
    setActive({ type, data: DEMO_DATA[type], id: Date.now() })
    setCounts((c) => ({
      scanned: c.scanned + 1,
      valid: type === 'success' ? c.valid + 1 : c.valid,
      rejected: type === 'success' ? c.rejected : c.rejected + 1,
    }))
  }

  return (
    <div className="min-h-dvh bg-[#0d0d0d] text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <ScannerHeader
          matchTitle={matchTitle}
          gate={gate}
          zone={zone}
          isOnline={isOnline}
          onBack={onBack}
        />

        <main className="flex flex-1 flex-col">
          <CameraViewport onManualEntry={onManualEntry} />
          <ScanCounters {...counts} />

          <div className="flex flex-col gap-3 px-5 pb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={onCallSupervisor}
              className="h-12 border-[#ff7a2b] bg-transparent text-base font-semibold text-[#ff7a2b] hover:bg-[#ff7a2b]/10 hover:text-[#ff7a2b]"
            >
              <PhoneCall aria-hidden="true" />
              Appeler superviseur
            </Button>
            <Button
              size="lg"
              onClick={onEndSession}
              className="h-12 bg-[#0a5c3a]/60 text-base font-medium text-white/90 hover:bg-[#0a5c3a]"
            >
              <Power aria-hidden="true" />
              Terminer la session
            </Button>
          </div>

          {showTestBench && <TestBench onTrigger={simulate} />}
        </main>
      </div>

      <AnimatePresence>
        {active && <ResultOverlay key={active.id} type={active.type} data={active.data} />}
      </AnimatePresence>
    </div>
  )
}

function ScannerHeader({
  matchTitle,
  gate,
  zone,
  isOnline,
  onBack,
}: Pick<ScannerScreenProps, 'matchTitle' | 'gate' | 'zone' | 'isOnline' | 'onBack'>) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Retour"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <h1 className="truncate text-base font-bold tracking-tight">{matchTitle}</h1>
        </div>
        <OnlineStatus isOnline={isOnline} />
      </div>
      <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/70">
        <DoorOpen className="size-3.5 text-[#ff7a2b]" aria-hidden="true" />
        <span>Porte {gate}</span>
        <span aria-hidden="true" className="text-white/30">
          •
        </span>
        <MapPin className="size-3.5 text-[#ff7a2b]" aria-hidden="true" />
        <span>{zone}</span>
      </div>
    </header>
  )
}

function OnlineStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      role="status"
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        isOnline
          ? 'border-[#2fd17f]/30 bg-[#0a5c3a]/30 text-[#4ee59a]'
          : 'border-red-500/30 bg-red-500/10 text-red-400',
      )}
    >
      <span className="relative flex size-2">
        {isOnline && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4ee59a] opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex size-2 rounded-full',
            isOnline ? 'bg-[#4ee59a]' : 'bg-red-500',
          )}
        />
      </span>
      {isOnline ? 'En ligne' : 'Hors-ligne'}
    </div>
  )
}

function CameraViewport({ onManualEntry }: { onManualEntry?: () => void }) {
  return (
    <section
      aria-label="Zone de scan"
      className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden px-6 py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,122,43,0.08),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <p className="relative text-center text-sm font-medium text-white/80">
        Placez le QR code dans le cadre
      </p>

      <div className="relative aspect-square w-full max-w-[320px]">
        <div className="absolute inset-3 rounded-lg bg-white/[0.02] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />
        <ViewfinderCorners />
        <ScanLine />
      </div>

      <Button
        variant="ghost"
        onClick={onManualEntry}
        className="relative text-white/70 hover:bg-white/10 hover:text-white"
      >
        <Keyboard aria-hidden="true" />
        Saisie manuelle
      </Button>
    </section>
  )
}

function ViewfinderCorners() {
  const base = 'absolute size-[30px] border-[#ff7a2b]'
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className={cn(base, 'left-0 top-0 rounded-tl-lg border-l-4 border-t-4')} />
      <span className={cn(base, 'right-0 top-0 rounded-tr-lg border-r-4 border-t-4')} />
      <span className={cn(base, 'bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4')} />
      <span className={cn(base, 'bottom-0 right-0 rounded-br-lg border-b-4 border-r-4')} />
    </motion.div>
  )
}

function ScanLine() {
  return (
    <div aria-hidden="true" className="absolute inset-x-4 inset-y-4 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 h-16 -translate-y-full"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-full bg-gradient-to-b from-transparent to-[#ff7a2b]/25" />
        <div className="h-0.5 bg-[#ff7a2b] shadow-[0_0_12px_2px_rgba(255,122,43,0.8)]" />
      </motion.div>
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 })
  const display = useTransform(spring, (v) => numberFormatter.format(Math.round(v)))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

function ScanCounters({
  scanned,
  valid,
  rejected,
}: {
  scanned: number
  valid: number
  rejected: number
}) {
  const items = [
    { label: 'Scannés', value: scanned, color: 'text-white' },
    { label: 'Valides', value: valid, color: 'text-[#4ee59a]' },
    { label: 'Refusés', value: rejected, color: 'text-red-400' },
  ]
  return (
    <section aria-label="Compteurs de session" className="px-5 pb-5">
      <dl className="grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 py-4">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
              {item.label}
            </dt>
            <dd className={cn('text-2xl font-black tabular-nums', item.color)}>
              <AnimatedNumber value={item.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ResultOverlay({ type, data }: { type: ScanResult; data: ScanResultData }) {
  const config = RESULT_CONFIG[type]
  const Icon = config.icon
  const { primary, secondary } = config.describe(data)

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center px-8',
        config.surface,
        config.foreground,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <div className="relative mb-8 flex items-center justify-center">
          <motion.span
            aria-hidden="true"
            className={cn('absolute size-40 rounded-full border-2', config.ring)}
            initial={{ scale: 0.6, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <Icon className="relative size-32" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h2 className="text-balance text-4xl font-black uppercase tracking-tight">
          {config.title}
        </h2>
        {primary && <p className="mt-4 text-2xl font-bold">{primary}</p>}
        {secondary && (
          <p className={cn('mt-2 text-pretty text-lg font-medium', config.muted)}>{secondary}</p>
        )}
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/20">
        <motion.div
          className="h-full origin-left bg-current opacity-60"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: RESULT_DURATION_MS / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

function TestBench({ onTrigger }: { onTrigger: (type: ScanResult) => void }) {
  const types = Object.keys(RESULT_CONFIG) as ScanResult[]
  return (
    <section
      aria-labelledby="test-bench-title"
      className="border-t border-dashed border-white/15 px-5 pb-8 pt-5"
    >
      <h2
        id="test-bench-title"
        className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40"
      >
        Démo — simuler un scan
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {types.map((type) => {
          const config = RESULT_CONFIG[type]
          const Icon = config.icon
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTrigger(type)}
              className={cn(
                'flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg p-1 text-center text-[11px] font-bold leading-tight transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95',
                config.surface,
                config.foreground,
              )}
            >
              <Icon className="size-6" aria-hidden="true" />
              {config.shortLabel}
            </button>
          )
        })}
      </div>
    </section>
  )
}

