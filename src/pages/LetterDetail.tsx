import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { alphabet, getLetterByIndex } from "../data/alphabet";
import LetterCard from "../components/LetterCard";
import { useSpeech } from "../hooks/useSpeech";
import { useProgress } from "../hooks/useProgress";

export default function LetterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { say, speaking } = useSpeech();
  const { progress, markLetterLearned } = useProgress();
  const [flipped, setFlipped] = useState(false);

  const index = Number(id);
  const letter = getLetterByIndex(index);

  if (!letter) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Letter not found.</p>
        <Link to="/alphabet" className="text-ua-blue bg-ua-blue-light px-6 py-3 rounded-full mt-4 inline-block font-medium active:scale-95 transition-all">
          Back to Alphabet
        </Link>
      </div>
    );
  }

  const isLearned = progress.learnedLetters.includes(letter.index);
  const prevIndex = letter.index > 1 ? letter.index - 1 : null;
  const nextIndex = letter.index < alphabet.length ? letter.index + 1 : null;

  return (
    <div className="page-enter max-w-lg mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/alphabet"
          className="text-sm text-ua-blue bg-gray-100 px-4 py-2 rounded-full hover:bg-ua-blue-light active:scale-95 transition-all"
        >
          &larr; All Letters
        </Link>
        <span className="text-gray-400 text-sm">
          {letter.index} of {alphabet.length}
        </span>
      </div>

      {/* Letter Card */}
      <LetterCard
        letter={letter}
        flipped={flipped}
        onClick={() => setFlipped(!flipped)}
        onSpeak={() => say(letter.lower)}
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        <button
          onClick={() => say(letter.lower)}
          disabled={speaking}
          className="bg-ua-blue text-white px-6 py-3 rounded-full hover:bg-ua-blue-dark active:scale-95 transition-all disabled:opacity-50 text-base"
        >
          {speaking ? "Playing..." : `Listen "${letter.upper}"`}
        </button>
        <button
          onClick={() => say(letter.exampleWord)}
          disabled={speaking}
          className="bg-white text-ua-blue border-2 border-ua-blue px-6 py-3 rounded-full hover:bg-ua-blue-light active:scale-95 transition-all disabled:opacity-50 text-base"
        >
          {`Hear "${letter.exampleWord}"`}
        </button>
        <button
          onClick={() => markLetterLearned(letter.index)}
          disabled={isLearned}
          className={`px-6 py-3 rounded-full font-medium transition-all active:scale-95 text-base ${
            isLearned
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-ua-yellow text-ua-blue-dark hover:bg-yellow-300 cursor-pointer"
          }`}
        >
          {isLearned ? "Learned!" : "Mark as Learned"}
        </button>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between mt-10 gap-4">
        {prevIndex ? (
          <button
            onClick={() => {
              setFlipped(false);
              navigate(`/alphabet/${prevIndex}`);
            }}
            className="flex-1 py-3 px-5 rounded-xl border-2 border-ua-blue text-ua-blue font-medium
              hover:bg-ua-blue-light active:scale-95 transition-all text-lg"
          >
            &larr; {getLetterByIndex(prevIndex)?.upper}
          </button>
        ) : (
          <span className="flex-1" />
        )}
        {nextIndex ? (
          <button
            onClick={() => {
              setFlipped(false);
              navigate(`/alphabet/${nextIndex}`);
            }}
            className="flex-1 py-3 px-5 rounded-xl bg-ua-blue text-white font-medium
              hover:bg-ua-blue-dark active:scale-95 transition-all text-lg"
          >
            {getLetterByIndex(nextIndex)?.upper} &rarr;
          </button>
        ) : (
          <span className="flex-1" />
        )}
      </div>
    </div>
  );
}
