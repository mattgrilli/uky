export interface GameScore {
  bestScore: number;
  totalAttempts: number;
}

/** Tracks per-word accuracy for spaced repetition */
export interface WordStat {
  correct: number;
  wrong: number;
  lastSeen: string;
}

export interface ProgressData {
  learnedLetters: number[];
  games: {
    matching: GameScore;
    quiz: GameScore;
    typing: GameScore;
    flashcards: GameScore;
  };
  /** Per-word stats keyed by "lessonId:uk" */
  wordStats: Record<string, WordStat>;
  /** Daily activity streak */
  streak: {
    current: number;
    lastDate: string; // YYYY-MM-DD
  };
  /** Total sessions completed */
  totalSessions: number;
  lastActivity: string;
}

const STORAGE_KEY = "uky-progress";

const defaultProgress: ProgressData = {
  learnedLetters: [],
  games: {
    matching: { bestScore: 0, totalAttempts: 0 },
    quiz: { bestScore: 0, totalAttempts: 0 },
    typing: { bestScore: 0, totalAttempts: 0 },
    flashcards: { bestScore: 0, totalAttempts: 0 },
  },
  wordStats: {},
  streak: { current: 0, lastDate: "" },
  totalSessions: 0,
  lastActivity: new Date().toISOString(),
};

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress, games: { ...defaultProgress.games }, wordStats: {}, streak: { ...defaultProgress.streak } };
    const data = JSON.parse(raw) as ProgressData;
    // Migrate old data missing new fields
    if (!data.wordStats) data.wordStats = {};
    if (!data.streak) data.streak = { current: 0, lastDate: "" };
    if (!data.totalSessions) data.totalSessions = 0;
    return data;
  } catch {
    return { ...defaultProgress, games: { ...defaultProgress.games }, wordStats: {}, streak: { ...defaultProgress.streak } };
  }
}

export function saveProgress(data: ProgressData): void {
  data.lastActivity = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markLetterLearned(index: number): void {
  const data = loadProgress();
  if (!data.learnedLetters.includes(index)) {
    data.learnedLetters.push(index);
    saveProgress(data);
  }
}

export function updateGameScore(
  game: keyof ProgressData["games"],
  score: number
): void {
  const data = loadProgress();
  data.games[game].totalAttempts += 1;
  if (score > data.games[game].bestScore) {
    data.games[game].bestScore = score;
  }
  saveProgress(data);
}

/** Record a correct or wrong answer for a word */
export function recordWordResult(lessonId: string, uk: string, isCorrect: boolean): void {
  const data = loadProgress();
  const key = `${lessonId}:${uk}`;
  if (!data.wordStats[key]) {
    data.wordStats[key] = { correct: 0, wrong: 0, lastSeen: new Date().toISOString() };
  }
  if (isCorrect) {
    data.wordStats[key].correct += 1;
  } else {
    data.wordStats[key].wrong += 1;
  }
  data.wordStats[key].lastSeen = new Date().toISOString();
  saveProgress(data);
}

/** Get words that need review (high error rate or not seen recently) */
export function getWordsToReview(): { lessonId: string; uk: string; stat: WordStat }[] {
  const data = loadProgress();
  return Object.entries(data.wordStats)
    .map(([key, stat]) => {
      const [lessonId, ...rest] = key.split(":");
      return { lessonId, uk: rest.join(":"), stat };
    })
    .filter(({ stat }) => {
      // Include words with >30% error rate or any wrong answers
      const total = stat.correct + stat.wrong;
      return total > 0 && stat.wrong > 0;
    })
    .sort((a, b) => {
      // Sort by error rate descending, then by recency
      const rateA = a.stat.wrong / (a.stat.correct + a.stat.wrong);
      const rateB = b.stat.wrong / (b.stat.correct + b.stat.wrong);
      return rateB - rateA;
    });
}

/** Update daily streak */
export function updateStreak(): void {
  const data = loadProgress();
  const today = new Date().toISOString().slice(0, 10);
  if (data.streak.lastDate === today) return; // Already logged today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.streak.lastDate === yesterday) {
    data.streak.current += 1;
  } else if (data.streak.lastDate !== today) {
    data.streak.current = 1;
  }
  data.streak.lastDate = today;
  data.totalSessions += 1;
  saveProgress(data);
}

/** Get streak info */
export function getStreakInfo(): { current: number; lastDate: string; totalSessions: number } {
  const data = loadProgress();
  return { current: data.streak.current, lastDate: data.streak.lastDate, totalSessions: data.totalSessions };
}
