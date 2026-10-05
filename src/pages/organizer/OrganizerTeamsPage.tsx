import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getOrganizerTeams, createTeam,
  type OrganizerTeam,
} from '@/lib/organizer-api'

const EMPTY_FORM = {
  name: '',
  short_name: '',
  city: '',
  founded_year: '',
  president_name: '',
}

export function OrganizerTeamsPage() {
  const [items, setItems] = useState<OrganizerTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOrganizerTeams()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const created = await createTeam({
        name: form.name.trim(),
        short_name: form.short_name.trim().toUpperCase(),
        city: form.city.trim() || undefined,
        founded_year: form.founded_year ? Number(form.founded_year) : undefined,
        president_name: form.president_name.trim() || undefined,
      })
      setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      setForm(EMPTY_FORM)
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
          <h1 className="text-2xl font-bold">Équipes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} équipe{items.length > 1 ? 's' : ''}</p>
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
                <Label htmlFor="t-name">Nom complet *</Label>
                <Input id="t-name" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ASEC Mimosas" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-short">Code court *</Label>
                <Input id="t-short" required maxLength={8} value={form.short_name}
                  onChange={(e) => setForm({ ...form, short_name: e.target.value })}
                  placeholder="ASEC" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-city">Ville</Label>
                <Input id="t-city" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Abidjan" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-founded">Année de fondation</Label>
                <Input id="t-founded" type="number" min="1900" max="2100" value={form.founded_year}
                  onChange={(e) => setForm({ ...form, founded_year: e.target.value })}
                  placeholder="1948" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="t-president">Président</Label>
                <Input id="t-president" value={form.president_name}
                  onChange={(e) => setForm({ ...form, president_name: e.target.value })}
                  placeholder="Nom du président" />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !form.name.trim() || !form.short_name.trim()}>
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
          <Users className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucune équipe pour l&apos;instant.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Fondation</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.uuid} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{t.short_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.city || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{t.founded_year || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default OrganizerTeamsPage
