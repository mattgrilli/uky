const COLORS = ["#005BBB", "#FFD500", "#22C55E", "#EC4899", "#F97316", "#8B5CF6"];
const PIECES = 30;

export default function Confetti() {
  return (
    <div className="confetti-container">
      {Array.from({ length: PIECES }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
