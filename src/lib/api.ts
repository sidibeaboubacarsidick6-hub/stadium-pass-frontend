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


// ── Commande ──────────────────────────────────────────
export interface OrderResponse {
  id: number;
  uuid: string;
  order_number: string;
  status: string;
  subtotal: number;
  fees: number;
  total: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  created_at: string;
}

export interface CreateOrderPayload {
  match_uuid: string;
  category_id: number;
  quantity: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  payment_method: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.detail || `Erreur ${res.status}`);
  }
  return res.json();
}

// ── Authentification ──────────────────────────────────
import {
  setTokens,
  setUser,
  clearAuth,
  getAuthHeaders,
  type AuthUser,
} from './auth';

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    // Récupère le premier message d'erreur
    const firstKey = Object.keys(error)[0];
    const msg = firstKey ? `${firstKey}: ${error[firstKey]}` : `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Email ou mot de passe incorrect.');
  }
  const data: LoginResponse = await res.json();
  setTokens(data.access, data.refresh);
  setUser(data.user);
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/me/`, {
    headers: { Accept: 'application/json', ...getAuthHeaders() },
  });
  if (!res.ok) {
    clearAuth();
    throw new Error('Session expirée.');
  }
  const user = await res.json();
  setUser(user);
  return user;
}

export function logout() {
  clearAuth();
}


// ── Paiement simulé (V1) ──────────────────────────────
export async function simulatePayment(uuid: string): Promise<OrderResponse> {
  const res = await fetch(`${API_URL}/orders/${uuid}/simulate-pay/`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Erreur paiement ${res.status}`);
  }
  return res.json();
}


// ── Mes billets ───────────────────────────────────────
export interface Ticket {
  id: number;
  uuid: string;
  ticket_number: string;
  match_title: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  venue_name: string;
  venue_city: string;
  category_name: string;
  category_price: string;
  gate_label: string;
  block_label: string;
  holder_name: string;
  holder_email: string;
  holder_phone: string;
  qr_token: string;
  qr_data: string;
  qr_code_image_url: string | null;
  status: string;
  created_at: string;
}

export async function getMyTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/my-tickets/`, {
    headers: { Accept: 'application/json', ...getAuthHeaders() },
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}`);
  }
  return res.json();
}

// ── Téléchargement PDF billet ─────────────────────────
export async function downloadTicketPdf(ticketUuid: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/tickets/${ticketUuid}/pdf/`, {
    headers: { ...getAuthHeaders() },
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error(`Erreur ${res.status}`);
  }
  return res.blob();
}