/**
 * Client API pour l'espace organisateur.
 */
import { getAuthHeaders } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ── Types ─────────────────────────────────────────────
interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface OrganizerDashboard {
  organization: { name: string; slug: string };
  matches: { total: number; upcoming: number };
  tickets: { sold: number };
  revenue: { total: number };
}

export interface OrganizerMatch {
  id: number;
  uuid: string;
  competition: number;
  competition_name: string;
  home_team: number;
  home_team_name: string;
  away_team: number;
  away_team_name: string;
  venue: number;
  venue_name: string;
  kickoff_at: string;
  sale_start_at: string | null;
  sale_end_at: string | null;
  status: string;
  tv_channel: string;
  description: string;
  tickets_sold: number;
  ticket_categories?: {
    id: number;
    name: string;
    description: string;
    price: string;
    total_quantity: number;
    quantity_sold: number;
    remaining: number;
    max_per_order: number;
    block_label: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface OrganizerCompetition {
  id: number;
  uuid: string;
  name: string;
  type?: string;
  matches_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizerVenue {
  id: number;
  uuid: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizerTeam {
  id: number;
  uuid: string;
  name: string;
  short_name: string;
  slug: string;
  city: string;
  founded_year: number | null;
  president_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Fetch helper ──────────────────────────────────────
async function orgFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('FORBIDDEN');
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    // DRF renvoie soit {detail}, soit {field: [errors]}
    if (error.detail) throw new Error(error.detail);
    const firstKey = Object.keys(error)[0];
    if (firstKey) {
      const v = error[firstKey];
      const msg = Array.isArray(v) ? v[0] : String(v);
      throw new Error(`${firstKey}: ${msg}`);
    }
    throw new Error(`Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Endpoints ─────────────────────────────────────────
export async function getOrganizerDashboard(): Promise<OrganizerDashboard> {
  return orgFetch('/organizer/dashboard/');
}

export async function getOrganizerMatches(): Promise<OrganizerMatch[]> {
  const data = await orgFetch<Paginated<OrganizerMatch>>('/organizer/matches/');
  return data.results;
}

export async function getOrganizerCompetitions(): Promise<OrganizerCompetition[]> {
  const data = await orgFetch<Paginated<OrganizerCompetition>>('/organizer/competitions/');
  return data.results;
}

export async function getOrganizerVenues(): Promise<OrganizerVenue[]> {
  const data = await orgFetch<Paginated<OrganizerVenue>>('/organizer/venues/');
  return data.results;
}

export async function getOrganizerTeams(): Promise<OrganizerTeam[]> {
  const data = await orgFetch<Paginated<OrganizerTeam>>('/organizer/teams/');
  return data.results;
}

// ── Création rapide ──────────────────────────────────
export interface CompetitionCreatePayload {
  name: string;
  type?: string;
}

export interface VenueCreatePayload {
  name: string;
  city: string;
  address?: string;
  capacity?: number;
}

export interface TeamCreatePayload {
  name: string;
  short_name: string;
  city?: string;
  founded_year?: number;
  president_name?: string;
}

export async function createCompetition(payload: CompetitionCreatePayload): Promise<OrganizerCompetition> {
  return orgFetch('/organizer/competitions/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createVenue(payload: VenueCreatePayload): Promise<OrganizerVenue> {
  return orgFetch('/organizer/venues/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createTeam(payload: TeamCreatePayload): Promise<OrganizerTeam> {
  return orgFetch('/organizer/teams/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ── Création match complet ────────────────────────────
export interface TicketCategoryPayload {
  name: string;
  price: number;
  total_quantity: number;
  max_per_order: number;
  block_label?: string;
  description?: string;
}

export interface MatchCreatePayload {
  competition: number;
  home_team: number;
  away_team: number;
  venue: number;
  kickoff_at: string;
  status: string;
  tv_channel?: string;
  description?: string;
  ticket_categories: TicketCategoryPayload[];
}

export async function createMatch(payload: MatchCreatePayload): Promise<OrganizerMatch> {
  return orgFetch('/organizer/matches/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ── Édition / suppression match ───────────────────────
export async function getOrganizerMatch(uuid: string): Promise<OrganizerMatch> {
  return orgFetch(`/organizer/matches/${uuid}/`);
}

export async function updateMatch(uuid: string, payload: MatchCreatePayload): Promise<OrganizerMatch> {
  return orgFetch(`/organizer/matches/${uuid}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteMatch(uuid: string): Promise<void> {
  return orgFetch(`/organizer/matches/${uuid}/`, { method: 'DELETE' });
}