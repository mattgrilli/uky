import { useState, useRef, useEffect, useCallback } from "react";
import { quizzableLetters, shuffle, alphabet, type UkrainianLetter } from "../data/alphabet";
import ProgressBar from "../components/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import { Link } from "react-router-dom";
import Confetti from "../components/Confetti";

const TOTAL_QUESTIONS = 15;

// Virtual keyboard layout (4 rows matching Ukrainian keyboard)
const keyboardRows = [
  ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
  ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є"],
  ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ґ"],
];

export default function TypingPractice() {
  const [questions] = useState<UkrainianLetter[]>(() =>
    shuffle(quizzableLetters).slice(0, TOTAL_QUESTIONS)
  );
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateGameScore } = useProgress();
  const { say, supported } = useSpeech();

  const current = questions[qi];

  useEffect(() => {
    inputRef.current?.focus();
  }, [qi]);

  const advance = useCallback(() => {
    if (qi + 1 >= TOTAL_QUESTIONS) {
      updateGameScore("typing", score + (feedback === "correct" ? 0 : 0));
      setFinished(true);
    } else {
      setQi((q) => q + 1);
      setInput("");
      setFeedback(null);
    }
  }, [qi, score, feedback, updateGameScore]);

  useEffect(() => {
    if (feedback === null) return;
    const delay = feedback === "correct" ? 800 : 1500;
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [feedback, advance]);

  const checkAnswer = useCallback(
    (value: string) => {
      if (feedback) return;
      setInput(value);
      if (value.length === 0) return;

      const typed = value.charAt(value.length - 1).toLowerCase();
      if (typed === current.lower) {
        setFeedback("correct");
        setScore((s) => s + 1);
        if (supported) say(current.lower);
      } else {
        setFeedback("incorrect");
      }
    },
    [feedback, current, supported, say]
  );

  const handleVirtualKey = (key: string) => {
    if (feedback) return;
    checkAnswer(input + key);
  };

  const restart = () => {
    setQi(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const isHighScore = score >= 12;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">⌨️ Practice Complete!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">
          {score}/{TOTAL_QUESTIONS}
        </p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-8">
          {score >= 12
            ? "Your typing is getting great!"
            : score >= 8
              ? "Good progress! Keep practicing."
              : "Practice makes perfect!"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={restart}
            className="font-display bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold btn-glow active:scale-95 transition-all"
          >
            Try Again
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
        <h1 className="text-2xl font-display font-bold text-ua-blue">Typing Practice</h1>
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className="text-sm px-4 py-2 rounded-full bg-gray-200 text-gray-600 font-medium active:scale-95 transition-all"
        >
          {showKeyboard ? "Hide" : "Show"} Keyboard
        </button>
      </div>

      <ProgressBar current={qi + 1} total={TOTAL_QUESTIONS} />

      <div className="bg-gray-50 rounded-xl p-3 mt-3 text-sm text-gray-500">
        Type the Ukrainian letter shown below. Use the virtual keyboard or switch your keyboard layout (Win+Space).
      </div>

      {/* Prompt */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-1">Type the letter for:</p>
        <p className="text-4xl font-bold text-ua-blue">
          {current.transliteration}
        </p>
        <p className="text-lg text-gray-500 mt-1">{current.ipa}</p>
        <p className="text-sm text-gray-400 mt-1">
          Sounds like {current.hint}
        </p>
      </div>

      {/* Input */}
      <div className="mt-6 text-center">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => checkAnswer(e.target.value)}
          className={`text-center text-5xl font-bold w-24 h-24 rounded-2xl border-4 outline-none transition-colors ${
            feedback === "correct"
              ? "border-green-500 bg-green-50 text-green-700"
              : feedback === "incorrect"
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-ua-blue bg-white text-gray-800 focus:border-ua-yellow"
          }`}
          maxLength={1}
          autoComplete="off"
          autoCapitalize="off"
        />
        {feedback === "incorrect" && (
          <p className="mt-3 text-red-500">
            The correct answer is:{" "}
            <span className="text-2xl font-bold">{current.lower}</span>
            {" "}({current.upper})
          </p>
        )}
        {feedback === "correct" && (
          <p className="mt-3 text-green-600 font-medium animate-pop">
            Correct!
          </p>
        )}
      </div>

      {/* Score */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Score: {score}/{qi + (feedback ? 1 : 0)}
      </p>

      {/* Virtual keyboard */}
      {showKeyboard && (
        <div className="mt-6 bg-gray-100 rounded-2xl p-3">
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
        </div>
      )}
    </div>
  );
}
