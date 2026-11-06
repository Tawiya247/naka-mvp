import type { Order, Profile } from './types';

/**
 * Persistance locale de la démo.
 *
 * Seul l'état qui a du sens d'une session à l'autre est conservé : historique,
 * solde, profil, mode Partenaire. Les interrupteurs de démonstration (coupure
 * CEET, GPS instable) et le toast restent volatils : à chaque rechargement la
 * carte repart dans son état normal.
 *
 * Tout ce qui est relu est validé champ par champ : une entrée corrompue, une
 * ancienne version ou un `localStorage` inaccessible (navigation privée) ne doit
 * jamais empêcher l'app de démarrer.
 */

const STORAGE_KEY = 'naka-mvp:state:v1';

export interface PersistedState {
  orders: Order[];
  balance: number;
  profile: Profile;
  partnerMode: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  name: "N'WITCHA Tawiya Daniel",
  phone: '+228 71 90 22 01',
  verified: true,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isOrder = (value: unknown): value is Order =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  (value.kind === 'trajet' || value.kind === 'colis') &&
  typeof value.label === 'string' &&
  typeof value.to === 'string' &&
  isFiniteNumber(value.price) &&
  value.price >= 0 &&
  isFiniteNumber(value.co2SavedG) &&
  value.co2SavedG >= 0 &&
  typeof value.date === 'string' &&
  !Number.isNaN(Date.parse(value.date)) &&
  typeof value.station === 'string' &&
  typeof value.solar === 'boolean';

const isProfile = (value: unknown): value is Profile =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  typeof value.phone === 'string' &&
  typeof value.verified === 'boolean';

export function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined') return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // localStorage refusé par le navigateur.
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null; // Entrée illisible : on repart de l'état initial.
  }
  if (!isRecord(parsed)) return null;

  const orders = Array.isArray(parsed.orders) ? parsed.orders.filter(isOrder) : [];
  const { balance } = parsed;
  const safeBalance = isFiniteNumber(balance) && balance >= 0 ? balance : 0;
  const profile = isProfile(parsed.profile) ? parsed.profile : DEFAULT_PROFILE;
  const partnerMode = parsed.partnerMode === true;

  return { orders, balance: safeBalance, profile, partnerMode };
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota plein ou stockage bloqué : la démo continue, sans persistance.
  }
}
