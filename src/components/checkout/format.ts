export function formatFCFA(amount: number): string {
  const rounded = Math.round(amount).toString()
  return `${rounded.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0FCFA`
}

export function formatNumber(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Abidjan',
})

export function formatKickoff(iso: string): string {
  const formatted = dateFormatter.format(new Date(iso))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return `ORD-${id}`
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}
