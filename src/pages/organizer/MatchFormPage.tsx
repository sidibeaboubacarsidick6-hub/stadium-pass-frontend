import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Loader2, Plus, Trash2, ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getOrganizerCompetitions, getOrganizerTeams, getOrganizerVenues,
  getOrganizerMatch, createMatch, updateMatch,
  type OrganizerCompetition, type OrganizerTeam, type OrganizerVenue,
  type TicketCategoryPayload,
} from '@/lib/organizer-api'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'configuring', label: 'En configuration' },
  { value: 'on_sale', label: 'En vente' },
  { value: 'sold_out', label: 'Complet' },
  { value: 'closed', label: 'Vente fermée' },
]

const EMPTY_CAT: TicketCategoryPayload = {
  name: '', price: 1000, total_quantity: 100, max_per_order: 5,
  block_label: '', description: '',
}

export function MatchFormPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()

  const [competitions, setCompetitions] = useState<OrganizerCompetition[]>([])
  const [teams, setTeams] = useState<OrganizerTeam[]>([])
  const [venues, setVenues] = useState<OrganizerVenue[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    competition: '', home_team: '', away_team: '', venue: '',
    kickoff_at: '', status: 'on_sale', tv_channel: '', description: '',
  })
  const [categories, setCategories] = useState<TicketCategoryPayload[]>([{ ...EMPTY_CAT }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const promises: Promise<unknown>[] = [
      getOrganizerCompetitions(),
      getOrganizerTeams(),
      getOrganizerVenues(),
    ]
    if (isEdit) promises.push(getOrganizerMatch(uuid!))

    Promise.all(promises)
      .then(([c, t, v, m]) => {
        setCompetitions(c as OrganizerCompetition[])
        setTeams(t as OrganizerTeam[])
        setVenues(v as OrganizerVenue[])

        if (isEdit && m) {
          const match = m as Awaited<ReturnType<typeof getOrganizerMatch>>
          const kickoff = new Date(match.kickoff_at).toISOString().slice(0, 16)
          setForm({
            competition: String(match.competition),
            home_team: String(match.home_team),
            away_team: String(match.away_team),
            venue: String(match.venue),
            kickoff_at: kickoff,
            status: match.status,
            tv_channel: match.tv_channel || '',
            description: match.description || '',
          })
          const cats = (match.ticket_categories || []).map((c) => ({
            name: c.name,
            price: Number(c.price),
            total_quantity: c.total_quantity,
            max_per_order: c.max_per_order,
            block_label: c.block_label || '',
            description: c.description || '',
          }))
          setCategories(cats.length > 0 ? cats : [{ ...EMPTY_CAT }])
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isEdit, uuid])

  const updateCat = (idx: number, patch: Partial<TicketCategoryPayload>) => {
    setCategories((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)))
  }
  const addCat = () => setCategories((prev) => [...prev, { ...EMPTY_CAT }])
  const removeCat = (idx: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const names = categories.map((c) => c.name.trim().toLowerCase())
    if (names.some((n) => !n)) { setError('Chaque catégorie doit avoir un nom.'); return }
    if (new Set(names).size !== names.length) { setError('Noms de catégories en double.'); return }
    if (categories.some((c) => c.price <= 0)) { setError('Prix invalide.'); return }
    if (categories.some((c) => c.total_quantity <= 0)) { setError('Quantité invalide.'); return }

    setSaving(true)
    try {
      const payload = {
        competition: Number(form.competition),
        home_team: Number(form.home_team),
        away_team: Number(form.away_team),
        venue: Number(form.venue),
        kickoff_at: new Date(form.kickoff_at).toISOString(),
        status: form.status,
        tv_channel: form.tv_channel.trim(),
        description: form.description.trim(),
        ticket_categories: categories.map((c) => ({
          ...c,
          name: c.name.trim(),
          block_label: c.block_label?.trim() || '',
          description: c.description?.trim() || '',
        })),
      }
      if (isEdit) await updateMatch(uuid!, payload)
      else await createMatch(payload)
      navigate('/organizer/matches')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
  }

  const ready = competitions.length > 0 && teams.length >= 2 && venues.length > 0

  const selectedVenue = venues.find((v) => String(v.id) === form.venue) || null
  const venueZones = selectedVenue?.zone_template ?? []
  const canImportZones = venueZones.length > 0

  const handleImportZones = () => {
    if (!selectedVenue || venueZones.length === 0) return

    const hasExistingData = categories.some((c) => c.name.trim() !== '')
    if (hasExistingData) {
      const ok = window.confirm(
        `Remplacer les ${categories.length} catégorie(s) actuelle(s) par les ${venueZones.length} zone(s) du stade « ${selectedVenue.name} » ?`,
      )
      if (!ok) return
    }

    setCategories(
      venueZones.map((z) => ({
        name: z.name,
        price: z.price_base,
        total_quantity: z.capacity,
        max_per_order: 5,
        block_label: z.name,
        description: '',
      })),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/organizer/matches')} aria-label="Retour">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Modifier le match' : 'Nouveau match'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit ? 'Éditer les informations et catégories de billets' : 'Créer un match avec ses catégories de billets'}
          </p>
        </div>
      </div>

      {!ready && (
        <Card className="p-5">
          <p className="text-sm text-destructive">
            Il faut au minimum <strong>1 compétition</strong>, <strong>2 équipes</strong> et <strong>1 stade</strong>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link to="/organizer/competitions" className="text-primary underline">Compétitions</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/organizer/teams" className="text-primary underline">Équipes</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/organizer/venues" className="text-primary underline">Stades</Link>
          </div>
        </Card>
      )}

      {ready && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 p-6">
            <h2 className="text-base font-semibold">Match</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Compétition *">
                <select required value={form.competition}
                  onChange={(e) => setForm({ ...form, competition: e.target.value })}
                  className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm">
                  <option value="">— Choisir —</option>
                  {competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Stade *">
                <select required value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm">
                  <option value="">— Choisir —</option>
                  {venues.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.city})</option>)}
                </select>
              </Field>
              <Field label="Équipe à domicile *">
                <select required value={form.home_team}
                  onChange={(e) => setForm({ ...form, home_team: e.target.value })}
                  className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm">
                  <option value="">— Choisir —</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Équipe à l'extérieur *">
                <select required value={form.away_team}
                  onChange={(e) => setForm({ ...form, away_team: e.target.value })}
                  className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm">
                  <option value="">— Choisir —</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Coup d'envoi *">
                <Input type="datetime-local" required value={form.kickoff_at}
                  onChange={(e) => setForm({ ...form, kickoff_at: e.target.value })} />
              </Field>
              <Field label="Statut">
                <select value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Chaîne TV" className="sm:col-span-2">
                <Input value={form.tv_channel}
                  onChange={(e) => setForm({ ...form, tv_channel: e.target.value })}
                  placeholder="RTI, Canal+ Sport…" />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl border border-input bg-card px-3.5 py-2 text-sm"
                  placeholder="Contexte du match, enjeux…" />
              </Field>
            </div>
          </Card>

          <Card className="flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Catégories de billets</h2>
                <p className="text-sm text-muted-foreground">
                  Au moins une catégorie
                  {canImportZones && selectedVenue && (
                    <> • <span className="text-primary">{venueZones.length} zone{venueZones.length > 1 ? 's' : ''} dispo dans « {selectedVenue.name} »</span></>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                {canImportZones && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImportZones}
                    className="gap-2"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Importer les zones
                  </Button>
                )}
                <Button type="button" variant="outline" size="sm" onClick={addCat}
                  disabled={categories.some((c) => !c.name.trim())} className="gap-2">
                  <Plus className="size-4" aria-hidden="true" />
                  Ajouter
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="rounded-xl border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Catégorie {idx + 1}</span>
                    {categories.length > 1 && (
                      <Button type="button" variant="ghost" size="icon"
                        onClick={() => removeCat(idx)}
                        aria-label="Supprimer cette catégorie"
                        className="text-destructive hover:text-destructive">
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nom *">
                      <Input required value={cat.name}
                        onChange={(e) => updateCat(idx, { name: e.target.value })}
                        placeholder="Populaire, VIP…" />
                    </Field>
                    <Field label="Prix (FCFA) *">
                      <Input required type="number" min="0" value={cat.price}
                        onChange={(e) => updateCat(idx, { price: Number(e.target.value) })} />
                    </Field>
                    <Field label="Quantité totale *">
                      <Input required type="number" min="1" value={cat.total_quantity}
                        onChange={(e) => updateCat(idx, { total_quantity: Number(e.target.value) })} />
                    </Field>
                    <Field label="Max par commande *">
                      <Input required type="number" min="1" value={cat.max_per_order}
                        onChange={(e) => updateCat(idx, { max_per_order: Number(e.target.value) })} />
                    </Field>
                    <Field label="Bloc / Zone" className="sm:col-span-2">
                      <Input value={cat.block_label ?? ''}
                        onChange={(e) => updateCat(idx, { block_label: e.target.value })}
                        placeholder="Virage Nord, Tribune…" />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {error && (
            <Card className="border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => navigate('/organizer/matches')}>
              Annuler
            </Button>
            <Button type="submit"
              disabled={saving || form.home_team === form.away_team}
              className="gap-2 bg-orange text-white hover:bg-orange-dark">
              {saving
                ? <><Loader2 className="size-4 animate-spin" /> {isEdit ? 'Enregistrement…' : 'Création…'}</>
                : (isEdit ? 'Enregistrer' : 'Créer le match')}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export default MatchFormPage