import { Link } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { lessons } from "../data/lessons";
import { getWordsToReview } from "../lib/progress";
import ProgressBar from "../components/ProgressBar";
import { useEffect } from "react";

export default function Home() {
  const { progress, overallPercent, updateStreak } = useProgress();
  const wordsToReview = getWordsToReview();

  // Update streak on page load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-ua-blue">UKY</h1>
        <p className="text-xl text-gray-600 mt-3">
          Learn Ukrainian, letter by letter.
        </p>
        <div className="w-16 h-1 bg-ua-yellow mx-auto mt-4 rounded-full" />
      </div>

      {/* Quick actions */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-3 justify-center">
        {wordsToReview.length > 0 && (
          <Link
            to="/review"
            className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
          >
            Review {wordsToReview.length} word{wordsToReview.length !== 1 ? "s" : ""}
          </Link>
        )}
        <Link
          to="/dashboard"
          className="bg-white text-ua-blue px-5 py-2 rounded-full font-medium border-2 border-ua-blue hover:bg-ua-blue-light transition-colors"
        >
          Progress Dashboard
        </Link>
      </div>

      {/* Progress overview */}
      {progress.learnedLetters.length > 0 && (
        <div className="max-w-md mx-auto mb-10 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Your Progress
          </h2>
          <ProgressBar
            current={progress.learnedLetters.length}
            total={33}
            label="Letters learned"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {overallPercent}% of the alphabet
          </p>
        </div>
      )}

      {/* Lessons */}
      <h2 className="text-xl font-bold text-gray-800 max-w-4xl mx-auto mb-4">
        Lessons
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <Link
          to="/alphabet"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-ua-blue"
        >
          <div className="text-4xl mb-3">
            <span role="img" aria-label="Ukrainian letters" aria-hidden>&#1040;&#1041;&#1042;</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">The Alphabet</h3>
          <p className="text-gray-500 text-sm mt-1">
            Master all 33 letters with pronunciation guides and audio.
          </p>
        </Link>

        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-ua-yellow"
          >
            <div className="text-4xl mb-3">{lesson.icon}</div>
            <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {lesson.words.length} words
            </p>
          </Link>
        ))}
      </div>

      {/* Games */}
      <h2 className="text-xl font-bold text-gray-800 max-w-4xl mx-auto mb-4">
        Games
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <Link
          to="/games/quiz"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-ua-yellow"
        >
          <h3 className="text-lg font-bold text-gray-800">Alphabet Quiz</h3>
          <p className="text-gray-500 text-sm mt-1">
            Multiple choice letter quiz.
          </p>
        </Link>

        <Link
          to="/games/matching"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-green-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Letter Matching</h3>
          <p className="text-gray-500 text-sm mt-1">
            Match letters to transliterations.
          </p>
        </Link>

        <Link
          to="/games/typing"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-purple-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Typing Practice</h3>
          <p className="text-gray-500 text-sm mt-1">
            Type Ukrainian letters.
          </p>
        </Link>

        <Link
          to="/games/listening"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-orange-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Listening Quiz</h3>
          <p className="text-gray-500 text-sm mt-1">
            Hear audio, pick the correct translation.
          </p>
        </Link>

        <Link
          to="/games/speed"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-red-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Speed Round</h3>
          <p className="text-gray-500 text-sm mt-1">
            60 seconds — how many can you get?
          </p>
        </Link>

        <Link
          to="/games/reverse"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-teal-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Reverse Quiz</h3>
          <p className="text-gray-500 text-sm mt-1">
            English to Ukrainian — test your recall.
          </p>
        </Link>

        <Link
          to="/games/spelling"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-pink-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Spell It</h3>
          <p className="text-gray-500 text-sm mt-1">
            Type the Ukrainian word from English.
          </p>
        </Link>

        <Link
          to="/games/sentences"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-cyan-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Sentence Builder</h3>
          <p className="text-gray-500 text-sm mt-1">
            Arrange words to form Ukrainian sentences.
          </p>
        </Link>

        <Link
          to="/conjugation"
          className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all hover:-translate-y-1 border-t-4 border-violet-500"
        >
          <h3 className="text-lg font-bold text-gray-800">Verb Conjugation</h3>
          <p className="text-gray-500 text-sm mt-1">
            Present tense tables for 20 common verbs.
          </p>
        </Link>
      </div>

      {/* Game stats */}
      {progress.games.quiz.totalAttempts > 0 && (
        <div className="max-w-4xl mx-auto mt-2 mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Game Stats
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                ["Quiz", progress.games.quiz],
                ["Matching", progress.games.matching],
                ["Typing", progress.games.typing],
              ] as const
            ).map(([name, stats]) =>
              stats.totalAttempts > 0 ? (
                <div
                  key={name}
                  className="bg-white rounded-xl shadow p-4 text-center"
                >
                  <p className="text-sm text-gray-500">{name}</p>
                  <p className="text-2xl font-bold text-ua-blue">
                    {stats.bestScore}
                  </p>
                  <p className="text-xs text-gray-400">
                    best of {stats.totalAttempts} attempts
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
