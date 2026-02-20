import { useState, useCallback } from "react";
import { quizzableLetters, shuffle, type UkrainianLetter } from "../data/alphabet";
import ProgressBar from "../components/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import { Link } from "react-router-dom";
import Confetti from "../components/Confetti";

const PAIRS_PER_ROUND = 6;
const TOTAL_ROUNDS = 5;

interface RoundState {
  letters: UkrainianLetter[];
  shuffledRight: UkrainianLetter[];
  matched: Set<number>;
  selectedLeft: number | null;
  selectedRight: number | null;
  wrongPair: [number, number] | null;
  mistakes: number;
}

function newRound(): RoundState {
  const letters = shuffle(quizzableLetters).slice(0, PAIRS_PER_ROUND);
  return {
    letters,
    shuffledRight: shuffle([...letters]),
    matched: new Set(),
    selectedLeft: null,
    selectedRight: null,
    wrongPair: null,
    mistakes: 0,
  };
}

export default function MatchingGame() {
  const [round, setRound] = useState(1);
  const [state, setState] = useState<RoundState>(newRound);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const { updateGameScore } = useProgress();

  const roundComplete = state.matched.size === PAIRS_PER_ROUND;

  const handleLeftClick = useCallback(
    (idx: number) => {
      if (state.matched.has(state.letters[idx].index) || state.wrongPair) return;
      setState((s) => ({ ...s, selectedLeft: idx, wrongPair: null }));
    },
    [state.matched, state.letters, state.wrongPair]
  );

  const handleRightClick = useCallback(
    (idx: number) => {
      if (
        state.selectedLeft === null ||
        state.matched.has(state.shuffledRight[idx].index) ||
        state.wrongPair
      )
        return;

      const leftLetter = state.letters[state.selectedLeft];
      const rightLetter = state.shuffledRight[idx];

      if (leftLetter.index === rightLetter.index) {
        setState((s) => {
          const matched = new Set(s.matched);
          matched.add(leftLetter.index);
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
    if (round >= TOTAL_ROUNDS) {
      const totalPairs = PAIRS_PER_ROUND * TOTAL_ROUNDS;
      const score = Math.max(
        0,
        Math.round(((totalPairs - totalMistakes) / totalPairs) * 100)
      );
      updateGameScore("matching", score);
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      setState(newRound());
    }
  };

  const restart = () => {
    setRound(1);
    setState(newRound());
    setTotalMistakes(0);
    setFinished(false);
  };

  if (finished) {
    const totalPairs = PAIRS_PER_ROUND * TOTAL_ROUNDS;
    const score = Math.max(
      0,
      Math.round(((totalPairs - totalMistakes) / totalPairs) * 100)
    );
    const isHighScore = score >= 80;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🔗 Game Over!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">{score}%</p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-2">
          {totalPairs} pairs matched with {totalMistakes} mistakes
        </p>
        <div className="flex gap-3 justify-center mt-8">
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
    <div className="page-enter max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold text-ua-blue">Matching Game</h1>
        <span className="text-sm text-gray-500">
          Mistakes: {state.mistakes}
        </span>
      </div>

      <ProgressBar current={round} total={TOTAL_ROUNDS} label={`Round ${round}`} />

      {roundComplete ? (
        <div className="text-center py-12">
          <p className="text-2xl font-bold text-green-600 mb-4 animate-pop">
            Round Complete!
          </p>
          <button
            onClick={nextRound}
            className="bg-ua-blue text-white px-6 py-2 rounded-full hover:bg-ua-blue-dark transition-colors"
          >
            {round >= TOTAL_ROUNDS ? "See Results" : "Next Round"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left column - Cyrillic letters */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-500 text-center mb-1">
              Letter
            </p>
            {state.letters.map((letter, i) => {
              const isMatched = state.matched.has(letter.index);
              const isSelected = state.selectedLeft === i;
              const isWrong =
                state.wrongPair && state.wrongPair[0] === i;

              return (
                <button
                  key={letter.index}
                  onClick={() => handleLeftClick(i)}
                  disabled={isMatched}
                  className={`px-4 py-3 rounded-xl text-2xl font-bold text-center transition-all ${
                    isMatched
                      ? "bg-green-100 text-green-600 border-2 border-green-300"
                      : isWrong
                        ? "bg-red-100 text-red-600 border-2 border-red-400 animate-shake"
                        : isSelected
                          ? "bg-ua-blue-light text-ua-blue border-2 border-ua-blue"
                          : "bg-white border-2 border-gray-200 hover:border-ua-blue cursor-pointer"
                  }`}
                >
                  {letter.upper}
                </button>
              );
            })}
          </div>

          {/* Right column - Transliterations */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-500 text-center mb-1">
              Sound
            </p>
            {state.shuffledRight.map((letter, i) => {
              const isMatched = state.matched.has(letter.index);
              const isSelected = state.selectedRight === i;
              const isWrong =
                state.wrongPair && state.wrongPair[1] === i;

              return (
                <button
                  key={`r-${letter.index}`}
                  onClick={() => handleRightClick(i)}
                  disabled={isMatched}
                  className={`px-4 py-3 rounded-xl text-lg font-medium text-center transition-all ${
                    isMatched
                      ? "bg-green-100 text-green-600 border-2 border-green-300"
                      : isWrong
                        ? "bg-red-100 text-red-600 border-2 border-red-400 animate-shake"
                        : isSelected
                          ? "bg-ua-blue-light text-ua-blue border-2 border-ua-blue"
                          : "bg-white border-2 border-gray-200 hover:border-ua-blue cursor-pointer"
                  }`}
                >
                  {letter.transliteration}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
