import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import ProgressBar from "../components/ProgressBar";
import Confetti from "../components/Confetti";

const PAIRS_PER_ROUND = 5;

interface RoundState {
  words: VocabWord[];
  shuffledRight: VocabWord[];
  matched: Set<number>;
  selectedLeft: number | null;
  selectedRight: number | null;
  wrongPair: [number, number] | null;
  mistakes: number;
}

function newRound(allWords: VocabWord[], exclude: Set<number>): RoundState {
  const available = allWords.filter((_, i) => !exclude.has(i));
  const words = shuffle(available).slice(0, Math.min(PAIRS_PER_ROUND, available.length));
  return {
    words,
    shuffledRight: shuffle([...words]),
    matched: new Set(),
    selectedLeft: null,
    selectedRight: null,
    wrongPair: null,
    mistakes: 0,
  };
}

export default function VocabMatch() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  const totalRounds = lesson ? Math.ceil(lesson.words.length / PAIRS_PER_ROUND) : 0;

  const [round, setRound] = useState(1);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [state, setState] = useState<RoundState>(() =>
    lesson ? newRound(lesson.words, new Set()) : ({} as RoundState)
  );
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lesson not found.</p>
        <Link to="/" className="text-ua-blue bg-ua-blue-light px-6 py-3 rounded-full mt-4 inline-block font-medium active:scale-95 transition-all">Home</Link>
      </div>
    );
  }

  const roundComplete = state.matched?.size === state.words?.length;

  const handleLeftClick = (idx: number) => {
    if (!state.words || state.matched.has(idx) || state.wrongPair) return;

    // Play audio
    const word = state.words[idx];
    const audio = new Audio(getVocabAudioPath(lesson.id, word.audioIndex));
    audio.play().catch(() => {});

    setState((s) => ({ ...s, selectedLeft: idx, wrongPair: null }));
  };

  const handleRightClick = useCallback(
    (idx: number) => {
      if (
        state.selectedLeft === null ||
        state.matched.has(idx) ||
        state.wrongPair
      )
        return;

      const leftWord = state.words[state.selectedLeft];
      const rightWord = state.shuffledRight[idx];

      if (leftWord.uk === rightWord.uk) {
        setState((s) => {
          const matched = new Set(s.matched);
          matched.add(s.selectedLeft!);
          // Also mark the right index by finding it
          return { ...s, matched, selectedLeft: null, selectedRight: null };
        });
      } else {
        setState((s) => ({
          ...s,
          selectedRight: idx,
          wrongPair: [s.selectedLeft!, idx],
          mistakes: s.mistakes + 1,
        }));
        setTotalMistakes((m) => m + 1);
        setTimeout(() => {
          setState((s) => ({
            ...s,
            selectedLeft: null,
            selectedRight: null,
            wrongPair: null,
          }));
        }, 600);
      }
    },
    [state]
  );

  const nextRound = () => {
    if (round >= totalRounds) {
      setFinished(true);
    } else {
      // Track which word indices we've used
      const newUsed = new Set(usedIndices);
      state.words.forEach((w) => {
        const idx = lesson.words.findIndex((lw) => lw.uk === w.uk);
        if (idx >= 0) newUsed.add(idx);
      });
      setUsedIndices(newUsed);
      setRound((r) => r + 1);
      setState(newRound(lesson.words, newUsed));
    }
  };

  const restart = () => {
    setRound(1);
    setUsedIndices(new Set());
    setState(newRound(lesson.words, new Set()));
    setTotalMistakes(0);
    setFinished(false);
  };

  if (finished) {
    const totalPairs = lesson.words.length;
    const score = Math.max(0, Math.round(((totalPairs - totalMistakes) / totalPairs) * 100));
    const isHighScore = score >= 80;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🔗 Game Over!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">{score}%</p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-2">
          {totalPairs} pairs with {totalMistakes} mistakes
        </p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <button
            onClick={restart}
            className="font-display bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold btn-glow active:scale-95 transition-all"
          >
            Play Again
          </button>
          <Link
            to={`/lessons/${lesson.id}`}
            className="font-display border-2 border-ua-blue text-ua-blue px-8 py-3 rounded-full text-lg font-semibold hover:bg-ua-blue-light active:scale-95 transition-all"
          >
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  // Check if right-side word is matched (by finding if its corresponding left index is matched)
  const isRightMatched = (rightIdx: number) => {
    const rightWord = state.shuffledRight[rightIdx];
    const leftIdx = state.words.findIndex((w) => w.uk === rightWord.uk);
    return state.matched.has(leftIdx);
  };

  return (
    <div className="page-enter max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold text-ua-blue">{lesson.title} Match</h1>
        <span className="text-sm text-gray-500">Mistakes: {state.mistakes}</span>
      </div>

      <ProgressBar current={round} total={totalRounds} label={`Round ${round}`} />

      {roundComplete ? (
        <div className="text-center py-12">
          <p className="text-2xl font-bold text-green-600 mb-4 animate-pop">
            Round Complete!
          </p>
          <button
            onClick={nextRound}
            className="bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-ua-blue-dark active:scale-95 transition-all"
          >
            {round >= totalRounds ? "See Results" : "Next Round"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6">
          {/* Left column - Ukrainian */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-500 text-center mb-1">
              Ukrainian
            </p>
            {state.words.map((word, i) => {
              const isMatched = state.matched.has(i);
              const isSelected = state.selectedLeft === i;
              const isWrong = state.wrongPair && state.wrongPair[0] === i;

              return (
                <button
                  key={word.uk}
                  onClick={() => handleLeftClick(i)}
                  disabled={isMatched}
                  className={`px-3 py-4 rounded-xl text-lg font-bold text-center transition-all active:scale-95 select-none ${
                    isMatched
                      ? "bg-green-100 text-green-600 border-2 border-green-300"
                      : isWrong
                        ? "bg-red-100 text-red-600 border-2 border-red-400 animate-shake"
                        : isSelected
                          ? "bg-ua-blue-light text-ua-blue border-2 border-ua-blue shadow-md"
                          : "bg-white border-2 border-gray-200 hover:border-ua-blue cursor-pointer"
                  }`}
                >
                  {word.uk}
                </button>
              );
            })}
          </div>

          {/* Right column - English */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-500 text-center mb-1">
              English
            </p>
            {state.shuffledRight.map((word, i) => {
              const matched = isRightMatched(i);
              const isWrong = state.wrongPair && state.wrongPair[1] === i;

              return (
                <button
                  key={`r-${word.uk}`}
                  onClick={() => handleRightClick(i)}
                  disabled={matched}
                  className={`px-3 py-4 rounded-xl text-base font-medium text-center transition-all active:scale-95 select-none ${
                    matched
                      ? "bg-green-100 text-green-600 border-2 border-green-300"
                      : isWrong
                        ? "bg-red-100 text-red-600 border-2 border-red-400 animate-shake"
                        : "bg-white border-2 border-gray-200 hover:border-ua-blue cursor-pointer"
                  }`}
                >
                  {word.en}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
