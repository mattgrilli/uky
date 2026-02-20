import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { lessons, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import Confetti from "../components/Confetti";

const ROUND_SECONDS = 60;

interface WordWithLesson extends VocabWord {
  lessonId: string;
}

const allWords: WordWithLesson[] = lessons.flatMap((l) =>
  l.words.map((w) => ({ ...w, lessonId: l.id }))
);

function nextQuestion(exclude?: string): { word: WordWithLesson; options: [string, string]; correctIndex: number } {
  const pool = exclude ? allWords.filter((w) => w.uk !== exclude) : allWords;
  const word = shuffle(pool)[0];
  const wrong = shuffle(allWords.filter((w) => w.en !== word.en))[0];
  const options: [string, string] = Math.random() < 0.5
    ? [word.en, wrong.en]
    : [wrong.en, word.en];
  return {
    word,
    options,
    correctIndex: options.indexOf(word.en),
  };
}

export default function SpeedRound() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [question, setQuestion] = useState(() => nextQuestion());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const startGame = () => {
    setStarted(true);
    setFinished(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setTotal(0);
    setStreak(0);
    setBestStreak(0);
    setQuestion(nextQuestion());
    setFlash(null);
  };

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (finished || flash) return;
      const isCorrect = idx === question.correctIndex;
      setTotal((t) => t + 1);
      recordWordResult(question.word.lessonId, question.word.uk, isCorrect);

      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setFlash("correct");
      } else {
        setStreak(0);
        setFlash("wrong");
      }

      setTimeout(() => {
        setFlash(null);
        setQuestion(nextQuestion(question.word.uk));
      }, 300);
    },
    [finished, flash, question]
  );

  const playAudio = useCallback(() => {
    const audio = new Audio(getVocabAudioPath(question.word.lessonId, question.word.audioIndex));
    audio.play().catch(() => {});
  }, [question]);

  if (!started) {
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-4">Speed Round</h1>
        <div className="text-8xl mb-6">⚡</div>
        <p className="text-gray-500 mb-2">
          You have <strong>60 seconds</strong> to answer as many as you can.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Pick the correct English translation — two choices, fast pace!
        </p>
        <button
          onClick={startGame}
          className="bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-ua-blue-dark transition-colors"
        >
          Start!
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const isHighScore = score >= 20;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">⚡ Time's Up!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">{score}</p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-1">
          {score}/{total} correct ({pct}%)
        </p>
        <p className="text-gray-400 mb-2">
          Best streak: {bestStreak} in a row
        </p>
        <p className="text-gray-400 mb-8">
          {score >= 30 ? "Lightning fast!" : score >= 20 ? "Great speed!" : score >= 10 ? "Good effort!" : "Keep practicing!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={startGame}
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
      {/* Header with timer */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold text-ua-blue">Speed Round</h1>
        <div className={`text-2xl font-bold font-mono ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-700"}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 10 ? "bg-red-500" : "bg-gradient-bar"}`}
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-center gap-6 mb-6 text-sm">
        <span className="text-gray-500">
          Score: <strong className="text-ua-blue">{score}</strong>
        </span>
        <span className="text-gray-500 font-display">
          Streak: <strong className={`${streak >= 10 ? "text-orange-500 animate-glow" : streak >= 5 ? "text-orange-500" : "text-gray-700"}`}>{streak}</strong>
          {streak >= 10 ? " 🔥🔥" : streak >= 5 ? " 🔥" : ""}
        </span>
      </div>

      {/* Question card */}
      <div
        className={`bg-white rounded-xl shadow-lg p-6 mb-6 text-center transition-colors ${
          flash === "correct" ? "ring-4 ring-green-400 shadow-lg shadow-green-200" : flash === "wrong" ? "ring-4 ring-red-400 shadow-lg shadow-red-200" : ""
        }`}
      >
        <p className="text-4xl font-bold text-gray-800 mb-2">{question.word.uk}</p>
        <p className="text-sm text-gray-400">{question.word.translit}</p>
        <button
          type="button"
          onClick={playAudio}
          className="mt-2 text-sm text-ua-blue bg-ua-blue-light px-4 py-2 rounded-full inline-flex items-center gap-1 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Listen
        </button>
      </div>

      {/* Two-option buttons */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((opt, i) => (
          <button
            key={`${total}-${i}`}
            onClick={() => handleAnswer(i)}
            className="px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg font-medium text-gray-700 hover:border-ua-blue hover:bg-ua-blue-light transition-all active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
