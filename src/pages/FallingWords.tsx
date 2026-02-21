import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { lessons, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import Confetti from "../components/Confetti";

interface WordWithLesson extends VocabWord {
  lessonId: string;
}

interface FallingWordData {
  word: WordWithLesson;
  x: number;
  delay: number;
  id: number;
}

const INITIAL_LIVES = 3;
const BASE_DURATION = 4.5;
const MIN_DURATION = 2.2;
const SPEED_STEP = 0.2;
const POINTS_BASE = 10;

function getMultiplier(streak: number) {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  return 1;
}

function getColumns(count: number): number[] {
  if (count <= 1) return [50];
  if (count === 2) return [30, 70];
  if (count === 3) return [20, 50, 80];
  return [15, 38, 62, 85];
}

export default function FallingWords() {
  const { unitNum } = useParams<{ unitNum: string }>();
  const unit = Number(unitNum);

  const unitLessons = lessons.filter((l) => l.classUnit === unit);
  const wordPool: WordWithLesson[] = unitLessons.flatMap((l) =>
    l.words.map((w) => ({ ...w, lessonId: l.id }))
  );

  // Display state
  const [phase, setPhase] = useState<"start" | "playing" | "gameover">("start");
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [target, setTarget] = useState<WordWithLesson | null>(null);
  const [falling, setFalling] = useState<FallingWordData[]>([]);
  const [fallDuration, setFallDuration] = useState(BASE_DURATION);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [tappedId, setTappedId] = useState<number | null>(null);
  const [missedWords, setMissedWords] = useState<WordWithLesson[]>([]);

  // Mutable game state for timeout closures
  const g = useRef({
    lives: INITIAL_LIVES,
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    fallDuration: BASE_DURATION,
    resolved: false,
    target: null as WordWithLesson | null,
  });
  const waveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  function syncDisplay() {
    const s = g.current;
    setLives(s.lives);
    setScore(s.score);
    setStreak(s.streak);
    setBestStreak(s.bestStreak);
    setCorrectCount(s.correctCount);
    setFallDuration(s.fallDuration);
  }

  function clearTimers() {
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
  }

  function spawnWave() {
    if (wordPool.length === 0) return;
    const s = g.current;
    s.resolved = false;

    const newTarget = shuffle([...wordPool])[0];
    s.target = newTarget;

    const numTotal = Math.min(3 + Math.floor(s.correctCount / 8), 4, wordPool.length);
    const distractors = shuffle(
      wordPool.filter((w) => w.uk !== newTarget.uk)
    ).slice(0, numTotal - 1);
    const words = shuffle([newTarget, ...distractors]);

    const cols = shuffle([...getColumns(words.length)]);
    const items: FallingWordData[] = words.map((w, i) => ({
      word: w,
      x: cols[i],
      delay: i * 0.4,
      id: ++idRef.current,
    }));

    setFlash(null);
    setTappedId(null);
    setTarget(newTarget);
    setFalling(items);

    const maxDelay = (words.length - 1) * 0.4;
    const timeoutMs = (s.fallDuration + maxDelay + 0.3) * 1000;
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);
    waveTimerRef.current = setTimeout(() => {
      if (s.resolved) return;
      s.resolved = true;
      s.lives -= 1;
      s.streak = 0;
      syncDisplay();
      setFlash("wrong");
      setMissedWords((m) => [...m, newTarget]);
      recordWordResult(newTarget.lessonId, newTarget.uk, false);

      if (s.lives <= 0) {
        nextTimerRef.current = setTimeout(() => {
          setFlash(null);
          setPhase("gameover");
        }, 800);
      } else {
        nextTimerRef.current = setTimeout(spawnWave, 900);
      }
    }, timeoutMs);
  }

  function handleTap(fw: FallingWordData) {
    const s = g.current;
    if (s.resolved) return;
    s.resolved = true;
    if (waveTimerRef.current) clearTimeout(waveTimerRef.current);

    setTappedId(fw.id);

    const audio = new Audio(getVocabAudioPath(fw.word.lessonId, fw.word.audioIndex));
    audio.play().catch(() => {});

    const isCorrect = fw.word.uk === s.target?.uk;
    recordWordResult(fw.word.lessonId, fw.word.uk, isCorrect);

    if (isCorrect) {
      s.correctCount += 1;
      s.streak += 1;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      s.score += POINTS_BASE * getMultiplier(s.streak);
      if (s.correctCount % 5 === 0) {
        s.fallDuration = Math.max(MIN_DURATION, s.fallDuration - SPEED_STEP);
      }
      syncDisplay();
      setFlash("correct");
      nextTimerRef.current = setTimeout(spawnWave, 700);
    } else {
      s.lives -= 1;
      s.streak = 0;
      syncDisplay();
      setFlash("wrong");
      if (s.target) setMissedWords((m) => [...m, s.target!]);

      if (s.lives <= 0) {
        nextTimerRef.current = setTimeout(() => {
          setFlash(null);
          setPhase("gameover");
        }, 800);
      } else {
        nextTimerRef.current = setTimeout(spawnWave, 900);
      }
    }
  }

  function startGame() {
    clearTimers();
    g.current = {
      lives: INITIAL_LIVES,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correctCount: 0,
      fallDuration: BASE_DURATION,
      resolved: false,
      target: null,
    };
    syncDisplay();
    setMissedWords([]);
    setFalling([]);
    setTarget(null);
    setTappedId(null);
    setFlash(null);
    setPhase("playing");
    setTimeout(spawnWave, 150);
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (unitLessons.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No lessons found for Unit {unitNum}.</p>
        <Link
          to="/"
          className="text-ua-blue bg-ua-blue-light px-6 py-3 rounded-full mt-4 inline-block font-medium active:scale-95 transition-all"
        >
          Home
        </Link>
      </div>
    );
  }

  if (phase === "start") {
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2">
          Falling Words
        </h1>
        <p className="text-lg text-gray-600 font-display mb-1">Unit {unit}</p>
        <div className="text-8xl my-6">🌊</div>
        <p className="text-gray-500 mb-2">
          Ukrainian words fall from the sky — tap the correct translation!
        </p>
        <p className="text-gray-400 text-sm mb-2">
          {wordPool.length} words from {unitLessons.length} lesson
          {unitLessons.length !== 1 ? "s" : ""}
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-400 mb-8">
          <span>❤️ 3 lives</span>
          <span>🔥 Streaks</span>
          <span>⚡ Gets faster</span>
        </div>
        <button
          onClick={startGame}
          className="bg-ua-blue text-white px-10 py-4 rounded-full text-xl font-display font-bold btn-glow active:scale-95 transition-all"
        >
          Start!
        </button>
      </div>
    );
  }

  if (phase === "gameover") {
    const isHighScore = score >= 200;
    const uniqueMissed = missedWords.filter(
      (w, i, arr) => arr.findIndex((x) => x.uk === w.uk) === i
    );
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">
          🌊 Game Over!
        </h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">
          {score}
        </p>
        {isHighScore && (
          <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>
        )}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-2">
          <span>{correctCount} correct</span>
          <span>Best streak: {bestStreak}</span>
        </div>
        <p className="text-gray-400 mb-6">
          {score >= 300
            ? "Incredible!"
            : score >= 200
              ? "Amazing speed!"
              : score >= 100
                ? "Great job!"
                : "Keep practicing!"}
        </p>
        {uniqueMissed.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-red-700 mb-2">
              Words to review:
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueMissed.map((w) => (
                <span
                  key={w.uk}
                  className="text-xs bg-white px-2 py-1 rounded border border-red-200 text-red-600"
                >
                  {w.uk} — {w.en}
                </span>
              ))}
            </div>
          </div>
        )}
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

  // PLAYING
  const mult = getMultiplier(streak);

  return (
    <div className="page-enter flex flex-col" style={{ height: "calc(100dvh - 5rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 flex-shrink-0">
        <div className="flex gap-0.5">
          {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
            <span
              key={i}
              className={`text-xl transition-all duration-300 ${
                i < lives ? "" : "opacity-20 grayscale"
              }`}
            >
              ❤️
            </span>
          ))}
        </div>
        <div className="text-center">
          <span className="text-2xl font-display font-bold text-ua-blue">
            {score}
          </span>
          {mult > 1 && (
            <span className="ml-1 text-sm font-bold text-orange-500 animate-pulse">
              {mult}x
            </span>
          )}
        </div>
        <div className="text-right min-w-12">
          {streak > 0 && (
            <span
              className={`text-sm font-bold ${
                streak >= 10
                  ? "text-orange-500"
                  : streak >= 5
                    ? "text-orange-400"
                    : "text-gray-500"
              }`}
            >
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      {/* Falling area */}
      <div
        className={`relative flex-1 overflow-hidden rounded-2xl mx-1 transition-colors duration-300 ${
          flash === "correct"
            ? "bg-green-50 ring-2 ring-green-300"
            : flash === "wrong"
              ? "bg-red-50 ring-2 ring-red-300"
              : "bg-gray-50/50"
        }`}
      >
        {falling.map((fw) => {
          const isTapped = tappedId === fw.id;
          const isCorrectWord = fw.word.uk === target?.uk;
          return (
            <button
              key={fw.id}
              onClick={() => handleTap(fw)}
              className={`falling-word absolute -translate-x-1/2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full font-bold text-base sm:text-lg select-none whitespace-nowrap transition-shadow ${
                isTapped
                  ? isCorrectWord
                    ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-300 z-10"
                    : "bg-red-500 text-white scale-110 shadow-lg shadow-red-300 z-10"
                  : "bg-white border-2 border-ua-blue text-ua-blue shadow-md active:scale-95 cursor-pointer"
              }`}
              style={{
                left: `${fw.x}%`,
                animationDuration: `${fallDuration}s`,
                animationDelay: `${fw.delay}s`,
                animationPlayState: tappedId !== null ? "paused" : "running",
              }}
            >
              {fw.word.uk}
            </button>
          );
        })}
      </div>

      {/* Target prompt */}
      <div
        className={`text-center py-4 px-4 flex-shrink-0 rounded-2xl mx-1 mt-2 transition-colors duration-300 ${
          flash === "correct"
            ? "bg-green-100"
            : flash === "wrong"
              ? "bg-red-100"
              : "bg-white"
        }`}
      >
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
          Tap the Ukrainian for
        </p>
        <p className="text-2xl sm:text-3xl font-display font-bold text-gray-800">
          {target?.en}
        </p>
      </div>
    </div>
  );
}
