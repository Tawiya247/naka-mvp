export type Tab = 'home' | 'map' | 'activity' | 'impact' | 'profile';
export type OrderKind = 'trajet' | 'colis';

export type IconName =
  | 'home'
  | 'truck'
  | 'leaf'
  | 'user'
  | 'search'
  | 'bolt'
  | 'shield'
  | 'arrow-right'
  | 'bell'
  | 'wallet'
  | 'chevron'
  | 'plus'
  | 'pin'
  | 'battery'
  | 'sun'
  | 'check'
  | 'close'
  | 'back'
  | 'settings'
  | 'help'
  | 'info'
  | 'lock'
  | 'history'
  | 'star'
  | 'car'
  | 'bike'
  | 'phone'
  | 'route'
  | 'refresh'
  | 'sparkles'
  | 'clock'
  | 'trend';

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  icon: IconName;
  basePrice: number;
  battery: number;
  rangeKm: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  basePrice: number;
  eta: string;
}

export interface Place {
  id: string;
  label: string;
  area: string;
  distanceKm: number;
}

export interface Station {
  id: string;
  name: string;
  area: string;
  x: number;
  y: number;
  batteriesReady: number;
  total: number;
  solarShare: number;
  waitMinutes: number;
  distanceKm: number;
  smartGrid: boolean;
}

export interface Order {
  id: string;
  kind: OrderKind;
  label: string;
  to: string;
  price: number;
  co2SavedG: number;
  date: string;
  station: string;
  solar: boolean;
}

export interface Profile {
  name: string;
  phone: string;
  verified: boolean;
}
