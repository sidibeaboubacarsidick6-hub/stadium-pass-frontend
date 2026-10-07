import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Plus, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getOrganizerVenues, createVenue,
  type OrganizerVenue, type VenueZone,
} from '@/lib/organizer-api'

const EMPTY_ZONE: VenueZone = { name: '', capacity: 1000, price_base: 1000 }

const EMPTY_FORM = {
  name: '',
  city: '',
  address: '',
  capacity: '',
}

export function OrganizerVenuesPage() {
  const [items, setItems] = useState<OrganizerVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [zones, setZones] = useState<VenueZone[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOrganizerVenues()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const updateZone = (idx: number, patch: Partial<VenueZone>) => {
    setZones((prev) => prev.map((z, i) => (i === idx ? { ...z, ...patch } : z)))
  }
  const addZone = () => setZones((prev) => [...prev, { ...EMPTY_ZONE }])
  const removeZone = (idx: number) =>
    setZones((prev) => prev.filter((_, i) => i !== idx))

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setZones([])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation locale des zones
    const zNames = zones.map((z) => z.name.trim().toLowerCase())
    if (zNames.some((n) => !n)) {
      setError('Chaque zone doit avoir un nom.')
      return
    }
    if (new Set(zNames).size !== zNames.length) {
      setError('Noms de zones en double.')
      return
    }

    setSaving(true)
    try {
      const created = await createVenue({
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim() || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        zone_template: zones.length > 0 ? zones : undefined,
      })
      setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
      resetForm()
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
          <h1 className="text-2xl font-bold">Stades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} stade{items.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2 bg-orange text-white hover:bg-orange-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nouveau
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h2 className="text-base font-semibold">Informations du stade</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="v-name">Nom *</Label>
                <Input id="v-name" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Stade Félix Houphouët-Boigny" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="v-city">Ville *</Label>
                <Input id="v-city" required value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Abidjan" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="v-address">Adresse</Label>
                <Input id="v-address" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="v-capacity">Capacité totale</Label>
                <Input id="v-capacity" type="number" min="0" value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="35000" />
              </div>
            </div>

            {/* Zones */}
            <div className="rounded-xl border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Zones par défaut</h3>
                  <p className="text-xs text-muted-foreground">
                    Elles seront copiées automatiquement dans les matchs organisés dans ce stade.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addZone}
                  className="gap-2">
                  <Plus className="size-4" aria-hidden="true" />
                  Ajouter une zone
                </Button>
              </div>

              {zones.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Aucune zone. Ajoutez-en pour gagner du temps sur les matchs.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {zones.map((z, idx) => (
                    <div key={idx}
                      className="grid grid-cols-12 items-end gap-2 rounded-lg bg-muted/30 p-3">
                      <div className="col-span-12 sm:col-span-5">
                        <Label className="text-xs">Nom *</Label>
                        <Input required value={z.name}
                          onChange={(e) => updateZone(idx, { name: e.target.value })}
                          placeholder="Virage Nord" className="h-9" />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <Label className="text-xs">Capacité *</Label>
                        <Input required type="number" min="1" value={z.capacity}
                          onChange={(e) => updateZone(idx, { capacity: Number(e.target.value) })}
                          className="h-9" />
                      </div>
                      <div className="col-span-5 sm:col-span-3">
                        <Label className="text-xs">Prix (FCFA) *</Label>
                        <Input required type="number" min="0" value={z.price_base}
                          onChange={(e) => updateZone(idx, { price_base: Number(e.target.value) })}
                          className="h-9" />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button type="button" variant="ghost" size="icon"
                          onClick={() => removeZone(idx)}
                          aria-label="Supprimer la zone"
                          className="size-9 text-destructive hover:text-destructive">
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost"
                onClick={() => { setShowForm(false); resetForm() }}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving || !form.name.trim() || !form.city.trim()}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Créer le stade'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12">
          <MapPin className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucun stade pour l&apos;instant.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium text-right">Capacité</th>
                <th className="px-4 py-3 font-medium text-right">Zones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.uuid} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.city}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {v.capacity ? v.capacity.toLocaleString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {v.zone_template?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default OrganizerVenuesPage
