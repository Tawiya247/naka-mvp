import { useState } from 'react';
import { PRESET_AMOUNTS, formatFcfa } from '../data';
import { useNaka } from '../store';
import { Icon } from './Icons';
import { Sheet } from './Sheet';

export function RechargeSheet({ onClose }: { onClose: () => void }) {
  const { balance, topUp, notify } = useNaka();
  const [amount, setAmount] = useState(PRESET_AMOUNTS[1]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRecharge = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      topUp(amount);
      setLoading(false);
      setDone(true);
      notify(`Portefeuille rechargé · +${formatFcfa(amount)}`);
    }, 1200);
  };

  return (
    <Sheet
      onClose={onClose}
      title="Mon portefeuille"
      subtitle={`Solde actuel : ${formatFcfa(balance)}`}
    >
      {done ? (
        <div className="sheet-success">
          <span className="empty-ico">
            <Icon name="check" size={28} />
          </span>
          <h3>Recharge réussie</h3>
          <p className="muted">
            +{formatFcfa(amount)} crédités. Nouveau solde : <strong>{formatFcfa(balance)}</strong>.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onClose}>
            Terminer
          </button>
        </div>
      ) : (
        <>
          <div className="amount-grid">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                className={`amount ${amount === preset ? 'amount--active' : ''}`}
                onClick={() => setAmount(preset)}
              >
                {preset.toLocaleString('fr-FR')} F
              </button>
            ))}
          </div>
          <p className="note">
            <Icon name="info" size={14} /> Paiement Mobile Money simulé pour ce MVP — aucun débit
            réel.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleRecharge} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Paiement en cours…
              </>
            ) : (
              `Recharger · ${formatFcfa(amount)}`
            )}
          </button>
        </>
      )}
    </Sheet>
  );
}
