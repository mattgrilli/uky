import type { UkrainianLetter } from "../data/alphabet";

const categoryColors: Record<string, string> = {
  vowel: "border-ua-blue bg-gradient-to-br from-blue-50 to-white",
  consonant: "border-gray-400 bg-gradient-to-br from-gray-50 to-white",
  semivowel: "border-ua-yellow bg-gradient-to-br from-yellow-50 to-white",
  sign: "border-amber-600 bg-gradient-to-br from-amber-50 to-white",
};

const categoryBadge: Record<string, string> = {
  vowel: "bg-ua-blue text-white",
  consonant: "bg-gray-500 text-white",
  semivowel: "bg-ua-yellow text-ua-blue-dark",
  sign: "bg-amber-600 text-white",
};

interface LetterCardProps {
  letter: UkrainianLetter;
  flipped?: boolean;
  onClick?: () => void;
  onSpeak?: () => void;
  compact?: boolean;
}

export default function LetterCard({
  letter,
  flipped = false,
  onClick,
  onSpeak,
  compact = false,
}: LetterCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`flip-card w-full aspect-square min-h-18 rounded-xl border-2 ${categoryColors[letter.category]}
          card-shadow-blue hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer select-none`}
      >
        <div className={`flip-card-inner w-full h-full relative ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-2">
            <span className="text-4xl sm:text-5xl font-display font-bold text-gray-800">
              {letter.upper}
            </span>
            <span className="text-sm font-display text-gray-500 mt-1">{letter.name}</span>
          </div>
          {/* Back */}
          <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-ua-blue to-ua-blue-dark rounded-xl">
            <span className="text-xl font-display font-bold text-white">
              {letter.transliteration}
            </span>
            <span className="text-sm text-white/70">{letter.ipa}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        className={`flip-card rounded-2xl border-2 ${categoryColors[letter.category]} shadow-lg ${flipped ? "flipped" : ""}`}
        onClick={onClick}
      >
        <div className="flip-card-inner min-h-80 relative">
          {/* Front */}
          <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-8">
            <span
              className={`text-xs font-display font-semibold px-3 py-1 rounded-full mb-4 ${categoryBadge[letter.category]}`}
            >
              {letter.category}
            </span>
            <span className="text-8xl font-display font-bold text-gray-800">
              {letter.upper}
            </span>
            <span className="text-4xl font-display text-gray-400 mt-2">{letter.lower}</span>
            <span className="text-lg font-display text-gray-500 mt-4">
              "{letter.name}"
            </span>
            <p className="text-sm text-gray-400 mt-2">Click to flip</p>
          </div>
          {/* Back */}
          <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-ua-blue to-ua-blue-dark rounded-2xl text-white">
            <span className="text-5xl font-display font-bold">{letter.transliteration}</span>
            <span className="text-xl text-white/70 mt-2">{letter.ipa}</span>
            <p className="text-lg font-display mt-4 text-center">
              Sounds like {letter.hint}
            </p>
            <div className="mt-6 bg-white/10 rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-display">{letter.exampleWord}</p>
              <p className="text-sm text-white/70">"{letter.exampleMeaning}"</p>
            </div>
            {onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak();
                }}
                className="mt-4 bg-ua-yellow text-ua-blue-dark font-display font-semibold px-6 py-2 rounded-full btn-glow-yellow transition-all"
              >
                Listen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
