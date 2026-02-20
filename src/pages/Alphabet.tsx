import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  vowels,
  consonants,
  semivowels,
  signs,
  type UkrainianLetter,
} from "../data/alphabet";
import LetterCard from "../components/LetterCard";
import { useSpeech } from "../hooks/useSpeech";

function LetterGroup({
  title,
  count,
  letters,
  onLetterClick,
}: {
  title: string;
  count: number;
  letters: UkrainianLetter[];
  onLetterClick: (letter: UkrainianLetter) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-4 group cursor-pointer"
      >
        <h2 className="text-xl font-bold text-gray-800">
          {title}{" "}
          <span className="text-gray-400 font-normal">({count})</span>
        </h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {letters.map((letter) => (
            <LetterCard
              key={letter.index}
              letter={letter}
              compact
              onClick={() => onLetterClick(letter)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Alphabet() {
  const navigate = useNavigate();
  const { say, supported } = useSpeech();

  const handleClick = (letter: UkrainianLetter) => {
    if (supported) say(letter.lower);
    navigate(`/alphabet/${letter.index}`);
  };

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ua-blue">
          The Ukrainian Alphabet
        </h1>
        <p className="text-gray-500 mt-1">
          33 letters. Click any letter to learn more.
        </p>
      </div>

      <LetterGroup
        title="Vowels"
        count={vowels.length}
        letters={vowels}
        onLetterClick={handleClick}
      />
      <LetterGroup
        title="Consonants"
        count={consonants.length}
        letters={consonants}
        onLetterClick={handleClick}
      />
      <LetterGroup
        title="Semivowel & Sign"
        count={semivowels.length + signs.length}
        letters={[...semivowels, ...signs]}
        onLetterClick={handleClick}
      />
    </div>
  );
}
