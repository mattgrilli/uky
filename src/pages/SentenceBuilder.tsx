import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { sentences, getSentenceAudioPath, type Sentence } from "../data/sentences";
import { shuffle } from "../data/alphabet";
import Confetti from "../components/Confetti";

const QUESTIONS_PER_ROUND = 10;

function pickQuestions(): Sentence[] {
  return shuffle(sentences).slice(0, Math.min(QUESTIONS_PER_ROUND, sentences.length));
}

export default function SentenceBuilder() {
  const [questions, setQuestions] = useState<Sentence[]>(pickQuestions);
  const [qi, setQi] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(() => shuffle([...questions[0].words]));
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = questions[qi];

  const playAudio = useCallback(() => {
    const audio = new Audio(getSentenceAudioPath(current.audioIndex));
    audio.play().catch(() => {});
  }, [current]);

  const reset = useCallback((sentence: Sentence) => {
    setPlaced([]);
    setAvailable(shuffle([...sentence.words]));
    setChecked(false);
    setCorrect(false);
    setShowHint(false);
  }, []);

  const handleTapAvailable = (idx: number) => {
    if (checked) return;
    const word = available[idx];
    setPlaced((p) => [...p, word]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const handleTapPlaced = (idx: number) => {
    if (checked) return;
    const word = placed[idx];
    setAvailable((a) => [...a, word]);
    setPlaced((p) => p.filter((_, i) => i !== idx));
  };

  const handleCheck = () => {
    const isCorrect = placed.join(" ") === current.words.join(" ");
    setChecked(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setMistakes((m) => m + 1);
    }
    // Play audio on check
    const audio = new Audio(getSentenceAudioPath(current.audioIndex));
    audio.play().catch(() => {});
  };

  const handleNext = () => {
    if (qi + 1 >= questions.length) {
      setFinished(true);
    } else {
      const nextQ = qi + 1;
      setQi(nextQ);
      reset(questions[nextQ]);
    }
  };

  const handleTryAgain = () => {
    reset(current);
  };

  const restart = () => {
    const q = pickQuestions();
    setQuestions(q);
    setQi(0);
    setScore(0);
    setMistakes(0);
    setFinished(false);
    reset(q[0]);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const isHighScore = pct >= 80;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🧩 Complete!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">{pct}%</p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-2">
          {score}/{questions.length} correct with {mistakes} mistake{mistakes !== 1 ? "s" : ""}
        </p>
        <p className="text-gray-400 mb-8">
          {pct >= 80 ? "Excellent sentence building!" : pct >= 50 ? "Good effort!" : "Keep practicing!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={restart}
            className="font-display bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold btn-glow active:scale-95 transition-all"
          >
            Play Again
          </button>
          <Link
            to="/"
            className="font-display border-2 border-ua-blue text-ua-blue px-8 py-3 rounded-full text-lg font-semibold hover:bg-ua-blue-light active:scale-95 transition-all"
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
        <h1 className="text-2xl font-display font-bold text-ua-blue">Sentence Builder</h1>
        <span className="text-sm text-gray-400">
          {qi + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-ua-blue h-2 rounded-full transition-all"
          style={{ width: `${((qi + (checked && correct ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Prompt */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 text-center">
        <p className="text-sm text-gray-400 mb-1">Translate into Ukrainian:</p>
        <p className="text-xl font-semibold text-gray-800">{current.en}</p>

        {/* Hint & audio buttons */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-ua-blue bg-ua-blue-light px-4 py-2 rounded-full inline-flex items-center gap-1 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          <button
            type="button"
            onClick={playAudio}
            className="text-sm text-ua-blue bg-ua-blue-light px-4 py-2 rounded-full inline-flex items-center gap-1 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Listen
          </button>
        </div>

        {showHint && (
          <p className="text-sm text-ua-blue mt-2 italic">{current.translit}</p>
        )}
      </div>

      {/* Difficulty indicator */}
      <div className="flex justify-center gap-1 mb-4">
        {[1, 2, 3].map((d) => (
          <span
            key={d}
            className={`w-2 h-2 rounded-full ${
              d <= current.difficulty ? "bg-ua-blue" : "bg-gray-200"
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">
          {current.difficulty === 1 ? "Easy" : current.difficulty === 2 ? "Medium" : "Hard"}
        </span>
      </div>

      {/* Placed words area */}
      <div className="min-h-16 bg-white rounded-xl shadow-inner border-2 border-dashed border-gray-200 p-3 mb-4 flex flex-wrap gap-2 items-start">
        {placed.length === 0 && !checked && (
          <p className="text-gray-300 text-sm m-auto">Tap words below to build the sentence</p>
        )}
        {placed.map((word, i) => (
          <button
            key={`p-${i}`}
            onClick={() => handleTapPlaced(i)}
            disabled={checked}
            className={`px-4 py-2 rounded-lg font-medium text-lg transition-all ${
              checked
                ? correct
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-red-100 text-red-700 border-2 border-red-300"
                : "bg-ua-blue text-white hover:bg-ua-blue-dark cursor-pointer"
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {available.map((word, i) => (
          <button
            key={`a-${i}`}
            onClick={() => handleTapAvailable(i)}
            disabled={checked}
            className="px-4 py-2 rounded-lg font-medium text-lg bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-ua-blue hover:bg-ua-blue-light cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Feedback & controls */}
      {checked && (
        <div className={`rounded-xl p-4 mb-4 text-center ${correct ? "bg-green-50" : "bg-red-50"}`}>
          {correct ? (
            <p className="text-green-700 font-semibold animate-pop">Correct!</p>
          ) : (
            <>
              <p className="text-red-700 font-semibold animate-shake">Not quite!</p>
              <p className="text-sm text-gray-500 mt-1">
                Correct: <span className="font-medium text-gray-700">{current.words.join(" ")}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{current.translit}</p>
            </>
          )}
          <button
            type="button"
            onClick={playAudio}
            className="mt-2 text-sm text-ua-blue bg-ua-blue-light px-4 py-2 rounded-full inline-flex items-center gap-1 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Listen again
          </button>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {!checked && (
          <button
            onClick={handleCheck}
            disabled={placed.length === 0}
            className="bg-ua-blue text-white px-6 py-3 rounded-full text-base font-medium hover:bg-ua-blue-dark active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        )}
        {checked && !correct && (
          <button
            onClick={handleTryAgain}
            className="border-2 border-ua-blue text-ua-blue px-6 py-3 rounded-full text-base font-medium hover:bg-ua-blue-light active:scale-95 transition-all"
          >
            Try Again
          </button>
        )}
        {checked && (
          <button
            onClick={handleNext}
            className="bg-ua-blue text-white px-6 py-3 rounded-full text-base font-medium hover:bg-ua-blue-dark active:scale-95 transition-all"
          >
            {qi + 1 >= questions.length ? "See Results" : "Next"}
          </button>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Score: {score}/{qi + (checked ? 1 : 0)}
      </p>
    </div>
  );
}
