import type { Place, Service, Station, Vehicle } from './types';

/** Facteurs d'émission utilisés pour l'estimation affichée (gCO₂e/km). */
export const CO2_THERMAL_G_PER_KM = 120;
export const CO2_NAKA_G_PER_KM = 12;
export const CO2_SAVED_G_PER_KM = CO2_THERMAL_G_PER_KM - CO2_NAKA_G_PER_KM;

/** Impact déjà accumulé par la communauté NAKA (kg CO₂), avant l'utilisateur. */
export const COMMUNITY_BASE_KG = 12.5;
export const COMMUNITY_TARGET_KG = 1000;
export const KG_CO2_PER_TREE = 21;

export const PRESET_AMOUNTS = [1000, 2000, 5000, 10000];

export const formatFcfa = (value: number): string => `${value.toLocaleString('fr-FR')} F`;

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} · ${date.toLocaleTimeString(
    'fr-FR',
    { hour: '2-digit', minute: '2-digit' },
  )}`;
};

export const VEHICLES: Vehicle[] = [
  {
    id: 'moto',
    name: 'Moto Éco',
    tagline: 'Rapide & agile',
    icon: 'bike',
    basePrice: 500,
    battery: 92,
    rangeKm: 45,
  },
  {
    id: 'tricycle',
    name: 'Tricycle',
    tagline: 'Spacieux · Bagages',
    icon: 'truck',
    basePrice: 600,
    battery: 78,
    rangeKm: 38,
  },
  {
    id: 'voiture-eco',
    name: 'Voiture Éco',
    tagline: 'Citadine 4 places',
    icon: 'car',
    basePrice: 1500,
    battery: 85,
    rangeKm: 120,
  },
  {
    id: 'voiture-confort',
    name: 'Voiture Confort',
    tagline: 'Berline tout confort',
    icon: 'car',
    basePrice: 2200,
    battery: 64,
    rangeKm: 95,
  },
];

export const SERVICES: Service[] = [
  {
    id: 'express',
    name: 'Express',
    description: 'Course prioritaire, rapide et 100 % électrique',
    icon: 'bolt',
    basePrice: 700,
    eta: '15–25 min',
  },
  {
    id: 'certifiee',
    name: 'Certifiée',
    description: 'Livraison tracée avec attestation CO₂',
    icon: 'shield',
    basePrice: 1200,
    eta: '30–45 min',
  },
];

export const PLACES: Place[] = [
  { id: 'maison', label: 'Maison', area: 'Kégué · Rue des Palmiers', distanceKm: 3.4 },
  { id: 'bureau', label: 'Bureau', area: 'Lomé II · Bd Eyadéma', distanceKm: 2.6 },
  { id: 'grand-marche', label: 'Grand Marché de Lomé', area: 'Bè', distanceKm: 4.2 },
  { id: 'clinique', label: 'Clinique des Moineaux', area: 'Tokoin', distanceKm: 3.1 },
  { id: 'port', label: 'Port Autonome de Lomé', area: 'Bè', distanceKm: 6.8 },
  { id: 'aeroport', label: 'Aéroport Gnassingbé Eyadéma', area: 'Adidogomé', distanceKm: 8.4 },
];

export const QUICK_PLACE_IDS = ['maison', 'bureau'];

/**
 * Stations solaires hybrides NAKA (Solution 2).
 * `smartGrid: true` = la station bascule sur ses batteries solaires en cas de coupure CEET.
 */
export const STATIONS: Station[] = [
  {
    id: 'lome-2',
    name: 'Solar Swap Lomé II',
    area: 'Lomé II',
    x: 73,
    y: 47,
    batteriesReady: 12,
    total: 14,
    solarShare: 100,
    waitMinutes: 0,
    distanceKm: 1.2,
    smartGrid: true,
  },
  {
    id: 'be',
    name: 'Solar Swap Bè',
    area: 'Bè',
    x: 42,
    y: 64,
    batteriesReady: 8,
    total: 12,
    solarShare: 92,
    waitMinutes: 2,
    distanceKm: 2.4,
    smartGrid: true,
  },
  {
    id: 'tokoin',
    name: 'Solar Swap Tokoin',
    area: 'Tokoin',
    x: 54,
    y: 31,
    batteriesReady: 0,
    total: 10,
    solarShare: 70,
    waitMinutes: 18,
    distanceKm: 3.1,
    smartGrid: false,
  },
  {
    id: 'adidogome',
    name: 'Solar Hub Adidogomé',
    area: 'Adidogomé',
    x: 24,
    y: 75,
    batteriesReady: 6,
    total: 8,
    solarShare: 88,
    waitMinutes: 4,
    distanceKm: 5.6,
    smartGrid: true,
  },
  {
    id: 'kegue',
    name: 'Solar Swap Kégué',
    area: 'Kégué',
    x: 66,
    y: 22,
    batteriesReady: 3,
    total: 10,
    solarShare: 55,
    waitMinutes: 9,
    distanceKm: 4.3,
    smartGrid: false,
  },
];
