import { TicketCard } from '@/components/TicketCard'

const mockTickets = [
  {
    matchTitle: 'ASEC Mimosas vs Africa Sports',
    teamA: 'ASEC Mimosas',
    teamB: 'Africa Sports',
    date: 'Samedi 15 novembre 2026',
    time: '18h00',
    venue: 'Stade Félix Houphouët-Boigny',
    category: 'VIP' as const,
    gate: 'Porte A',
    block: 'Bloc 12',
    row: 'Rangée F',
    seat: 'Siège 24',
    ticketNumber: 'TK-A3F9-2B7K',
  },
  {
    matchTitle: 'Stella Club vs SOA',
    teamA: 'Stella Club',
    teamB: 'SOA',
    date: 'Dimanche 16 novembre 2026',
    time: '16h00',
    venue: 'Stade Robert Champroux',
    category: 'Tribune' as const,
    gate: 'Porte C',
    block: 'Bloc 5',
    row: 'Rangée B',
    seat: 'Siège 12',
    ticketNumber: 'TK-B7K2-9M4P',
  },
]

export function MyTicketsPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Mes billets</h1>
      <p className="mb-10 text-muted-foreground">
        Vos prochains matchs — gardez vos QR codes à portée de main.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {mockTickets.map((ticket, i) => (
          <TicketCard key={i} {...ticket} />
        ))}
      </div>
    </div>
  )
}
