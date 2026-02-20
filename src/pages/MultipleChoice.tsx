import { useState, useCallback, useEffect } from "react";
import { quizzableLetters, shuffle, type UkrainianLetter } from "../data/alphabet";
import QuizOption from "../components/QuizOption";
import ProgressBar from "../components/ProgressBar";
import { useSpeech } from "../hooks/useSpeech";
import { useProgress } from "../hooks/useProgress";
import { Link } from "react-router-dom";
import Confetti from "../components/Confetti";

const TOTAL_QUESTIONS = 10;

type Mode = "transliteration" | "hint";

interface Question {
  letter: UkrainianLetter;
  options: string[];
  correctIndex: number;
}

function generateQuestions(mode: Mode): Question[] {
  const selected = shuffle(quizzableLetters).slice(0, TOTAL_QUESTIONS);
  return selected.map((letter) => {
    const correct =
      mode === "transliteration" ? letter.transliteration : letter.hint;
    const distractors = shuffle(
      quizzableLetters.filter((l) => l.index !== letter.index)
    )
      .slice(0, 3)
      .map((l) => (mode === "transliteration" ? l.transliteration : l.hint));

    const options = shuffle([correct, ...distractors]);
    return {
      letter,
      options,
      correctIndex: options.indexOf(correct),
    };
  });
}

export default function MultipleChoice() {
  const [mode, setMode] = useState<Mode>("transliteration");
  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuestions("transliteration")
  );
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { say, supported } = useSpeech();
  const { updateGameScore } = useProgress();

  const current = questions[qi];

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected(idx);
      setAnswered(true);
      const isCorrect = idx === current.correctIndex;
      if (isCorrect) {
        setScore((s) => s + 1);
        if (supported) say(current.letter.lower);
      }
    },
    [answered, current, supported, say]
  );

  const handleNext = useCallback(() => {
    if (qi + 1 >= TOTAL_QUESTIONS) {
      const finalScore = score + (selected === current.correctIndex ? 0 : 0);
      updateGameScore("quiz", finalScore);
      setFinished(true);
    } else {
      setQi((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [qi, score, selected, current.correctIndex, updateGameScore]);

  // Auto-advance after answering
  useEffect(() => {
    if (!answered) return;
    const timer = setTimeout(handleNext, 1500);
    return () => clearTimeout(timer);
  }, [answered, handleNext]);

  const restart = (newMode: Mode) => {
    setMode(newMode);
    setQuestions(generateQuestions(newMode));
    setQi(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const isHighScore = score >= 8;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🎯 Quiz Complete!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">
          {score}/{TOTAL_QUESTIONS}
        </p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-8">
          {score >= 8
            ? "Excellent work!"
            : score >= 5
              ? "Good effort! Keep practicing."
              : "Keep studying, you'll get there!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => restart(mode)}
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
        <h1 className="text-2xl font-display font-bold text-ua-blue">Multiple Choice</h1>
        <div className="flex gap-2">
          <button
            onClick={() => restart("transliteration")}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all active:scale-95 ${
              mode === "transliteration"
                ? "bg-ua-blue text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Transliteration
          </button>
          <button
            onClick={() => restart("hint")}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all active:scale-95 ${
              mode === "hint"
                ? "bg-ua-blue text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Pronunciation
          </button>
        </div>
      </div>

      <ProgressBar current={qi + 1} total={TOTAL_QUESTIONS} />

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-2">
          What is the {mode === "transliteration" ? "transliteration" : "pronunciation"} of:
        </p>
        <span className="text-8xl font-bold text-gray-800">
          {current.letter.upper}
        </span>
        <p className="text-gray-400 mt-2">"{current.letter.name}"</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        {current.options.map((opt, i) => (
          <QuizOption
            key={`${qi}-${i}`}
            label={opt}
            selected={selected === i}
            correct={
              answered
                ? i === current.correctIndex
                  ? true
                  : selected === i
                    ? false
                    : null
                : null
            }
            onClick={() => handleSelect(i)}
            disabled={answered}
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Score: {score}/{qi + (answered ? 1 : 0)}
      </p>
    </div>
  );
}
