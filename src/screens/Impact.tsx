import { Icon } from '../components/Icons';
import { COMMUNITY_TARGET_KG, STATIONS } from '../data';
import { useNaka } from '../store';

const dayLabel = (date: Date): string =>
  date.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3);

const sameDay = (a: Date, b: Date): boolean => a.toDateString() === b.toDateString();

export function ImpactScreen({ onGoHome }: { onGoHome: () => void }) {
  const { co2Kg, trees, deliveries, orders, communityKg } = useNaka();
  const isEmpty = orders.length === 0;

  const series = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const kg =
      orders
        .filter((order) => sameDay(new Date(order.date), date))
        .reduce((sum, order) => sum + order.co2SavedG, 0) / 1000;
    return { label: dayLabel(date), kg };
  });
  const maxKg = Math.max(...series.map((point) => point.kg), 0.2);
  const communityProgress = Math.min(100, (communityKg / COMMUNITY_TARGET_KG) * 100);

  return (
    <div className="screen">
      <header className="screen-head">
        <div>
          <h1>Mon Impact Naka</h1>
          <p className="muted">Chaque course remplace un trajet thermique</p>
        </div>
        <span className="badge badge--dark">
          <Icon name="sun" size={11} /> 100 % solaire
        </span>
      </header>

      {isEmpty ? (
        <div className="empty">
          <span className="empty-ico">
            <Icon name="leaf" size={26} />
          </span>
          <h3>Prêt à faire la différence ?</h3>
          <p className="muted">
            Votre première course Naka évite déjà du CO₂ par rapport à une moto thermique. Vos
            chiffres et votre courbe apparaîtront ici.
          </p>
          <button className="btn btn-primary" onClick={onGoHome}>
            Faire ma première course
          </button>
        </div>
      ) : null}

      <div className="stat">
        <span className="stat-ico stat-ico--green">
          <Icon name="leaf" size={22} />
        </span>
        <div>
          <span className="stat-label">CO₂ économisé</span>
          <strong className="stat-value">{co2Kg.toLocaleString('fr-FR')} kg</strong>
        </div>
      </div>

      <div className="stat">
        <span className="stat-ico stat-ico--dark">
          <Icon name="trend" size={22} />
        </span>
        <div>
          <span className="stat-label">Arbres préservés</span>
          <strong className="stat-value">
            {trees} arbre{trees > 1 ? 's' : ''}
          </strong>
        </div>
      </div>

      <div className="stat">
        <span className="stat-ico stat-ico--sky">
          <Icon name="truck" size={22} />
        </span>
        <div>
          <span className="stat-label">Livraisons effectuées</span>
          <strong className="stat-value">{deliveries}</strong>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>CO₂ évité cette semaine</h3>
          <span className="tiny muted">kg</span>
        </div>
        <div className="chart">
          {series.map((point, index) => (
            <div className="chart-col" key={index}>
              <div className="chart-track">
                <div
                  className={`chart-bar ${point.kg === 0 ? 'chart-bar--zero' : ''}`}
                  style={{ height: `${Math.max(4, (point.kg / maxKg) * 100)}%` }}
                  title={`${point.kg.toFixed(2)} kg`}
                />
              </div>
              <span className="chart-x">{point.label}</span>
            </div>
          ))}
        </div>
        {isEmpty ? (
          <p className="tiny muted center">Vos courses de la semaine s’afficheront ici.</p>
        ) : null}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Objectif communauté</h3>
          <span className="badge badge--dark">
            {communityKg.toLocaleString('fr-FR')} / {COMMUNITY_TARGET_KG} kg
          </span>
        </div>
        <div className="gauge gauge--lg">
          <div className="gauge-fill" style={{ width: `${communityProgress}%` }} />
        </div>
        <p className="tiny muted">
          1 tonne de CO₂ évitée ce mois-ci à Lomé ·{' '}
          {co2Kg > 0 ? `+${co2Kg} kg grâce à vous` : 'votre première course compte'}
        </p>
      </div>

      <div className="sec-head">
        <h2>Stations qui alimentent vos trajets</h2>
      </div>
      <ul className="station-mini-list">
        {STATIONS.filter((station) => station.smartGrid).map((station) => (
          <li key={station.id} className="station-mini">
            <span className="station-mini-ico">
              <Icon name="sun" size={15} />
            </span>
            <div className="station-mini-text">
              <strong>{station.name}</strong>
              <div className="gauge">
                <div className="gauge-fill" style={{ width: `${station.solarShare}%` }} />
              </div>
            </div>
            <span className="tiny muted">{station.solarShare} % solaire</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
