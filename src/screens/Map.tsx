import { useState } from 'react';
import { Icon } from '../components/Icons';
import { STATIONS } from '../data';
import { useNaka } from '../store';
import type { Station } from '../types';

type Tone = 'ok' | 'warn' | 'danger';

const stationStatus = (station: Station, outage: boolean): { tone: Tone; label: string } => {
  if (outage && !station.smartGrid) return { tone: 'danger', label: 'Hors service' };
  if (outage) return { tone: 'ok', label: 'Smart Grid actif' };
  if (station.batteriesReady === 0) return { tone: 'warn', label: 'Aucune batterie' };
  if (station.waitMinutes <= 3) return { tone: 'ok', label: 'Zéro attente' };
  return { tone: 'warn', label: `~${station.waitMinutes} min` };
};

const badgeClass = (tone: Tone): string => (tone === 'ok' ? 'badge' : `badge badge--${tone}`);

export function MapScreen() {
  const { outage, toggleOutage, gpsError, setGpsError, notify } = useNaka();
  const [selected, setSelected] = useState(STATIONS[0].id);
  const [retrying, setRetrying] = useState(false);
  const [reserved, setReserved] = useState<string | null>(null);

  const smartStations = STATIONS.filter((station) => station.smartGrid).length;

  const retry = () => {
    if (retrying) return;
    setRetrying(true);
    window.setTimeout(() => {
      setGpsError(false);
      setRetrying(false);
      notify('Position rétablie · stations à jour');
    }, 1000);
  };

  const reserve = (station: Station) => {
    setReserved(station.id);
    notify(`Batterie réservée · ${station.name}`);
  };

  return (
    <div className="screen">
      <header className="screen-head">
        <div>
          <h1>Stations solaires</h1>
          <p className="muted">Recharge & échange de batteries · Lomé</p>
        </div>
        <span className="badge badge--dark">
          <Icon name="sun" size={11} /> Smart Grid
        </span>
      </header>

      <div className="demo-card">
        <div className="demo-head">
          <Icon name="sparkles" size={13} /> Banc de démo
        </div>
        <label className="switch-row">
          <span>Coupure CEET</span>
          <input type="checkbox" className="switch" checked={outage} onChange={toggleOutage} />
        </label>
        <label className="switch-row">
          <span>Réseau GPS instable</span>
          <input
            type="checkbox"
            className="switch"
            checked={gpsError}
            onChange={(event) => setGpsError(event.target.checked)}
          />
        </label>
      </div>

      {gpsError ? (
        <div className="empty">
          <span className="empty-ico empty-ico--danger">
            <Icon name="pin" size={26} />
          </span>
          <h3>Position GPS indisponible</h3>
          <p className="muted">
            Votre réseau semble instable. Vérifiez votre connexion ou réactivez la localisation,
            puis réessayez.
          </p>
          <button className="btn btn-primary" onClick={retry} disabled={retrying}>
            {retrying ? (
              <>
                <span className="spinner spinner--dark" /> Localisation…
              </>
            ) : (
              <>
                <Icon name="refresh" size={16} /> Réessayer
              </>
            )}
          </button>
          <p className="tiny muted">
            Astuce : la liste des stations reste consultable même sans position GPS.
          </p>
        </div>
      ) : (
        <>
          <div className="map-card">
            <svg
              className="map-svg"
              viewBox="0 0 390 320"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <rect width="390" height="320" fill="#EDF3EE" />
              <path d="M0 252 C110 246 250 240 390 232 L390 320 L0 320 Z" fill="#DCEBF3" />
              <path d="M0 252 C110 246 250 240 390 232" stroke="#C7DDE9" strokeWidth="5" fill="none" />
              <ellipse cx="306" cy="58" rx="72" ry="46" fill="#DDEFDF" />
              <ellipse cx="60" cy="270" rx="46" ry="30" fill="#DDEFDF" />
              <path d="M120 0 L152 320" stroke="#FFFFFF" strokeWidth="17" />
              <path d="M120 0 L152 320" stroke="#F3C969" strokeWidth="2" strokeDasharray="10 12" />
              <path d="M0 118 L390 152" stroke="#FFFFFF" strokeWidth="15" />
              <path d="M0 202 L390 190" stroke="#F8FBF8" strokeWidth="9" />
              <path d="M232 0 L252 250" stroke="#FFFFFF" strokeWidth="11" />
              <path d="M40 28 L336 286" stroke="#F8FBF8" strokeWidth="7" />
              <path d="M0 84 L390 96" stroke="#F8FBF8" strokeWidth="6" />
              <text x="150" y="54" className="map-label">
                KÉTÉDJA
              </text>
              <text x="292" y="118" className="map-label">
                LOMÉ II
              </text>
              <text x="196" y="176" className="map-label">
                LOMÉ
              </text>
              <text x="58" y="222" className="map-label">
                BÈ
              </text>
              <text x="96" y="298" className="map-label">
                ADIDOGOMÉ
              </text>
              <text x="266" y="288" className="map-water">
                Océan Atlantique
              </text>
            </svg>

            {outage ? (
              <div className="map-flag">
                <Icon name="bolt" size={12} /> Coupure CEET — {smartStations} stations sur batteries
                solaires
              </div>
            ) : null}

            <span className="map-me" style={{ left: '46%', top: '72%' }} aria-label="Votre position" />

            {STATIONS.map((station) => {
              const status = stationStatus(station, outage);
              return (
                <button
                  key={station.id}
                  className={`map-pin ${status.tone === 'danger' ? 'map-pin--danger' : ''} ${
                    selected === station.id ? 'map-pin--selected' : ''
                  }`}
                  style={{ left: `${station.x}%`, top: `${station.y}%` }}
                  onClick={() => setSelected(station.id)}
                  aria-label={station.name}
                  aria-pressed={selected === station.id}
                >
                  <Icon name="bolt" size={16} />
                </button>
              );
            })}
          </div>

          <div className="station-list">
            {STATIONS.map((station) => {
              const status = stationStatus(station, outage);
              const active = selected === station.id;
              return (
                <div
                  key={station.id}
                  className={`station ${active ? 'station--active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(station.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setSelected(station.id);
                  }}
                >
                  <div className="station-main">
                    <span className={`station-ico station-ico--${status.tone}`}>
                      <Icon name="bolt" size={18} />
                    </span>
                    <div className="station-text">
                      <div className="station-title-row">
                        <strong>{station.name}</strong>
                        {station.solarShare >= 90 ? (
                          <span className="badge badge--dark">
                            <Icon name="sun" size={11} /> Solaire
                          </span>
                        ) : null}
                      </div>
                      <p className="muted">
                        {station.area} · {station.distanceKm} km
                      </p>
                    </div>
                    <span className={badgeClass(status.tone)}>{status.label}</span>
                  </div>

                  <div className="station-bars">
                    <span>
                      {station.batteriesReady}/{station.total} batteries prêtes
                    </span>
                    <span>{station.solarShare} % solaire</span>
                  </div>
                  <div className="gauge">
                    <div
                      className="gauge-fill"
                      style={{ width: `${(station.batteriesReady / station.total) * 100}%` }}
                    />
                  </div>

                  {active ? (
                    <div className="station-actions">
                      <p className="tiny muted">
                        {outage
                          ? 'Bascule automatique sur le stockage solaire : aucun conducteur bloqué.'
                          : 'Échange de batterie garanti en moins de 3 minutes, énergie 100 % solaire.'}
                      </p>
                      {reserved === station.id ? (
                        <span className="badge badge--dark">
                          <Icon name="check" size={11} /> Réservée · 15 min
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            reserve(station);
                          }}
                        >
                          Réserver une batterie
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
