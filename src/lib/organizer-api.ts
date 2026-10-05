/**
 * Client API pour l'espace organisateur.
 */
import { getAuthHeaders } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ── Types ─────────────────────────────────────────────
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
  city: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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
    throw new Error(error.detail || `Erreur ${res.status}`);
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
  logo_url?: string;
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