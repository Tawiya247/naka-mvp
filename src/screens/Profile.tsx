import { useState } from 'react';
import { Icon } from '../components/Icons';
import { Sheet } from '../components/Sheet';
import { formatFcfa } from '../data';
import { useNaka } from '../store';
import type { IconName } from '../types';

interface ProfileScreenProps {
  onOpenActivity: () => void;
  onOpenRecharge: () => void;
  onOpenPartner: () => void;
}

type Panel = 'edit' | 'about' | 'help' | 'privacy' | null;

export function ProfileScreen({
  onOpenActivity,
  onOpenRecharge,
  onOpenPartner,
}: ProfileScreenProps) {
  const { profile, balance, orders, updateProfile, notify } = useNaka();
  const [panel, setPanel] = useState<Panel>(null);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftPhone, setDraftPhone] = useState(profile.phone);

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const openEdit = () => {
    setDraftName(profile.name);
    setDraftPhone(profile.phone);
    setPanel('edit');
  };

  const save = () => {
    updateProfile({ name: draftName.trim() || profile.name, phone: draftPhone.trim() || profile.phone });
    setPanel(null);
    notify('Profil mis à jour');
  };

  const rows: { icon: IconName; label: string; onClick: () => void }[] = [
    { icon: 'history', label: 'Mes commandes', onClick: onOpenActivity },
    { icon: 'wallet', label: 'Mon portefeuille', onClick: onOpenRecharge },
    { icon: 'star', label: 'Mode Partenaire', onClick: onOpenPartner },
    { icon: 'lock', label: 'Confidentialité', onClick: () => setPanel('privacy') },
    { icon: 'help', label: "Centre d'aide", onClick: () => setPanel('help') },
    { icon: 'info', label: 'À propos de Naka', onClick: () => setPanel('about') },
  ];

  return (
    <div className="screen">
      <header className="screen-head">
        <div>
          <h1>Mon Profil</h1>
          <p className="muted">{orders.length} course(s) · {formatFcfa(balance)} de solde</p>
        </div>
      </header>

      <div className="profile-head">
        <span className="avatar-lg">{initials}</span>
        <strong>{profile.name}</strong>
        <span className="muted">{profile.phone}</span>
        <div className="badge-row">
          {profile.verified ? (
            <span className="badge">
              <Icon name="shield" size={12} /> Compte client vérifié
            </span>
          ) : null}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={openEdit}>
          <Icon name="settings" size={15} /> Modifier le profil
        </button>
      </div>

      <div className="sec-head">
        <h2>Menu</h2>
      </div>

      <div className="menu">
        {rows.map((row) => (
          <button key={row.label} className="menu-row" onClick={row.onClick}>
            <span className="menu-ico">
              <Icon name={row.icon} size={18} />
            </span>
            <span className="menu-label">{row.label}</span>
            <Icon name="chevron" size={17} className="menu-chevron" />
          </button>
        ))}
      </div>

      <p className="tiny muted center version">NAKA MVP · démonstration · données simulées</p>

      {panel === 'edit' ? (
        <Sheet onClose={() => setPanel(null)} title="Modifier le profil">
          <label className="field">
            <span className="field-label">Nom complet</span>
            <input
              className="input"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">Téléphone</span>
            <input
              className="input"
              value={draftPhone}
              onChange={(event) => setDraftPhone(event.target.value)}
            />
          </label>
          <button className="btn btn-primary btn-lg" onClick={save}>
            Enregistrer
          </button>
        </Sheet>
      ) : null}

      {panel === 'about' ? (
        <Sheet
          onClose={() => setPanel(null)}
          title="À propos de Naka"
          subtitle="FRESHYX SARL · Lomé, Togo"
        >
          <p className="muted">
            NAKA est le compagnon de la mobilité électrique solaire : réservation de véhicules
            électriques, échange de batteries et pilotage des stations hybrides.
          </p>
          <ul className="bullet-list">
            <li>
              <Icon name="sun" size={16} /> Stations solaires + stockage : continuité de service
              même pendant une coupure CEET.
            </li>
            <li>
              <Icon name="leaf" size={16} /> Chaque trajet affiche le CO₂ évité face au thermique.
            </li>
            <li>
              <Icon name="trend" size={16} /> Les données de trajets alimentent l’optimisation des
              stations et des flottes.
            </li>
          </ul>
          <p className="tiny muted">
            MVP de démonstration : véhicules, stations et paiements sont simulés.
          </p>
        </Sheet>
      ) : null}

      {panel === 'help' ? (
        <Sheet onClose={() => setPanel(null)} title="Centre d'aide">
          <div className="faq">
            <strong>Comment fonctionne l’échange de batterie ?</strong>
            <p className="muted">
              Vous réservez un créneau depuis la carte, puis vous échangez la batterie en station en
              moins de 3 minutes. Aucune attente, même en cas de coupure réseau.
            </p>
          </div>
          <div className="faq">
            <strong>D’où vient l’électricité ?</strong>
            <p className="muted">
              Les stations NAKA combinent solaire et stockage. En cas de délestage, elles basculent
              automatiquement sur leurs batteries chargées.
            </p>
          </div>
          <div className="faq">
            <strong>Comment est calculé le CO₂ évité ?</strong>
            <p className="muted">
              Nous comparons votre trajet à une moto thermique (120 gCO₂e/km) moins l’émission de la
              mobilité électrique solaire (12 gCO₂e/km).
            </p>
          </div>
        </Sheet>
      ) : null}

      {panel === 'privacy' ? (
        <Sheet onClose={() => setPanel(null)} title="Confidentialité">
          <p className="muted">
            Ce MVP ne collecte aucune donnée personnelle réelle et n’envoie aucune requête réseau :
            toutes les données restent dans votre navigateur.
          </p>
          <ul className="bullet-list">
            <li>
              <Icon name="lock" size={16} /> Aucun compte, aucun tracking, aucune API tierce.
            </li>
            <li>
              <Icon name="info" size={16} /> Les trajets affichés sont des exemples générés par vos
              actions de démonstration.
            </li>
          </ul>
        </Sheet>
      ) : null}
    </div>
  );
}
