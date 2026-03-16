// Shared SVG icons used across tabs
export function WineIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <path d="M8 2h8l-1.5 8.5c-.4 2.3-2.3 3.5-4.5 3.5s-4.1-1.2-4.5-3.5L4 2" />
      <path d="M8 2h8" strokeWidth="2" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  );
}

export function BeerIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <path d="M5 3h10v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z" />
      <path d="M15 7h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
      <line x1="8" y1="7" x2="8" y2="13" /><line x1="11" y1="7" x2="11" y2="13" />
    </svg>
  );
}

export function CigIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <rect x="2" y="14" width="16" height="4" rx="1" />
      <rect x="14" y="14" width="4" height="4" rx="0" fill="rgba(192,57,43,0.3)" />
      <path d="M20 14v4" /><path d="M20 10c0-2-1.5-3-3-3s-2 1-2 2 1 2 2.5 2H20" />
      <path d="M22 10c0-3-2-4.5-4.5-4.5S14 7 14 8.5" />
    </svg>
  );
}

export function CigPackIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <rect x="5" y="4" width="14" height="6" rx="2" fill="rgba(192,57,43,0.15)" />
      <line x1="9" y1="13" x2="9" y2="19" /><line x1="12" y1="12" x2="12" y2="19" />
      <line x1="15" y1="13" x2="15" y2="19" /><path d="M12 4V2" strokeWidth="2" />
    </svg>
  );
}

export function PeopleIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M8 3.13a4 4 0 0 0 0 7.75" />
    </svg>
  );
}

export function DiscoIcon({ color = '#C0392B' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a14.5 14.5 0 0 0 0 16" /><path d="M12 4a14.5 14.5 0 0 1 0 16" />
      <path d="M4.5 9h15" /><path d="M4.5 15h15" />
      <line x1="12" y1="2" x2="12" y2="4" />
    </svg>
  );
}

export function ClockIcon({ color = '#27AE60' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export function CalendarIcon({ color = '#27AE60' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" color={color}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><path d="M8 14l2 2 4-4" />
    </svg>
  );
}
