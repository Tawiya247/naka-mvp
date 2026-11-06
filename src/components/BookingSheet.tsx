import { useMemo, useState } from 'react';
import type { BookingRequest, Trip } from '../App';
import { CO2_SAVED_G_PER_KM, PLACES, PRESET_AMOUNTS, STATIONS, formatFcfa } from '../data';
import { useNaka } from '../store';
import { Icon } from './Icons';
import { Sheet } from './Sheet';

interface BookingSheetProps {
  request: BookingRequest;
  onClose: () => void;
  onConfirm: (trip: Trip) => void;
}

export function BookingSheet({ request, onClose, onConfirm }: BookingSheetProps) {
  const { balance, topUp, notify } = useNaka();
  const [placeId, setPlaceId] = useState<string | null>(request.destination?.id ?? null);
  const [topUpAmount, setTopUpAmount] = useState(PRESET_AMOUNTS[1]);
  const [topping, setTopping] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const place = useMemo(() => PLACES.find((item) => item.id === placeId) ?? null, [placeId]);
  const base = request.vehicle?.basePrice ?? request.service?.basePrice ?? 500;
  const price = place ? Math.round((base + Math.max(0, place.distanceKm - 1) * 80) / 25) * 25 : base;
  const co2 = place ? Math.round(place.distanceKm * CO2_SAVED_G_PER_KM) : 0;
  const station = STATIONS.find((item) => item.smartGrid && item.batteriesReady > 0) ?? STATIONS[0];
  const insufficient = balance < price;

  const handleTopUp = () => {
    setTopping(true);
    window.setTimeout(() => {
      topUp(topUpAmount);
      setTopping(false);
      notify(`+ ${formatFcfa(topUpAmount)} ajoutés au portefeuille`);
    }, 1100);
  };

  const handleConfirm = () => {
    if (!place || confirming) return;
    setConfirming(true);
    window.setTimeout(() => {
      onConfirm({ request, destination: place, price, co2, station: station.name });
    }, 900);
  };

  return (
    <Sheet
      onClose={onClose}
      title={request.vehicle?.name ?? request.service?.name ?? 'Course NAKA'}
      subtitle={request.kind === 'colis' ? 'Livraison électrique' : 'Trajet électrique'}
    >
      <div className="booking-summary">
        <span className="ico-badge ico-badge--lg">
          <Icon name={request.vehicle?.icon ?? request.service?.icon ?? 'bolt'} size={22} />
        </span>
        <div>
          <p className="booking-name">
            {request.vehicle
              ? `Batterie ${request.vehicle.battery} % · ${request.vehicle.rangeKm} km d’autonomie`
              : request.service?.eta ?? ''}
          </p>
          <div className="badge-row">
            <span className="badge">
              <Icon name="sun" size={11} /> 100 % solaire
            </span>
            <span className="badge badge--dark">{station.name}</span>
          </div>
        </div>
      </div>

      <h3 className="field-label">
        <Icon name="pin" size={14} /> Destination
      </h3>
      <div className="pick-list">
        {PLACES.map((item) => (
          <button
            key={item.id}
            className={`pick ${placeId === item.id ? 'pick--active' : ''}`}
            onClick={() => setPlaceId(item.id)}
          >
            <span className="pick-text">
              <strong>{item.label}</strong>
              <span className="muted">{item.area}</span>
            </span>
            <span className="pick-km">{item.distanceKm} km</span>
            {placeId === item.id ? <Icon name="check" size={16} className="pick-check" /> : null}
          </button>
        ))}
      </div>

      <div className="recap">
        <div className="recap-row">
          <span>Prix estimé</span>
          <strong>{formatFcfa(price)}</strong>
        </div>
        <div className="recap-row">
          <span>CO₂ évité vs moto thermique</span>
          <strong className="recap-co2">−{co2} g</strong>
        </div>
        <div className="recap-row">
          <span>Portefeuille</span>
          <strong>{formatFcfa(balance)}</strong>
        </div>
      </div>

      {insufficient ? (
        <div className="alert alert--warn">
          <strong>Solde insuffisant</strong>
          <p>
            Il manque {formatFcfa(price - balance)} pour confirmer cette course. Rechargez votre
            portefeuille, ou choisissez une destination plus proche.
          </p>
          <div className="chips">
            {PRESET_AMOUNTS.slice(0, 3).map((amount) => (
              <button
                key={amount}
                className={`chip ${topUpAmount === amount ? 'chip--active' : ''}`}
                onClick={() => setTopUpAmount(amount)}
              >
                +{formatFcfa(amount)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleTopUp} disabled={topping}>
            {topping ? (
              <>
                <span className="spinner" /> Rechargement…
              </>
            ) : (
              <>
                <Icon name="plus" size={16} /> Recharger le portefeuille
              </>
            )}
          </button>
        </div>
      ) : null}

      <button
        className="btn btn-primary btn-lg booking-cta"
        onClick={handleConfirm}
        disabled={!place || confirming || insufficient}
      >
        {confirming ? (
          <>
            <span className="spinner" /> Réservation…
          </>
        ) : place ? (
          `Confirmer · ${formatFcfa(price)}`
        ) : (
          'Choisissez une destination'
        )}
      </button>
    </Sheet>
  );
}
