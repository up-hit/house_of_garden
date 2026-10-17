export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="logo-mark">
      <rect width="32" height="32" rx="8" fill="#1f4d33" />
      <path d="M16 26V15" stroke="#f6f3ea" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 18C9.5 18 7.5 13.5 7.5 9.5C13 9.5 16 12.5 16 18Z" fill="#a4d17f" />
      <path d="M16 14.5C16 9.5 19 6 25 6C25 11 22 14.5 16 14.5Z" fill="#f6f3ea" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="brand">
      <LogoMark />
      <span className="brand-name">House of Garden</span>
    </span>
  );
}
