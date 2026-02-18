import { Link } from "react-router-dom";
import { loadProgress, getWordsToReview, getStreakInfo } from "../lib/progress";
import { lessons } from "../data/lessons";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard() {
  const progress = loadProgress();
  const streakInfo = getStreakInfo();
  const wordsToReview = getWordsToReview();

  // Per-lesson accuracy stats
  const lessonStats = lessons.map((lesson) => {
    let correct = 0;
    let wrong = 0;
    lesson.words.forEach((w) => {
      const stat = progress.wordStats[`${lesson.id}:${w.uk}`];
      if (stat) {
        correct += stat.correct;
        wrong += stat.wrong;
      }
    });
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : -1;
    return { lesson, correct, wrong, total, accuracy };
  });

  const totalWordsStudied = Object.keys(progress.wordStats).length;
  const totalCorrect = Object.values(progress.wordStats).reduce((s, w) => s + w.correct, 0);
  const totalWrong = Object.values(progress.wordStats).reduce((s, w) => s + w.wrong, 0);
  const overallAccuracy = totalCorrect + totalWrong > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 0;

  const today = new Date().toISOString().slice(0, 10);
  const isActiveToday = streakInfo.lastDate === today;

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-ua-blue">Progress Dashboard</h1>
        <Link to="/" className="text-sm text-gray-400 hover:text-ua-blue">Home</Link>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-ua-blue">
            {streakInfo.current}
          </p>
          <p className="text-xs text-gray-400 mt-1">Day Streak</p>
          {isActiveToday && (
            <p className="text-xs text-green-500 mt-1">Active today</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-ua-yellow">
            {progress.learnedLetters.length}/33
          </p>
          <p className="text-xs text-gray-400 mt-1">Letters Learned</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {totalWordsStudied}
          </p>
          <p className="text-xs text-gray-400 mt-1">Words Studied</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold" style={{ color: overallAccuracy >= 70 ? "#16a34a" : overallAccuracy >= 40 ? "#ca8a04" : "#dc2626" }}>
            {overallAccuracy}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Overall Accuracy</p>
        </div>
      </div>

      {/* Alphabet progress */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Alphabet</h2>
        <ProgressBar current={progress.learnedLetters.length} total={33} label="Letters learned" />
      </div>

      {/* Review callout */}
      {wordsToReview.length > 0 && (
        <Link
          to="/review"
          className="block bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5 mb-6 hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-yellow-800">
                {wordsToReview.length} word{wordsToReview.length !== 1 ? "s" : ""} to review
              </h2>
              <p className="text-sm text-yellow-600">
                Practice the words you've gotten wrong
              </p>
            </div>
            <span className="text-yellow-600 text-2xl">&rarr;</span>
          </div>
        </Link>
      )}

      {/* Per-lesson accuracy */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Lesson Accuracy</h2>
        <div className="flex flex-col gap-3">
          {lessonStats.map(({ lesson, accuracy, total, correct, wrong }) => (
            <div key={lesson.id} className="flex items-center gap-3">
              <span className="text-2xl w-10 text-center shrink-0">{lesson.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 truncate">{lesson.title}</p>
                  {accuracy >= 0 ? (
                    <span className={`text-sm font-bold ${accuracy >= 70 ? "text-green-600" : accuracy >= 40 ? "text-yellow-600" : "text-red-500"}`}>
                      {accuracy}%
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">Not started</span>
                  )}
                </div>
                {total > 0 && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${accuracy >= 70 ? "bg-green-400" : accuracy >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                )}
                {total > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {correct} correct, {wrong} wrong ({total} attempts)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alphabet game stats */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Alphabet Games</h2>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ["Quiz", progress.games.quiz],
              ["Matching", progress.games.matching],
              ["Typing", progress.games.typing],
              ["Flashcards", progress.games.flashcards],
            ] as const
          ).map(([name, stats]) => (
            <div key={name} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">{name}</p>
              {stats.totalAttempts > 0 ? (
                <>
                  <p className="text-xl font-bold text-ua-blue">{stats.bestScore}</p>
                  <p className="text-xs text-gray-400">{stats.totalAttempts} attempts</p>
                </>
              ) : (
                <p className="text-xs text-gray-300 mt-1">Not played</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session info */}
      <div className="text-center text-xs text-gray-300 mb-8">
        {streakInfo.totalSessions} total sessions &middot; Last active: {progress.lastActivity ? new Date(progress.lastActivity).toLocaleDateString() : "Never"}
      </div>
    </div>
  );
}
