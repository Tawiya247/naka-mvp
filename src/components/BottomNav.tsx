import type { IconName, Tab } from '../types';
import { Icon } from './Icons';

const ITEMS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Accueil', icon: 'home' },
  { id: 'map', label: 'Carte', icon: 'pin' },
  { id: 'activity', label: 'Activité', icon: 'history' },
  { id: 'impact', label: 'Impact', icon: 'leaf' },
  { id: 'profile', label: 'Profil', icon: 'user' },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="nav" aria-label="Navigation principale">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <Icon name={item.icon} size={21} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
