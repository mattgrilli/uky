import type { UkrainianLetter } from "../data/alphabet";

const categoryColors: Record<string, string> = {
  vowel: "border-ua-blue bg-white",
  consonant: "border-gray-400 bg-white",
  semivowel: "border-ua-yellow bg-white",
  sign: "border-amber-600 bg-white",
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
          shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer select-none`}
      >
        <div className={`flip-card-inner w-full h-full relative ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center p-2">
            <span className="text-4xl sm:text-5xl font-bold text-gray-800">
              {letter.upper}
            </span>
            <span className="text-sm text-gray-500 mt-1">{letter.name}</span>
          </div>
          {/* Back */}
          <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center p-2 bg-ua-blue rounded-xl">
            <span className="text-xl font-bold text-white">
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
              className={`text-xs px-2 py-0.5 rounded-full mb-4 ${categoryBadge[letter.category]}`}
            >
              {letter.category}
            </span>
            <span className="text-8xl font-bold text-gray-800">
              {letter.upper}
            </span>
            <span className="text-4xl text-gray-400 mt-2">{letter.lower}</span>
            <span className="text-lg text-gray-500 mt-4">
              "{letter.name}"
            </span>
            <p className="text-sm text-gray-400 mt-2">Click to flip</p>
          </div>
          {/* Back */}
          <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center p-8 bg-ua-blue rounded-2xl text-white">
            <span className="text-5xl font-bold">{letter.transliteration}</span>
            <span className="text-xl text-white/70 mt-2">{letter.ipa}</span>
            <p className="text-lg mt-4 text-center">
              Sounds like {letter.hint}
            </p>
            <div className="mt-6 bg-white/10 rounded-lg px-4 py-3 text-center">
              <p className="text-2xl">{letter.exampleWord}</p>
              <p className="text-sm text-white/70">"{letter.exampleMeaning}"</p>
            </div>
            {onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak();
                }}
                className="mt-4 bg-ua-yellow text-ua-blue-dark font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors"
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
