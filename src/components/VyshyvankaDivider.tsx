export default function VyshyvankaDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 28"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="vysh" x="0" y="0" width="40" height="28" patternUnits="userSpaceOnUse">
          {/* Central diamond */}
          <polygon points="20,2 30,14 20,26 10,14" fill="none" stroke="#C41E3A" strokeWidth="2" />
          {/* Inner diamond */}
          <polygon points="20,7 25,14 20,21 15,14" fill="#C41E3A" opacity="0.25" />
          {/* Corner crosses — top-left */}
          <line x1="2" y1="14" x2="8" y2="14" stroke="#1a1a2e" strokeWidth="1.5" />
          <line x1="5" y1="11" x2="5" y2="17" stroke="#1a1a2e" strokeWidth="1.5" />
          {/* Corner crosses — top-right */}
          <line x1="32" y1="14" x2="38" y2="14" stroke="#1a1a2e" strokeWidth="1.5" />
          <line x1="35" y1="11" x2="35" y2="17" stroke="#1a1a2e" strokeWidth="1.5" />
          {/* Small dots at diamond tips */}
          <circle cx="20" cy="2" r="1.5" fill="#005BBB" />
          <circle cx="20" cy="26" r="1.5" fill="#005BBB" />
          {/* Horizontal border lines */}
          <line x1="0" y1="0.5" x2="40" y2="0.5" stroke="#C41E3A" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="27.5" x2="40" y2="27.5" stroke="#C41E3A" strokeWidth="1" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="28" fill="url(#vysh)" />
    </svg>
  );
}
