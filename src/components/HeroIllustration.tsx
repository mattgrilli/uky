export default function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#B8DFFF" />
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8A317" />
          <stop offset="50%" stopColor="#F0C040" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="320" fill="url(#sky)" />

      {/* Sun */}
      <circle cx="680" cy="60" r="32" fill="#FFD500" opacity="0.9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="680"
          y1="60"
          x2={680 + Math.cos((deg * Math.PI) / 180) * 48}
          y2={60 + Math.sin((deg * Math.PI) / 180) * 48}
          stroke="#FFD500"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}

      {/* Clouds */}
      <g opacity="0.7">
        <ellipse cx="150" cy="55" rx="50" ry="20" fill="white" />
        <ellipse cx="185" cy="48" rx="35" ry="16" fill="white" />
        <ellipse cx="120" cy="50" rx="30" ry="14" fill="white" />
      </g>
      <g opacity="0.5">
        <ellipse cx="450" cy="75" rx="45" ry="18" fill="white" />
        <ellipse cx="480" cy="68" rx="30" ry="14" fill="white" />
        <ellipse cx="420" cy="70" rx="28" ry="12" fill="white" />
      </g>
      <g opacity="0.4">
        <ellipse cx="600" cy="110" rx="35" ry="14" fill="white" />
        <ellipse cx="625" cy="105" rx="25" ry="11" fill="white" />
      </g>

      {/* Rolling hills / field boundary */}
      <path
        d="M0 200 Q100 175 200 190 Q300 205 400 185 Q500 165 600 190 Q700 210 800 195 L800 320 L0 320 Z"
        fill="url(#field)"
      />

      {/* Wheat stalks along the hill line */}
      {[80, 180, 310, 430, 520, 640, 740].map((x, i) => {
        const baseY = 195 + Math.sin((x / 800) * Math.PI * 2.5) * 12;
        return (
          <g key={`wheat-${i}`} opacity="0.6">
            <line
              x1={x}
              y1={baseY}
              x2={x + (i % 2 === 0 ? 3 : -3)}
              y2={baseY - 30 - (i % 3) * 8}
              stroke="#B8860B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[-6, -3, 0, 3, 6].map((offset, j) => (
              <ellipse
                key={j}
                cx={x + (i % 2 === 0 ? 3 : -3) + offset * 0.5}
                cy={baseY - 30 - (i % 3) * 8 - 4 + Math.abs(offset)}
                rx="2"
                ry="4"
                fill="#DAA520"
                transform={`rotate(${offset * 3} ${x + (i % 2 === 0 ? 3 : -3) + offset * 0.5} ${baseY - 30 - (i % 3) * 8 - 4 + Math.abs(offset)})`}
              />
            ))}
          </g>
        );
      })}

      {/* Sunflower - left (medium) */}
      <g>
        {/* Stem */}
        <path d="M240 280 Q238 240 245 200" stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Leaf */}
        <path d="M242 240 Q225 230 220 245 Q230 242 242 240" fill="#4CAF50" opacity="0.8" />
        {/* Petals */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          return (
            <ellipse
              key={`lp-${i}`}
              cx={245 + Math.cos(angle) * 16}
              cy={198 + Math.sin(angle) * 16}
              rx="5"
              ry="10"
              fill="#FFD500"
              transform={`rotate(${i * 36} ${245 + Math.cos(angle) * 16} ${198 + Math.sin(angle) * 16})`}
            />
          );
        })}
        {/* Center */}
        <circle cx="245" cy="198" r="9" fill="#8B4513" />
        <circle cx="245" cy="198" r="6" fill="#6B3410" />
      </g>

      {/* Sunflower - center (large) */}
      <g>
        <path d="M400 270 Q398 220 405 165" stroke="#4CAF50" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M401 220 Q380 205 372 222 Q385 218 401 220" fill="#4CAF50" opacity="0.8" />
        <path d="M403 195 Q420 182 425 198 Q415 194 403 195" fill="#4CAF50" opacity="0.7" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <ellipse
              key={`cp-${i}`}
              cx={405 + Math.cos(angle) * 20}
              cy={162 + Math.sin(angle) * 20}
              rx="6"
              ry="13"
              fill="#FFD500"
              transform={`rotate(${i * 30} ${405 + Math.cos(angle) * 20} ${162 + Math.sin(angle) * 20})`}
            />
          );
        })}
        <circle cx="405" cy="162" r="12" fill="#8B4513" />
        <circle cx="405" cy="162" r="8" fill="#6B3410" />
      </g>

      {/* Sunflower - right (small) */}
      <g>
        <path d="M580 275 Q582 245 578 215" stroke="#4CAF50" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M580 248 Q595 240 598 252 Q590 248 580 248" fill="#4CAF50" opacity="0.8" />
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          return (
            <ellipse
              key={`rp-${i}`}
              cx={578 + Math.cos(angle) * 13}
              cy={213 + Math.sin(angle) * 13}
              rx="4"
              ry="9"
              fill="#FFD500"
              transform={`rotate(${i * 36} ${578 + Math.cos(angle) * 13} ${213 + Math.sin(angle) * 13})`}
            />
          );
        })}
        <circle cx="578" cy="213" r="8" fill="#8B4513" />
        <circle cx="578" cy="213" r="5" fill="#6B3410" />
      </g>

      {/* Extra field detail - subtle furrow lines */}
      <path d="M0 250 Q200 240 400 255 Q600 270 800 258" stroke="#C8922A" strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M0 280 Q200 275 400 285 Q600 295 800 282" stroke="#C8922A" strokeWidth="1" opacity="0.2" fill="none" />
    </svg>
  );
}
