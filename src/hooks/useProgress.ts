import { useState, useCallback } from "react";
import {
  type ProgressData,
  loadProgress,
  markLetterLearned as _markLearned,
  updateGameScore as _updateScore,
  recordWordResult as _recordWord,
  updateStreak as _updateStreak,
} from "../lib/progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  const refresh = useCallback(() => setProgress(loadProgress()), []);

  const markLetterLearned = useCallback(
    (index: number) => {
      _markLearned(index);
      refresh();
    },
    [refresh]
  );

  const updateGameScore = useCallback(
    (game: keyof ProgressData["games"], score: number) => {
      _updateScore(game, score);
      refresh();
    },
    [refresh]
  );

  const recordWordResult = useCallback(
    (lessonId: string, uk: string, isCorrect: boolean) => {
      _recordWord(lessonId, uk, isCorrect);
      refresh();
    },
    [refresh]
  );

  const updateStreak = useCallback(() => {
    _updateStreak();
    refresh();
  }, [refresh]);

  const overallPercent = Math.round(
    (progress.learnedLetters.length / 33) * 100
  );

  return { progress, markLetterLearned, updateGameScore, recordWordResult, updateStreak, overallPercent };
}
