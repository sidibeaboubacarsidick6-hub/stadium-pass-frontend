/**
 * Adapte un Ticket (API) en props pour le composant TicketCard v0.
 */
import type { Ticket } from './api';
import type { TicketCardProps, TicketCategory } from '@/components/TicketCard';

function normalizeCategory(name: string): TicketCategory {
  const lower = name.toLowerCase();
  if (lower.includes('vip') || lower.includes('loge')) return 'VIP';
  if (lower.includes('tribune') || lower.includes('bloc')) return 'Tribune';
  return 'Populaire';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Enlève les préfixes "Porte A" → "A", "Bloc 12" → "12" */
function stripPrefix(label: string, prefixes: string[]): string {
  for (const prefix of prefixes) {
    if (label.toLowerCase().startsWith(prefix.toLowerCase())) {
      return label.substring(prefix.length).trim();
    }
  }
  return label;
}

export function ticketToCardProps(t: Ticket): Omit<TicketCardProps, 'className'> {
  return {
    matchTitle: t.match_title,
    teamA: t.home_team,
    teamB: t.away_team,
    date: formatDate(t.kickoff_at),
    time: formatTime(t.kickoff_at),
    venue: `${t.venue_name}, ${t.venue_city}`,
    category: normalizeCategory(t.category_name),
    seat: '',      // non fourni par l'API pour l'instant
    row: '',       // idem
    gate: stripPrefix(t.gate_label, ['Porte ', 'Porte']),
    block: stripPrefix(t.block_label, ['Bloc ', 'Bloc', 'Tribune ']),
    ticketNumber: t.ticket_number,
    qrData: t.qr_data,
  };
}
