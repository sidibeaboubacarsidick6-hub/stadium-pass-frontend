import { useEffect, useState } from 'react'
import { Loader2, Plus, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getOrganizerMatches, type OrganizerMatch } from '@/lib/organizer-api'

function formatKickoff(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programmé',
  on_sale: 'En vente',
  live: 'En cours',
  finished: 'Terminé',
  cancelled: 'Annulé',
}

export function OrganizerMatchesPage() {
  const [matches, setMatches] = useState<OrganizerMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getOrganizerMatches()
      .then((d) => { if (!cancelled) setMatches(d) })
      .catch((e) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Matchs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {matches.length} match{matches.length > 1 ? 's' : ''} dans votre organisation
          </p>
        </div>
        <Link to="/organizer/matches/new">
          <Button className="gap-2 bg-orange text-white hover:bg-orange-dark">
            <Plus className="size-4" aria-hidden="true" />
            Nouveau match
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-4"><p className="text-sm text-destructive">{error}</p></Card>
      )}

      {!error && matches.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12">
          <CalendarDays className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucun match pour l&apos;instant.</p>
        </Card>
      )}

      {matches.length > 0 && (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Match</th>
                <th className="px-4 py-3 font-medium">Compétition</th>
                <th className="px-4 py-3 font-medium">Stade</th>
                <th className="px-4 py-3 font-medium">Kickoff</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Billets</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.uuid} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {m.home_team_name} <span className="text-muted-foreground">vs</span> {m.away_team_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.competition_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.venue_name}</td>
                  <td className="px-4 py-3 tabular-nums">{formatKickoff(m.kickoff_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{STATUS_LABELS[m.status] || m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{m.tickets_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default OrganizerMatchesPage
