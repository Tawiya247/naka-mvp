import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, loadPersistedState, savePersistedState } from './src/persistence.ts';

const store = new Map<string, string>();
globalThis.window = {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
  },
} as unknown as Window & typeof globalThis;

// 1. Aucun état enregistré → null.
assert.equal(loadPersistedState(), null);

// 2. Aller-retour complet.
const order = {
  id: 'NAKA-ABC123',
  kind: 'trajet' as const,
  label: 'Moto Éco',
  to: 'Maison',
  price: 500,
  co2SavedG: 367,
  date: '2026-11-06T10:12:00.000Z',
  station: 'Solar Swap Lomé II',
  solar: true,
};
savePersistedState({ orders: [order], balance: 4500, profile: DEFAULT_PROFILE, partnerMode: true });
assert.deepEqual(loadPersistedState(), {
  orders: [order],
  balance: 4500,
  profile: DEFAULT_PROFILE,
  partnerMode: true,
});

// 3. JSON corrompu → null, pas d'exception.
store.set('naka-mvp:state:v1', '{oops');
assert.equal(loadPersistedState(), null);

// 4. Entrées invalides filtrées, solde négatif ramené à 0, profil réparé.
store.set(
  'naka-mvp:state:v1',
  JSON.stringify({
    orders: [order, { id: 'x' }, null, { ...order, kind: 'avion' }],
    balance: -300,
    profile: { name: 42 },
    partnerMode: 'oui',
  }),
);
const repaired = loadPersistedState();
assert.deepEqual(repaired?.orders, [order]);
assert.equal(repaired?.balance, 0);
assert.deepEqual(repaired?.profile, DEFAULT_PROFILE);
assert.equal(repaired?.partnerMode, false);

// 5. Stockage indisponible (navigation privée) → null à la lecture, silence à l'écriture.
globalThis.window = {
  get localStorage() {
    throw new Error('SecurityError');
  },
} as unknown as Window & typeof globalThis;
assert.equal(loadPersistedState(), null);
assert.doesNotThrow(() => savePersistedState({ orders: [], balance: 0, profile: DEFAULT_PROFILE, partnerMode: false }));

console.log('persistence: 5/5 contrôles passés');
