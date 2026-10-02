/**
 * Adaptateurs API → modèles UI utilisés par les composants Bolt.
 */
import type {
  Match as ApiMatch,
  MatchDetail as ApiMatchDetail,
  TicketCategory as ApiTicketCategory,
} from './api';

// ── Types UI (compatibles avec @/data/matches) ─────────
export interface UiTicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  availability: 'available' | 'limited' | 'soldout';
  color: string;
}

export interface UiMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamShort: string;
  awayTeamShort: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  image: string;
  categories: UiTicketCategory[];
  featured: boolean;
}

// ── Helpers ────────────────────────────────────────────
const DEFAULT_IMAGE =
  'https://images.pexels.com/photos/30651230/pexels-photo-30651230.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

function categoryColor(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('vip') || lower.includes('loge')) return 'amber';
  if (lower.includes('tribune')) return 'blue';
  return 'emerald';
}

function categoryAvailability(
  cat: ApiTicketCategory
): 'available' | 'limited' | 'soldout' {
  if (cat.is_sold_out) return 'soldout';
  if (cat.remaining < 50) return 'limited';
  return 'available';
}

// ── Adaptateur principal ───────────────────────────────
export function adaptMatch(api: ApiMatch | ApiMatchDetail): UiMatch {
  const kickoff = new Date(api.kickoff_at);
  const date = kickoff.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = kickoff.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const categories =
    'ticket_categories' in api && api.ticket_categories
      ? api.ticket_categories.map((c) => ({
          id: String(c.id),
          name: c.name,
          price: Number(c.price),
          description: c.description || '',
          availability: categoryAvailability(c),
          color: categoryColor(c.name),
        }))
      : [];

  return {
    id: api.uuid,
    homeTeam: api.home_team.name,
    awayTeam: api.away_team.name,
    homeTeamShort: api.home_team.short_name,
    awayTeamShort: api.away_team.short_name,
    competition: api.competition.name,
    date,
    time,
    stadium: api.venue.name,
    city: api.venue.city,
    image: api.poster || DEFAULT_IMAGE,
    categories,
    featured: false,
  };
}