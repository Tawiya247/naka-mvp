import { useEffect } from 'react';

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(id);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
}
