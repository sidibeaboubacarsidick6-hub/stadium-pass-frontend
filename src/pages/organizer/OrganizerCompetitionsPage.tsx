import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Plus, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getOrganizerCompetitions, createCompetition,
  type OrganizerCompetition,
} from '@/lib/organizer-api'

export function OrganizerCompetitionsPage() {
  const [items, setItems] = useState<OrganizerCompetition[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getOrganizerCompetitions()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createCompetition({ name: name.trim(), type: type.trim() || undefined })
      setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      setName('')
      setType('')
      setShowForm(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Compétitions</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} compétition{items.length > 1 ? 's' : ''}</p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2 bg-orange text-white hover:bg-orange-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comp-name">Nom *</Label>
                <Input
                  id="comp-name" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Championnat de Côte d'Ivoire"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comp-type">Type</Label>
                <Input
                  id="comp-type" value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="championnat, coupe, amical…"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !name.trim()}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Créer'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12">
          <Trophy className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucune compétition pour l&apos;instant.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium text-right">Matchs</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.uuid} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.type || '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.matches_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default OrganizerCompetitionsPage
