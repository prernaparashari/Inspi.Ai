export default function InspiLogo({ size = 32, animated = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-spark' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="inspi-spark" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 C25.5 14 27 21 34 24 C27 27 25.5 34 24 45 C22.5 34 21 27 14 24 C21 21 22.5 14 24 3 Z"
        fill="url(#inspi-spark)"
      />
      <path
        d="M38 27 C38.7 31 40.3 32.6 44 33.5 C40.3 34.4 38.7 36 38 40 C37.3 36 35.7 34.4 32 33.5 C35.7 32.6 37.3 31 38 27 Z"
        fill="url(#inspi-spark)"
        opacity="0.75"
      />
    </svg>
  );
}