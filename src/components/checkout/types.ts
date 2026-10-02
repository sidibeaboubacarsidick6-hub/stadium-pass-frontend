export interface TicketCategory {
  id: number
  name: string
  price: number
  remaining: number
  is_sold_out: boolean
}

export interface MatchInfo {
  uuid: string
  title: string
  homeTeam: string
  awayTeam: string
  homeTeamShort: string
  awayTeamShort: string
  kickoffAt: string
  venueName: string
  venueCity: string
}

export interface CheckoutPayload {
  categoryId: number
  quantity: number
  firstName: string
  lastName: string
  email: string
  phone: string
  paymentMethod: string
}

export interface CheckoutResult {
  orderNumber: string
  total: number
}

export interface CheckoutFlowProps {
  match: MatchInfo
  categories: TicketCategory[]
  onComplete?: (payload: CheckoutPayload) => Promise<CheckoutResult>
  onExit?: () => void
  onViewTicket?: (orderNumber: string) => void
  onGoHome?: () => void
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  acceptedTerms: boolean
}

export type PaymentMethodId = 'wave' | 'orange_money' | 'mtn_momo' | 'moov_money' | 'card'

export interface PaymentMethod {
  id: PaymentMethodId
  label: string
  short: string
  swatch: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'wave', label: 'Wave', short: 'W', swatch: 'bg-[#1dc3f0] text-white' },
  { id: 'orange_money', label: 'Orange Money', short: 'OM', swatch: 'bg-[#ff7900] text-white' },
  { id: 'mtn_momo', label: 'MTN MoMo', short: 'MTN', swatch: 'bg-[#ffcb05] text-[#1a1a1a]' },
  { id: 'moov_money', label: 'Moov Money', short: 'M', swatch: 'bg-[#0066b3] text-white' },
  { id: 'card', label: 'Carte bancaire', short: 'CB', swatch: 'bg-[#14201a] text-white' },
]

export const MAX_QUANTITY = 10
