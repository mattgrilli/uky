export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none hidden md:block" aria-hidden="true">
      {/* Top-left: wheat sprig */}
      <svg
        className="absolute top-16 left-4 w-24 h-32 opacity-[0.06]"
        viewBox="0 0 80 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M40 110 Q38 70 42 20" stroke="#B8860B" strokeWidth="3" strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => {
          const y = 30 + i * 20;
          return (
            <g key={i}>
              <path
                d={`M42 ${y} Q${55 + i * 2} ${y - 12} ${50 + i * 2} ${y - 20}`}
                stroke="#DAA520"
                strokeWidth="2"
                fill="none"
              />
              <ellipse cx={50 + i * 2} cy={y - 22} rx="4" ry="7" fill="#DAA520" />
              <path
                d={`M42 ${y} Q${28 - i * 2} ${y - 10} ${30 - i * 2} ${y - 18}`}
                stroke="#DAA520"
                strokeWidth="2"
                fill="none"
              />
              <ellipse cx={30 - i * 2} cy={y - 20} rx="4" ry="7" fill="#DAA520" />
            </g>
          );
        })}
      </svg>

      {/* Top-right: small sunflower */}
      <svg
        className="absolute top-24 right-6 w-20 h-20 opacity-[0.05]"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          return (
            <ellipse
              key={i}
              cx={30 + Math.cos(angle) * 16}
              cy={30 + Math.sin(angle) * 16}
              rx="5"
              ry="10"
              fill="#FFD500"
              transform={`rotate(${i * 36} ${30 + Math.cos(angle) * 16} ${30 + Math.sin(angle) * 16})`}
            />
          );
        })}
        <circle cx="30" cy="30" r="9" fill="#8B4513" />
      </svg>

      {/* Bottom-right: vyshyvanka geometric cluster */}
      <svg
        className="absolute bottom-20 right-8 w-28 h-16 opacity-[0.06]"
        viewBox="0 0 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diamond row */}
        {[0, 1, 2].map((i) => (
          <polygon
            key={i}
            points={`${20 + i * 30},5 ${30 + i * 30},25 ${20 + i * 30},45 ${10 + i * 30},25`}
            fill="none"
            stroke="#C41E3A"
            strokeWidth="2"
          />
        ))}
        {/* Small crosses between diamonds */}
        {[0, 1].map((i) => (
          <g key={`c-${i}`}>
            <line
              x1={35 + i * 30} y1="22" x2={35 + i * 30} y2="28"
              stroke="#1a1a2e" strokeWidth="2"
            />
            <line
              x1={32 + i * 30} y1="25" x2={38 + i * 30} y2="25"
              stroke="#1a1a2e" strokeWidth="2"
            />
          </g>
        ))}
      </svg>

      {/* Bottom-left: wheat sprig (mirrored) */}
      <svg
        className="absolute bottom-32 left-6 w-20 h-28 opacity-[0.05]"
        viewBox="0 0 60 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "scaleX(-1)" }}
      >
        <path d="M30 85 Q28 55 32 15" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" />
        {[0, 1, 2].map((i) => {
          const y = 25 + i * 18;
          return (
            <g key={i}>
              <path
                d={`M32 ${y} Q44 ${y - 10} ${42} ${y - 16}`}
                stroke="#DAA520"
                strokeWidth="1.5"
                fill="none"
              />
              <ellipse cx={42} cy={y - 18} rx="3.5" ry="6" fill="#DAA520" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
