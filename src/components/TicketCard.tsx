import {
  Armchair,
  CalendarPlus,
  Clock,
  DoorOpen,
  Download,
  LandPlot,
  MapPin,
  Rows3,
  Ticket,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TicketQrPlaceholder } from '@/components/ticket-qr-placeholder'
import { TeamCrest } from '@/components/team-crest'
import { cn } from '@/lib/utils'

export type TicketCategory = 'VIP' | 'Tribune' | 'Populaire'

export interface TicketCardProps {
  matchTitle: string
  teamA: string
  teamB: string
  date: string
  time: string
  venue: string
  category: TicketCategory
  seat: string
  row: string
  gate: string
  block: string
  ticketNumber: string
  qrData?: string
  qrImageUrl?: string | null
  className?: string
  // 🆕 Actions
  onDownloadPdf?: () => void
  onAddToCalendar?: () => void
  onPrint?: () => void
}

const categoryStyles: Record<TicketCategory, string> = {
  VIP: 'bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950 shadow-[0_0_18px_-2px_rgba(251,191,36,0.6)]',
  Tribune: 'bg-gradient-to-r from-sky-300 to-cyan-400 text-sky-950 shadow-[0_0_18px_-2px_rgba(56,189,248,0.5)]',
  Populaire: 'bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-[0_0_18px_-2px_rgba(251,113,133,0.5)]',
}

const NOTCH_RADIUS = 14

const notch = (x: string, y: string) =>
  `radial-gradient(circle at ${x} ${y}, transparent ${NOTCH_RADIUS}px, #000 ${NOTCH_RADIUS + 0.5}px)`

const tornEdgeMask: CSSProperties = {
  maskImage: [notch('0', '30%'), notch('100%', '30%'), notch('0', '70%'), notch('100%', '70%')].join(', '),
  WebkitMaskImage: [notch('0', '30%'), notch('100%', '30%'), notch('0', '70%'), notch('100%', '70%')].join(', '),
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
}

export function TicketCard({
  matchTitle,
  teamA,
  teamB,
  date,
  time,
  venue,
  category,
  seat,
  row,
  gate,
  block,
  ticketNumber,
  qrData,
  qrImageUrl,
  className,
  onDownloadPdf,
  onAddToCalendar,
  onPrint,
}: TicketCardProps) {
  return (
    <article
      aria-label={`Billet ${category} – ${matchTitle}`}
      className={cn(
        'group relative w-full max-w-[380px] transition-all duration-300 ease-out',
        'drop-shadow-[0_18px_30px_rgba(10,92,58,0.28)] hover:-translate-y-1.5 hover:drop-shadow-[0_28px_40px_rgba(10,92,58,0.42)]',
        className,
      )}
    >
      <div
        style={tornEdgeMask}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0a5c3a] via-[#083d28] to-[#0d0d0d] text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(90deg,#fff_0_28px,transparent_28px_56px)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
        />

        <div className="relative flex flex-col px-7 pt-6 pb-7">
          <header className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
              <Ticket className="size-3.5" aria-hidden="true" />
              Ligue 1 · CI
            </span>
            <Badge className={cn('h-6 border-0 px-3 text-[11px] font-bold uppercase tracking-wider', categoryStyles[category])}>
              {category}
            </Badge>
          </header>

          <div className="mt-6 flex items-center justify-between gap-3">
            <TeamCrest name={teamA} tone="home" />
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-black italic tracking-tight backdrop-blur">
              VS
            </span>
            <TeamCrest name={teamB} tone="away" />
          </div>

          <h2 className="mt-5 text-balance text-center text-xl font-bold leading-tight tracking-tight">{matchTitle}</h2>

          <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-white/80">
            <div className="flex items-center justify-center gap-2">
              <dt className="sr-only">Date et heure</dt>
              <Clock className="size-4 text-emerald-300" aria-hidden="true" />
              <dd>
                {date} · <span className="font-semibold text-white">{time}</span>
              </dd>
            </div>
            <div className="flex items-center justify-center gap-2">
              <dt className="sr-only">Stade</dt>
              <MapPin className="size-4 text-emerald-300" aria-hidden="true" />
              <dd className="text-pretty text-center">Stade {venue}</dd>
            </div>
          </dl>

          <div aria-hidden="true" className="relative my-6 -mx-7">
            <div className="mx-5 border-t-2 border-dashed border-white/20" />
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl bg-white p-3 shadow-[0_0_0_6px_rgba(255,255,255,0.06)] transition-transform duration-300 group-hover:scale-[1.03]">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt={`QR code du billet ${ticketNumber}`}
                  className="aspect-square w-full max-w-[180px] rounded-lg"
                />
              ) : (
                <TicketQrPlaceholder seed={qrData ?? ticketNumber} />
              )}
            </div>
          </div>

          <section
            aria-labelledby={`access-${ticketNumber}`}
            className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/30"
          >
            <h3
              id={`access-${ticketNumber}`}
              className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-200/80"
            >
              Accès
            </h3>
            <dl className="grid grid-cols-2">
              <AccessInfo icon={DoorOpen} label="Porte" value={`Porte ${gate}`} className="border-r border-b" />
              <AccessInfo icon={LandPlot} label="Tribune" value={`Bloc ${block}`} className="border-b" />
              <AccessInfo icon={Rows3} label="Rangée" value={`Rangée ${row}`} className="border-r" />
              <AccessInfo icon={Armchair} label="Siège" value={`Siège ${seat}`} />
            </dl>
            <dl className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-4 py-2.5">
              <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">N° billet</dt>
              <dd className="font-mono text-sm font-semibold tracking-wider text-emerald-200">{ticketNumber}</dd>
            </dl>
          </section>

          <div className="mt-5 flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={onDownloadPdf}
              className="h-11 w-full border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              <Download aria-hidden="true" />
              Télécharger PDF
            </Button>
            <Button
              variant="ghost"
              onClick={onAddToCalendar}
              className="h-11 w-full text-emerald-200 hover:bg-emerald-400/10 hover:text-emerald-100"
            >
              <CalendarPlus aria-hidden="true" />
              Ajouter au calendrier
            </Button>
            <Button
              variant="ghost"
              onClick={onPrint}
              className="h-11 w-full text-white/60 hover:bg-white/5 hover:text-white"
            >
              🖨️ Imprimer
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

interface AccessInfoProps {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

function AccessInfo({ icon: Icon, label, value, className }: AccessInfoProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3 border-white/10 px-4 py-3', className)}>
      <Icon className="size-4 shrink-0 text-emerald-300/60" aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/70">{label}</dt>
        <dd className="truncate text-sm font-bold text-white">{value}</dd>
      </div>
    </div>
  )
}
