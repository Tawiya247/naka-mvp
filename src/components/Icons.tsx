import type { ReactNode } from 'react';
import type { IconName } from '../types';

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 16V6h11v10" />
      <path d="M14 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 20 4c0 12-4 16-9 16Z" />
      <path d="M4 20c2-6 6-9 11-11" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7h14a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 7V6a2 2 0 0 1 2-2h10" />
      <circle cx="16" cy="13" r="1.3" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="8" width="16" height="8" rx="2.5" />
      <path d="M20.5 11v2" />
      <path d="M6 11v2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </>
  ),
  check: <path d="m5 13 4 4L19 7" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  back: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8" />
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  history: (
    <>
      <path d="M3.2 12a8.8 8.8 0 1 0 2.9-6.5" />
      <path d="M3 4v4.5h4.5" />
      <path d="M12 8v4.4l3 1.8" />
    </>
  ),
  star: <path d="m12 3.2 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2Z" />,
  car: (
    <>
      <path d="M4 16h16l-1.5-5.2A3 3 0 0 0 15.6 8.5H8.4a3 3 0 0 0-2.9 2.3L4 16Z" />
      <path d="M5.5 16v2M18.5 16v2" />
      <circle cx="7.5" cy="16" r="1.3" />
      <circle cx="16.5" cy="16" r="1.3" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M9 17h4.5l3-6.5h-3.5L11.5 8H14" />
      <path d="M9 17 6.5 11H4.5" />
    </>
  ),
  phone: (
    <path d="M4 4.5h4l2 5-2.4 1.4a11.5 11.5 0 0 0 5.5 5.5L14.5 14l5 2v4a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 2 6.6 2 2 0 0 1 4 4.5Z" />
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.4 6H14a4 4 0 0 1 0 8H9.6a4 4 0 0 0 0 8h6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.6 5.7" />
      <path d="M4 12a8 8 0 0 1 13.6-5.7" />
      <path d="M17.6 2.5v4h-4M6.4 21.5v-4h4" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
      <path d="m18 16 .9 2.2 2.1.8-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.8L18 16Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  trend: (
    <>
      <path d="m3 16 5-5 3.5 3.5L21 6" />
      <path d="M15 6h6v6" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
