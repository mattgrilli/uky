import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { lessons, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle, alphabet } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import ProgressBar from "../components/ProgressBar";

const TOTAL_QUESTIONS = 10;

const keyboardRows = [
  ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
  ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є"],
  ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ґ"],
];

interface WordWithLesson extends VocabWord {
  lessonId: string;
}

const allWords: WordWithLesson[] = lessons.flatMap((l) =>
  l.words.map((w) => ({ ...w, lessonId: l.id }))
);

// Filter to single-word items only (no spaces) for cleaner spelling
const spellableWords = allWords.filter((w) => !w.uk.includes(" ") && w.uk.length <= 15);

function pickQuestions(): WordWithLesson[] {
  const pool = spellableWords.length >= TOTAL_QUESTIONS ? spellableWords : allWords;
  return shuffle(pool).slice(0, TOTAL_QUESTIONS);
}

export default function SpellIt() {
  const [questions, setQuestions] = useState<WordWithLesson[]>(pickQuestions);
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = questions[qi];

  useEffect(() => {
    inputRef.current?.focus();
  }, [qi]);

  const playAudio = useCallback(() => {
    if (!current) return;
    const audio = new Audio(getVocabAudioPath(current.lessonId, current.audioIndex));
    audio.play().catch(() => {});
  }, [current]);

  const normalizeUk = (s: string) =>
    s.toLowerCase().replace(/[?!.,'"«»\s]/g, "").trim();

  const handleSubmit = useCallback(() => {
    if (feedback || !current || input.trim().length === 0) return;
    const isCorrect = normalizeUk(input) === normalizeUk(current.uk);
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + 1);
    recordWordResult(current.lessonId, current.uk, isCorrect);
    playAudio();
  }, [feedback, current, input, playAudio]);

  const handleNext = useCallback(() => {
    if (qi + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQi((q) => q + 1);
      setInput("");
      setFeedback(null);
      setShowHint(false);
    }
  }, [qi, questions.length]);

  useEffect(() => {
    if (feedback === null) return;
    const delay = feedback === "correct" ? 1500 : 3000;
    const timer = setTimeout(handleNext, delay);
    return () => clearTimeout(timer);
  }, [feedback, handleNext]);

  const handleVirtualKey = (key: string) => {
    if (feedback) return;
    setInput((prev) => prev + key);
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    if (feedback) return;
    setInput((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const restart = () => {
    const q = pickQuestions();
    setQuestions(q);
    setQi(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
    setShowHint(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-ua-blue mb-2">Spelling Complete!</h1>
        <p className="text-6xl font-bold text-ua-yellow my-6">{pct}%</p>
        <p className="text-gray-500 mb-2">
          {score}/{questions.length} correct
        </p>
        <p className="text-gray-400 mb-8">
          {pct >= 80 ? "Amazing speller!" : pct >= 50 ? "Getting there!" : "Keep practicing!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={restart}
            className="bg-ua-blue text-white px-6 py-2 rounded-full hover:bg-ua-blue-dark transition-colors"
          >
            Play Again
          </button>
          <Link
            to="/"
            className="border-2 border-ua-blue text-ua-blue px-6 py-2 rounded-full hover:bg-ua-blue-light transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-ua-blue">Spell It</h1>
        <span className="text-sm text-gray-400">
          {qi + 1}/{questions.length}
        </span>
      </div>

      <ProgressBar current={qi + (feedback ? 1 : 0)} total={questions.length} />

      {/* Prompt */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm mb-2">Spell the Ukrainian word for:</p>
        <p className="text-3xl font-bold text-gray-800">{current.en}</p>
        {current.note && (
          <p className="text-sm text-gray-400 mt-1 italic">{current.note}</p>
        )}

        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={playAudio}
            className="text-sm text-ua-blue hover:underline inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Listen
          </button>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-ua-blue hover:underline inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHint ? "Hide hint" : "Hint"}
          </button>
        </div>

        {showHint && (
          <p className="text-sm text-ua-blue mt-2 italic">{current.translit}</p>
        )}
      </div>

      {/* Input area */}
      <div className="mt-6 text-center">
        <div className="relative inline-block w-full max-w-xs">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { if (!feedback) setInput(e.target.value); }}
            onKeyDown={handleKeyDown}
            className={`text-center text-2xl font-bold w-full px-4 py-3 rounded-xl border-4 outline-none transition-colors ${
              feedback === "correct"
                ? "border-green-500 bg-green-50 text-green-700"
                : feedback === "incorrect"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-ua-blue bg-white text-gray-800 focus:border-ua-yellow"
            }`}
            placeholder="Type here..."
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>

        {!feedback && (
          <div className="mt-3">
            <button
              onClick={handleSubmit}
              disabled={input.trim().length === 0}
              className="bg-ua-blue text-white px-6 py-2 rounded-full hover:bg-ua-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
          </div>
        )}

        {feedback === "correct" && (
          <p className="mt-3 text-green-600 font-semibold animate-pop">
            Correct! {current.uk}
          </p>
        )}
        {feedback === "incorrect" && (
          <div className="mt-3">
            <p className="text-red-500 font-semibold animate-shake">Not quite!</p>
            <p className="text-gray-600 mt-1">
              Correct spelling: <span className="text-2xl font-bold text-gray-800">{current.uk}</span>
            </p>
            <p className="text-sm text-gray-400">{current.translit}</p>
          </div>
        )}
      </div>

      {/* Score */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Score: {score}/{qi + (feedback ? 1 : 0)}
      </p>

      {/* Virtual keyboard */}
      <div className="mt-4 bg-gray-100 rounded-2xl p-3">
        {keyboardRows.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1 mb-1">
            {row.map((key) => {
              const letter = alphabet.find((l) => l.lower === key);
              return (
                <button
                  key={key}
                  onClick={() => handleVirtualKey(key)}
                  disabled={feedback !== null}
                  className="w-8 h-10 sm:w-10 sm:h-11 bg-white rounded-lg shadow text-sm sm:text-base font-medium
                    hover:bg-ua-blue-light hover:text-ua-blue active:bg-ua-blue active:text-white
                    disabled:opacity-50 transition-colors"
                  title={letter ? `${letter.upper} - ${letter.transliteration}` : key}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
        {/* Special keys row */}
        <div className="flex justify-center gap-1 mt-1">
          <button
            onClick={() => handleVirtualKey("'")}
            disabled={feedback !== null}
            className="px-4 h-10 sm:h-11 bg-white rounded-lg shadow text-sm font-medium
              hover:bg-ua-blue-light hover:text-ua-blue active:bg-ua-blue active:text-white
              disabled:opacity-50 transition-colors"
            title="Apostrophe"
          >
            '
          </button>
          <button
            onClick={() => handleVirtualKey(" ")}
            disabled={feedback !== null}
            className="px-8 h-10 sm:h-11 bg-white rounded-lg shadow text-sm font-medium
              hover:bg-ua-blue-light hover:text-ua-blue active:bg-ua-blue active:text-white
              disabled:opacity-50 transition-colors"
          >
            Space
          </button>
          <button
            onClick={handleBackspace}
            disabled={feedback !== null}
            className="px-4 h-10 sm:h-11 bg-white rounded-lg shadow text-sm font-medium
              hover:bg-red-100 hover:text-red-600 active:bg-red-500 active:text-white
              disabled:opacity-50 transition-colors"
            title="Backspace"
          >
            ← Del
          </button>
        </div>
      </div>
    </div>
  );
}
