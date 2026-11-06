import { Icon } from '../components/Icons';
import { formatDate, formatFcfa } from '../data';
import { useNaka } from '../store';

export function ActivityScreen({ onGoHome }: { onGoHome: () => void }) {
  const { orders, spent, co2Kg } = useNaka();

  if (orders.length === 0) {
    return (
      <div className="screen">
        <header className="screen-head">
          <div>
            <h1>Mon activité</h1>
            <p className="muted">Trajets et livraisons</p>
          </div>
        </header>
        <div className="empty">
          <span className="empty-ico">
            <Icon name="route" size={26} />
          </span>
          <h3>Aucune course pour l’instant</h3>
          <p className="muted">
            Votre première course NAKA évite 108 g de CO₂ par kilomètre parcouru. Elle apparaîtra
            ici, avec sa station solaire d’origine.
          </p>
          <button className="btn btn-primary" onClick={onGoHome}>
            Commander une course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <div>
          <h1>Mon activité</h1>
          <p className="muted">{orders.length} course(s) · énergie solaire</p>
        </div>
      </header>

      <div className="grid-2">
        <div className="card">
          <span className="tiny muted">Total dépensé</span>
          <strong className="stat-value">{formatFcfa(spent)}</strong>
        </div>
        <div className="card">
          <span className="tiny muted">CO₂ évité</span>
          <strong className="stat-value">{co2Kg.toLocaleString('fr-FR')} kg</strong>
        </div>
      </div>

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order">
            <span className="order-ico">
              <Icon name={order.kind === 'colis' ? 'truck' : 'bike'} size={18} />
            </span>
            <div className="order-text">
              <strong>
                {order.label} · {order.to}
              </strong>
              <p className="muted">
                {formatDate(order.date)} · {order.station}
              </p>
            </div>
            <div className="order-side">
              <strong>{formatFcfa(order.price)}</strong>
              <span className="badge badge--dark">−{(order.co2SavedG / 1000).toFixed(2)} kg</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
