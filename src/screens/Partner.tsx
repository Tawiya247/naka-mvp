import { Icon } from '../components/Icons';
import { formatFcfa } from '../data';
import { useNaka } from '../store';

interface PartnerScreenProps {
  onBack: () => void;
  onFindBattery: () => void;
}

export function PartnerScreen({ onBack, onFindBattery }: PartnerScreenProps) {
  const { profile } = useNaka();

  return (
    <div className="screen">
      <header className="back-row">
        <button className="icon-btn" onClick={onBack} aria-label="Retour au profil">
          <Icon name="back" size={19} />
        </button>
        <h1>Espace Partenaire</h1>
        <span className="badge badge--dark">
          <Icon name="star" size={11} /> Fleet
        </span>
      </header>

      <div className="driver-card">
        <div>
          <span className="tiny driver-label">Conducteur professionnel</span>
          <strong>{profile.name}</strong>
          <span className="tiny driver-sub">Moto Éco · NAKA-{profile.phone.slice(-4)}</span>
        </div>
        <div className="driver-score">
          <Icon name="star" size={15} />
          <span>4,8</span>
        </div>
      </div>

      <span className="field-label">
        <Icon name="clock" size={14} /> Aujourd’hui
      </span>
      <div className="stat-grid">
        <div className="card partner-stat">
          <span className="tiny muted">Gains</span>
          <strong>{formatFcfa(18500)}</strong>
        </div>
        <div className="card partner-stat">
          <span className="tiny muted">Carburant économisé</span>
          <strong>{formatFcfa(3200)}</strong>
        </div>
        <div className="card partner-stat">
          <span className="tiny muted">CO₂ évité</span>
          <strong>4,2 kg</strong>
        </div>
        <div className="card partner-stat">
          <span className="tiny muted">Courses</span>
          <strong>9</strong>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Fiabilité</h3>
          <span className="badge badge--dark">12 échanges</span>
        </div>
        <div className="gauge">
          <div className="gauge-fill" style={{ width: '88%' }} />
        </div>
        <p className="tiny muted">
          Score 88/100 — basé sur les échanges de batteries à l’heure et les courses terminées.
        </p>
      </div>

      <button className="btn btn-primary big-btn" onClick={onFindBattery}>
        <Icon name="battery" size={22} />
        Trouver une batterie chargée
      </button>
      <p className="tiny muted center">
        Données de démonstration · le mode partenaire branchera les gains réels et les statuts de
        station en temps réel.
      </p>
    </div>
  );
}
