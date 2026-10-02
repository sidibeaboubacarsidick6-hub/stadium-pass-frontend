/**
 * Client API pour Stadium Pass backend.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ── Types ─────────────────────────────────────────────
export interface Team {
  id: number;
  uuid: string;
  name: string;
  short_name: string;
  city: string;
  logo_url: string | null;
}

export interface Venue {
  id: number;
  uuid: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
}

export interface Competition {
  id: number;
  uuid: string;
  name: string;
  type: string;
}

export interface Match {
  id: number;
  uuid: string;
  title: string;
  competition: Competition;
  home_team: Team;
  away_team: Team;
  venue: Venue;
  kickoff_at: string;
  status: string;
  is_on_sale: boolean;
  poster: string | null;
  tv_channel: string;
  min_price: number;
}

export interface TicketCategory {
  id: number;
  name: string;
  description: string;
  price: string;
  total_quantity: number;
  quantity_sold: number;
  remaining: number;
  is_sold_out: boolean;
  gate_name: string | null;
  block_label: string;
  order: number;
}

export interface MatchDetail extends Match {
  description: string;
  ticket_categories: TicketCategory[];
  away_quota_percent: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Fonctions ─────────────────────────────────────────
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function getMatches(): Promise<Match[]> {
  const data = await apiFetch<PaginatedResponse<Match>>('/matches/');
  return data.results;
}

export async function getMatch(uuid: string): Promise<MatchDetail> {
  return apiFetch<MatchDetail>(`/matches/${uuid}/`);
}

export async function getTeams(): Promise<Team[]> {
  const data = await apiFetch<PaginatedResponse<Team>>('/teams/');
  return data.results;
}

// ── Helpers ───────────────────────────────────────────
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
