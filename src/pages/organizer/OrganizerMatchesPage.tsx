import { useEffect, useState } from 'react'
import { Loader2, Plus, CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getOrganizerMatches, deleteMatch, type OrganizerMatch,
} from '@/lib/organizer-api'

function formatKickoff(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  configuring: 'En configuration',
  on_sale: 'En vente',
  sold_out: 'Complet',
  closed: 'Vente fermée',
  cancelled: 'Annulé',
  played: 'Joué',
}

export function OrganizerMatchesPage() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<OrganizerMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null)

  useEffect(() => {
    getOrganizerMatches()
      .then(setMatches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (m: OrganizerMatch) => {
    const ok = window.confirm(
      `Supprimer le match ${m.home_team_name} vs ${m.away_team_name} ?\n\nCette action est irréversible.`,
    )
    if (!ok) return
    setDeletingUuid(m.uuid)
    setError(null)
    try {
      await deleteMatch(m.uuid)
      setMatches((prev) => prev.filter((x) => x.uuid !== m.uuid))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeletingUuid(null)
    }
  }

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
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {matches.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12">
          <CalendarDays className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucun match pour l&apos;instant.</p>
        </Card>
      ) : (
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
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => {
                const isDeleting = deletingUuid === m.uuid
                return (
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
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button" variant="ghost" size="icon"
                          onClick={() => navigate(`/organizer/matches/${m.uuid}/edit`)}
                          aria-label="Modifier"
                          className="size-8"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button" variant="ghost" size="icon"
                          onClick={() => handleDelete(m)}
                          disabled={isDeleting}
                          aria-label="Supprimer"
                          className="size-8 text-destructive hover:text-destructive"
                        >
                          {isDeleting
                            ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                            : <Trash2 className="size-4" aria-hidden="true" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default OrganizerMatchesPage