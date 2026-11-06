import { useMemo, useState } from 'react';
import { Icon } from '../components/Icons';
import { Segmented } from '../components/Segmented';
import {
  PLACES,
  QUICK_PLACE_IDS,
  SERVICES,
  VEHICLES,
  formatFcfa,
} from '../data';
import { useNaka } from '../store';
import type { Place, Service, Vehicle } from '../types';

interface HomeScreenProps {
  onBook: (vehicle: Vehicle, destination: Place | null) => void;
  onOrderService: (service: Service, destination: Place | null) => void;
  onOpenRecharge: () => void;
  onOpenProfile: () => void;
  onOpenImpact: () => void;
  onOpenMap: () => void;
}

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export function HomeScreen({
  onBook,
  onOrderService,
  onOpenRecharge,
  onOpenProfile,
  onOpenImpact,
  onOpenMap,
}: HomeScreenProps) {
  const { profile, balance, communityKg, outage } = useNaka();
  const [mode, setMode] = useState<'trajet' | 'colis'>('trajet');
  const [destination, setDestination] = useState<Place | null>(null);
  const [query, setQuery] = useState('');

  const firstName = profile.name.split(' ')[0];
  const quickPlaces = useMemo(
    () => PLACES.filter((place) => QUICK_PLACE_IDS.includes(place.id)),
    [],
  );
  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return PLACES.filter((place) =>
      `${place.label} ${place.area}`.toLowerCase().includes(term),
    ).slice(0, 4);
  }, [query]);

  return (
    <div className="screen">
      <header className="home-head">
        <div className="home-hello">
          <h1 className="greeting">
            Bonjour {firstName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="greeting-sub">
            {mode === 'trajet' ? 'Où allez-vous aujourd’hui ?' : 'Besoin d’envoyer un colis ?'}
          </p>
        </div>
        <div className="head-actions">
          <button className="balance-chip" onClick={onOpenRecharge} aria-label="Recharger le portefeuille">
            <Icon name="wallet" size={15} />
            <span>{balance.toLocaleString('fr-FR')} F</span>
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <span className="notif-dot" aria-hidden="true" />
            <Icon name="bell" size={19} />
          </button>
          <button className="avatar-btn" onClick={onOpenProfile} aria-label="Ouvrir le profil">
            {initials(profile.name)}
          </button>
        </div>
      </header>

      <button className={`solar-strip ${outage ? 'solar-strip--outage' : ''}`} onClick={onOpenMap}>
        <Icon name={outage ? 'bolt' : 'sun'} size={17} />
        <span>
          {outage
            ? 'Coupure CEET en cours — vos stations restent opérationnelles'
            : 'Stations solaires opérationnelles · zéro attente'}
        </span>
        <Icon name="chevron" size={16} />
      </button>

      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'trajet', label: 'Trajet', icon: 'bike' },
          { value: 'colis', label: 'Colis', icon: 'truck' },
        ]}
      />

      <div className="search-wrap">
        <div className="search">
          <Icon name="search" size={20} className="search-ico" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={mode === 'trajet' ? 'Où allez-vous ?' : 'Où envoyez-vous votre colis ?'}
            aria-label="Rechercher une destination"
          />
          {query ? (
            <button className="search-go" onClick={() => setQuery('')} aria-label="Effacer">
              <Icon name="close" size={16} />
            </button>
          ) : (
            <button
              className="search-go"
              onClick={() => setQuery(PLACES[2].label)}
              aria-label="Voir des suggestions"
            >
              <Icon name="arrow-right" size={17} />
            </button>
          )}
        </div>
        {suggestions.length > 0 ? (
          <ul className="suggestions">
            {suggestions.map((place) => (
              <li key={place.id}>
                <button
                  className="suggestion"
                  onClick={() => {
                    setDestination(place);
                    setQuery('');
                  }}
                >
                  <Icon name="pin" size={16} className="search-ico" />
                  <span>
                    <strong>{place.label}</strong>
                    <span className="muted">
                      {' '}
                      · {place.area} · {place.distanceKm} km
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="chips">
        {quickPlaces.map((place) => (
          <button
            key={place.id}
            className={`chip ${destination?.id === place.id ? 'chip--active' : ''}`}
            onClick={() => setDestination(place)}
          >
            <Icon name={place.id === 'maison' ? 'home' : 'shield'} size={15} />
            {place.label}
          </button>
        ))}
      </div>

      {destination ? (
        <div className="selected-dest">
          <Icon name="pin" size={17} />
          <div>
            <strong>{destination.label}</strong>
            <span className="muted">
              {destination.area} · {destination.distanceKm} km
            </span>
          </div>
          <button className="icon-btn icon-btn--sm" onClick={() => setDestination(null)} aria-label="Retirer la destination">
            <Icon name="close" size={15} />
          </button>
        </div>
      ) : null}

      {mode === 'trajet' ? (
        <>
          <div className="sec-head">
            <h2>Nos véhicules électriques</h2>
            <span className="muted tiny">Batterie & autonomie en temps réel</span>
          </div>
          <div className="grid-2">
            {VEHICLES.map((vehicle) => (
              <article key={vehicle.id} className="card vehicle">
                <div className="vehicle-top">
                  <span className="ico-badge">
                    <Icon name={vehicle.icon} size={20} />
                  </span>
                  <span className="price">dès {vehicle.basePrice} F</span>
                </div>
                <h3>{vehicle.name}</h3>
                <p className="muted">{vehicle.tagline}</p>
                <div className="battery">
                  <Icon name="battery" size={14} />
                  {vehicle.battery} % · {vehicle.rangeKm} km
                </div>
                <div className="batt">
                  <div className="batt-fill" style={{ width: `${vehicle.battery}%` }} />
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onBook(vehicle, destination)}>
                  Réserver
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="impact-banner" onClick={onOpenImpact}>
            <div>
              <strong>Impact Naka</strong>
              <p>{communityKg.toLocaleString('fr-FR')} kg de CO₂ évités par la communauté</p>
            </div>
            <Icon name="leaf" size={40} className="impact-banner-leaf" />
          </button>

          <div className="sec-head">
            <h2>Nos services</h2>
            <button className="link" onClick={onOpenImpact}>
              Tout voir
            </button>
          </div>
          <div className="grid-2">
            {SERVICES.map((service) => (
              <article key={service.id} className="card service">
                <span className="ico-badge">
                  <Icon name={service.icon} size={20} />
                </span>
                <h3>{service.name}</h3>
                <p className="muted">{service.description}</p>
                <div className="service-foot">
                  <span className="price">dès {service.basePrice} F</span>
                  <span className="muted tiny">{service.eta}</span>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onOrderService(service, destination)}
                >
                  Commander
                </button>
              </article>
            ))}
          </div>

          <div className="wallet-card">
            <div>
              <span className="wallet-label">Mon portefeuille</span>
              <strong className="wallet-value">{formatFcfa(balance)}</strong>
            </div>
            <button className="btn btn-light" onClick={onOpenRecharge}>
              <Icon name="plus" size={16} /> Recharger
            </button>
          </div>
        </>
      )}

      <div className="premium-row">
        <span className="premium-ico">
          <Icon name="sparkles" size={18} />
        </span>
        <div>
          <strong>Naka Premium</strong>
          <p className="muted">Livraisons certifiées 100 % carbone neutre</p>
        </div>
      </div>
    </div>
  );
}
