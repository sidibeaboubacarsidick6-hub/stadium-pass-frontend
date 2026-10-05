import { useEffect, useState } from 'react'
import { CalendarDays, Ticket, Wallet, TrendingUp, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getOrganizerDashboard, type OrganizerDashboard } from '@/lib/organizer-api'
import { formatFCFA } from '@/components/checkout/format'

export function DashboardPage() {
  const [data, setData] = useState<OrganizerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getOrganizerDashboard()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Dashboard error:', err)
        setError(err.message || 'Erreur de chargement')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">{error || 'Aucune donnée'}</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de {data.organization.name}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Matchs"
          value={data.matches.total}
          sub={`${data.matches.upcoming} à venir`}
          icon={CalendarDays}
          tone="primary"
        />
        <KpiCard
          label="Billets vendus"
          value={data.tickets.sold}
          icon={Ticket}
          tone="orange"
        />
        <KpiCard
          label="Revenus"
          value={formatFCFA(data.revenue.total)}
          icon={Wallet}
          tone="emerald"
        />
        <KpiCard
          label="Org"
          value={data.organization.slug}
          sub="slug public"
          icon={TrendingUp}
          tone="muted"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-base font-semibold">Raccourcis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Les pages Matchs, Compétitions, Stades et Équipes arrivent en Phase 5.
        </p>
      </Card>
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  icon: typeof CalendarDays
  tone: 'primary' | 'orange' | 'emerald' | 'muted'
}

const TONES: Record<KpiCardProps['tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  orange: 'bg-orange/10 text-orange',
  emerald: 'bg-emerald-brand/10 text-emerald-brand',
  muted: 'bg-muted text-muted-foreground',
}

function KpiCard({ label, value, sub, icon: Icon, tone }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
        <span className={`flex size-10 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  )
}

export default DashboardPage
