import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icons';

interface SheetProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ title, subtitle, onClose, children, footer }: SheetProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Panneau'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            <h2 className="sheet-title">{title}</h2>
            {subtitle ? <p className="sheet-sub">{subtitle}</p> : null}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fermer">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer ? <div className="sheet-foot">{footer}</div> : null}
      </div>
    </div>
  );
}
