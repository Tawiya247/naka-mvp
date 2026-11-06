import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { COMMUNITY_BASE_KG, KG_CO2_PER_TREE } from './data';
import {
  DEFAULT_PROFILE,
  loadPersistedState,
  savePersistedState,
  type PersistedState,
} from './persistence';
import type { Order, Profile } from './types';

interface NakaState {
  orders: Order[];
  balance: number;
  profile: Profile;
  partnerMode: boolean;
  outage: boolean;
  gpsError: boolean;
  message: string | null;
  co2Kg: number;
  trees: number;
  deliveries: number;
  spent: number;
  communityKg: number;
  placeOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  topUp: (amount: number) => void;
  toggleOutage: () => void;
  setGpsError: (value: boolean) => void;
  togglePartner: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
  notify: (message: string) => void;
  clearMessage: () => void;
}

const NakaContext = createContext<NakaState | null>(null);

export function NakaProvider({ children }: { children: ReactNode }) {
  // Lu une seule fois au montage : la démo reprend là où elle s'est arrêtée.
  const [restored] = useState<PersistedState | null>(loadPersistedState);

  const [orders, setOrders] = useState<Order[]>(restored?.orders ?? []);
  const [balance, setBalance] = useState(restored?.balance ?? 0);
  const [profile, setProfile] = useState<Profile>(restored?.profile ?? DEFAULT_PROFILE);
  const [partnerMode, setPartnerMode] = useState(restored?.partnerMode ?? false);
  const [outage, setOutage] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Les interrupteurs de démo et le toast restent volatils : ils ne sont pas
  // enregistrés, une page rechargée repart sur une carte en état normal.
  useEffect(() => {
    savePersistedState({ orders, balance, profile, partnerMode });
  }, [orders, balance, profile, partnerMode]);

  const notify = useCallback((value: string) => setMessage(value), []);
  const clearMessage = useCallback(() => setMessage(null), []);

  const placeOrder = useCallback((input: Omit<Order, 'id' | 'date'>) => {
    const order: Order = {
      ...input,
      id: `NAKA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
    };
    setOrders((previous) => [order, ...previous]);
    setBalance((previous) => Math.max(0, previous - input.price));
  }, []);

  const topUp = useCallback((amount: number) => {
    setBalance((previous) => previous + amount);
  }, []);

  const toggleOutage = useCallback(() => setOutage((value) => !value), []);
  const togglePartner = useCallback(() => setPartnerMode((value) => !value), []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((previous) => ({ ...previous, ...patch }));
  }, []);

  const value = useMemo<NakaState>(() => {
    const co2Kg = Math.round((orders.reduce((sum, order) => sum + order.co2SavedG, 0) / 1000) * 10) / 10;
    return {
      orders,
      balance,
      profile,
      partnerMode,
      outage,
      gpsError,
      message,
      co2Kg,
      trees: Math.floor(co2Kg / KG_CO2_PER_TREE),
      deliveries: orders.filter((order) => order.kind === 'colis').length,
      spent: orders.reduce((sum, order) => sum + order.price, 0),
      communityKg: Math.round((COMMUNITY_BASE_KG + co2Kg) * 10) / 10,
      placeOrder,
      topUp,
      toggleOutage,
      setGpsError,
      togglePartner,
      updateProfile,
      notify,
      clearMessage,
    };
  }, [
    orders,
    balance,
    profile,
    partnerMode,
    outage,
    gpsError,
    message,
    placeOrder,
    topUp,
    toggleOutage,
    togglePartner,
    updateProfile,
    notify,
    clearMessage,
  ]);

  return <NakaContext.Provider value={value}>{children}</NakaContext.Provider>;
}

export function useNaka(): NakaState {
  const context = useContext(NakaContext);
  if (!context) {
    throw new Error('useNaka doit être utilisé à l’intérieur de <NakaProvider>');
  }
  return context;
}
