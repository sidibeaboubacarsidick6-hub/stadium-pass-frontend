/**
 * Gestion de l'authentification côté client.
 * Stocke le token JWT + infos utilisateur dans localStorage.
 */

const TOKEN_KEY = 'stadium_access_token';
const REFRESH_KEY = 'stadium_refresh_token';
const USER_KEY = 'stadium_user';
const AUTH_CHANGE_EVENT = 'stadium-auth-change';

export interface AuthOrganization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  full_name: string;
  is_organizer: boolean;
  organization: AuthOrganization | null;
  date_joined: string;
}

// ── Pub/Sub ───────────────────────────────────────────
export function notifyAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

export function onAuthChange(callback: () => void): () => void {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}

// ── Token ─────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  notifyAuthChange();
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

// ── User ──────────────────────────────────────────────
export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ── Utilitaires ───────────────────────────────────────
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Organizer helpers ─────────────────────────────────
export function isOrganizer(): boolean {
  const user = getUser();
  return !!user?.is_organizer && !!user.organization;
}
