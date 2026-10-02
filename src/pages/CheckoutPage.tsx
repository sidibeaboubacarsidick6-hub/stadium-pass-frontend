import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { getMatch, createOrder } from '@/lib/api'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'
import type { MatchInfo, TicketCategory } from '@/components/checkout/types'
import { Button } from '@/components/ui/button'

export function CheckoutPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const [search] = useSearchParams()
  const navigate = useNavigate()

  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const initialCategoryId = Number(search.get('category')) || undefined
  const initialQuantity = Number(search.get('quantity')) || undefined

  useEffect(() => {
    if (!uuid) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getMatch(uuid)
      .then((apiMatch) => {
        if (cancelled) return
        const info: MatchInfo = {
          uuid: apiMatch.uuid,
          title: apiMatch.title,
          homeTeam: apiMatch.home_team.name,
          awayTeam: apiMatch.away_team.name,
          homeTeamShort: apiMatch.home_team.short_name,
          awayTeamShort: apiMatch.away_team.short_name,
          kickoffAt: apiMatch.kickoff_at,
          venueName: apiMatch.venue.name,
          venueCity: apiMatch.venue.city,
        }
        const cats: TicketCategory[] = apiMatch.ticket_categories.map((c) => ({
          id: c.id,
          name: c.name,
          price: Number(c.price),
          remaining: c.remaining,
          is_sold_out: c.is_sold_out,
        }))
        setMatchInfo(info)
        setCategories(cats)
        setNotFound(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Erreur Checkout:', err)
        setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [uuid])

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement…</span>
      </div>
    )
  }

  if (notFound || !matchInfo) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Match introuvable</h1>
        <p className="mt-2 text-muted-foreground">Ce match n'existe pas ou n'est plus disponible.</p>
        <Link to="/matches" className="mt-6">
          <Button className="bg-primary text-primary-foreground hover:bg-emerald-light gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux matchs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <CheckoutFlow
        match={matchInfo}
        categories={categories}
        initialCategoryId={initialCategoryId}
        initialQuantity={initialQuantity}
        onExit={() => navigate(`/matches/${uuid}`)}
        onViewTicket={() => navigate('/my-tickets')}
        onGoHome={() => navigate('/')}
        onComplete={async (payload) => {
          const order = await createOrder({
            match_uuid: uuid!,
            category_id: payload.categoryId,
            quantity: payload.quantity,
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            payment_method: payload.paymentMethod,
          })
          return {
            orderNumber: order.order_number,
            total: Number(order.total),
          }
        }}
      />
    </div>
  )
}