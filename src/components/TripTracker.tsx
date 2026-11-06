import { useEffect, useState } from 'react';
import type { Trip } from '../App';
import { formatFcfa } from '../data';
import type { Tab } from '../types';
import { Icon } from './Icons';

export function TripTracker({ trip, onFinish }: { trip: Trip; onFinish: (target: Tab) => void }) {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 2));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  const done = progress >= 100;
  const co2 = Math.round((trip.co2 * progress) / 100);
  const circumference = 2 * Math.PI * 62;
  const remaining = Math.max(0, Math.round((100 - progress) / 2));

  const finish = (target: Tab) => {
    if (finished) return;
    setFinished(true);
    onFinish(target);
  };

  return (
    <div className="tracker">
      <div className="tracker-inner">
        {done ? (
          <>
            <div className="tracker-done">
              <span className="big-check">
                <Icon name="check" size={34} />
              </span>
              <span className="badge badge--dark">
                <Icon name="sun" size={11} /> Énergie 100 % solaire
              </span>
              <h2>Course terminée</h2>
              <p className="tracker-done-text">
                Vous avez évité <strong>{trip.co2} g de CO₂</strong> sur{' '}
                {trip.destination.distanceKm} km, contre une moto thermique.
              </p>
            </div>
            <div className="tracker-recap">
              <div>
                <span>Payé</span>
                <strong>{formatFcfa(trip.price)}</strong>
              </div>
              <div>
                <span>Station</span>
                <strong>{trip.station}</strong>
              </div>
            </div>
            <div className="tracker-btns">
              <button className="btn btn-primary btn-lg" onClick={() => finish('impact')}>
                Voir mon impact
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => finish('activity')}>
                Mes courses
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="tracker-top">
              <span className="badge badge--dark">
                <Icon name="sun" size={11} /> {trip.station}
              </span>
              <h2>Course en cours</h2>
              <p className="tracker-sub">
                {trip.request.vehicle?.name ?? trip.request.service?.name} →{' '}
                {trip.destination.label}
              </p>
            </div>

            <div className="tracker-ring">
              <svg viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="62" className="ring-track" />
                <circle
                  cx="75"
                  cy="75"
                  r="62"
                  className="ring-bar"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference * (1 - progress / 100),
                  }}
                />
              </svg>
              <div className="ring-center">
                <strong>{co2}</strong>
                <span>g CO₂ évités</span>
              </div>
            </div>

            <div className="tracker-meta">
              <div className="tracker-meta-row">
                <span>{Math.round(progress)} % du trajet</span>
                <span>{remaining} s restantes</span>
              </div>
              <div className="gauge">
                <div className="gauge-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="tiny">
                Estimation sur {trip.destination.distanceKm} km, comparée à une moto thermique
                (120 gCO₂e/km).
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
