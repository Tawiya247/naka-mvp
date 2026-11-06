import type { IconName } from '../types';
import { Icon } from './Icons';

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon: IconName }[];
}

export function Segmented<T extends string>({ value, onChange, options }: SegmentedProps<T>) {
  return (
    <div className="seg" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          className={`seg-btn ${value === option.value ? 'seg-btn--active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          <Icon name={option.icon} size={17} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
