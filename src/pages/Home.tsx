import { Link } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { lessons } from "../data/lessons";
import { getWordsToReview } from "../lib/progress";
import ProgressBar from "../components/ProgressBar";
import HeroIllustration from "../components/HeroIllustration";
import VyshyvankaDivider from "../components/VyshyvankaDivider";
import { useEffect } from "react";

const cardBase =
  "bg-white rounded-2xl card-shadow-blue p-6 transition-all duration-300 hover:-translate-y-1.5 active:scale-95 select-none border border-gray-100";

export default function Home() {
  const { progress, overallPercent, updateStreak } = useProgress();
  const wordsToReview = getWordsToReview();

  const classLessons = lessons.filter((l) => l.classUnit);
  const generalLessons = lessons.filter((l) => !l.classUnit);
  const classUnits = [...new Set(classLessons.map((l) => l.classUnit!))].sort();

  // Update streak on page load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mb-4">
        <HeroIllustration className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" />
        <div className="relative text-center py-16">
          <div className="text-7xl sm:text-8xl font-display font-bold text-gradient animate-bounce-in">
            UKY
          </div>
          <p
            className="text-xl sm:text-2xl text-gray-600 mt-4 font-display font-medium animate-bounce-in"
            style={{ animationDelay: "100ms" }}
          >
            Learn Ukrainian, letter by letter.
          </p>
          <div
            className="flex items-center justify-center gap-2 mt-6 animate-bounce-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-12 h-1.5 bg-ua-blue rounded-full" />
            <div className="w-4 h-4 bg-ua-yellow rounded-full" />
            <div className="w-12 h-1.5 bg-ua-yellow rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-3 justify-center">
        {wordsToReview.length > 0 && (
          <Link
            to="/review"
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-display font-medium btn-glow-yellow active:scale-95 text-base"
          >
            Review {wordsToReview.length} word{wordsToReview.length !== 1 ? "s" : ""}
          </Link>
        )}
        <Link
          to="/dashboard"
          className="bg-white text-ua-blue px-6 py-3 rounded-full font-display font-medium border-2 border-ua-blue btn-glow active:scale-95 text-base"
        >
          Progress Dashboard
        </Link>
      </div>

      {/* Progress overview */}
      {progress.learnedLetters.length > 0 && (
        <div className="max-w-md mx-auto mb-10 bg-white rounded-2xl card-shadow-blue p-6 border border-gray-100">
          <h2 className="text-lg font-display font-semibold text-gray-700 mb-3">
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

      {/* --- Divider: after hero/quick-actions --- */}
      <VyshyvankaDivider className="w-full h-7 max-w-4xl mx-auto my-6 opacity-60" />

      {/* Class Units */}
      {classUnits.map((unit) => (
        <div key={unit}>
          <h2 className="text-2xl font-display font-bold text-gray-800 max-w-4xl mx-auto mb-4">
            <svg className="inline-block w-6 h-6 mr-2 -mt-1" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            Class Unit {unit}
          </h2>
          <div className="max-w-4xl mx-auto mb-3 flex flex-wrap gap-2">
            <Link
              to={`/units/${unit}/falling-words`}
              className="inline-flex items-center gap-1.5 bg-ua-blue-light text-ua-blue px-5 py-2 rounded-full font-display font-medium text-sm active:scale-95 transition-all hover:bg-ua-blue hover:text-white"
            >
              🌊 Falling Words
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {classLessons
              .filter((l) => l.classUnit === unit)
              .map((lesson, i) => (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className={`${cardBase} border-t-4 border-green-500 stagger-item`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-3">{lesson.icon}</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Unit {lesson.classUnit}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-800">{lesson.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {lesson.words.length} words
                  </p>
                </Link>
              ))}
          </div>
        </div>
      ))}

      {/* --- Divider: between Class Units and Lessons --- */}
      <VyshyvankaDivider className="w-full h-7 max-w-4xl mx-auto my-6 opacity-60" />

      {/* Lessons */}
      <h2 className="text-2xl font-display font-bold text-gray-800 max-w-4xl mx-auto mb-4">
        <svg className="inline-block w-6 h-6 mr-2 -mt-1" viewBox="0 0 24 24" fill="none" stroke="#005BBB" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" /></svg>
        Lessons
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <Link
          to="/alphabet"
          className={`${cardBase} border-t-4 border-ua-blue stagger-item`}
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <div className="text-4xl mb-3">
            <span role="img" aria-label="Ukrainian letters" aria-hidden>&#1040;&#1041;&#1042;</span>
          </div>
          <h3 className="text-lg font-display font-bold text-gray-800">The Alphabet</h3>
          <p className="text-gray-500 text-sm mt-1">
            Master all 33 letters with pronunciation guides and audio.
          </p>
        </Link>

        {generalLessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className={`${cardBase} border-t-4 border-ua-yellow stagger-item`}
            style={{ "--i": i + 1 } as React.CSSProperties}
          >
            <div className="text-4xl mb-3">{lesson.icon}</div>
            <h3 className="text-lg font-display font-bold text-gray-800">{lesson.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {lesson.words.length} words
            </p>
          </Link>
        ))}
      </div>

      {/* --- Divider: between Lessons and Games --- */}
      <VyshyvankaDivider className="w-full h-7 max-w-4xl mx-auto my-6 opacity-60" />

      {/* Games */}
      <h2 className="text-2xl font-display font-bold text-gray-800 max-w-4xl mx-auto mb-4">
        <svg className="inline-block w-6 h-6 mr-2 -mt-1" viewBox="0 0 24 24" fill="none" stroke="#FFD500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        Games
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        {([
          { to: "/games/quiz", emoji: "\uD83C\uDFAF", title: "Alphabet Quiz", desc: "Multiple choice letter quiz.", color: "border-ua-yellow" },
          { to: "/games/matching", emoji: "\uD83D\uDD17", title: "Letter Matching", desc: "Match letters to transliterations.", color: "border-green-500" },
          { to: "/games/typing", emoji: "\u2328\uFE0F", title: "Typing Practice", desc: "Type Ukrainian letters.", color: "border-purple-500" },
          { to: "/games/listening", emoji: "\uD83D\uDC42", title: "Listening Quiz", desc: "Hear audio, pick the correct translation.", color: "border-orange-500" },
          { to: "/games/speed", emoji: "\u26A1", title: "Speed Round", desc: "60 seconds \u2014 how many can you get?", color: "border-red-500" },
          { to: "/games/reverse", emoji: "\uD83D\uDD04", title: "Reverse Quiz", desc: "English to Ukrainian \u2014 test your recall.", color: "border-teal-500" },
          { to: "/games/spelling", emoji: "\uD83D\uDCDD", title: "Spell It", desc: "Type the Ukrainian word from English.", color: "border-pink-500" },
          { to: "/games/sentences", emoji: "\uD83E\uDDE9", title: "Sentence Builder", desc: "Arrange words to form Ukrainian sentences.", color: "border-cyan-500" },
          { to: "/conjugation", emoji: "\uD83D\uDCD6", title: "Verb Conjugation", desc: "Present tense tables for 20 common verbs.", color: "border-violet-500" },
        ]).map((game, i) => (
          <Link
            key={game.to}
            to={game.to}
            className={`${cardBase} border-t-4 ${game.color} stagger-item`}
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="text-3xl mb-2">{game.emoji}</div>
            <h3 className="text-lg font-display font-bold text-gray-800">{game.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{game.desc}</p>
          </Link>
        ))}
      </div>

      {/* Game stats */}
      {progress.games.quiz.totalAttempts > 0 && (
        <div className="max-w-4xl mx-auto mt-2 mb-10">
          <h2 className="text-lg font-display font-semibold text-gray-700 mb-4 text-center">
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
                  className="bg-white rounded-xl card-shadow-blue p-4 text-center border border-gray-100"
                >
                  <p className="text-sm text-gray-500 font-display">{name}</p>
                  <p className="text-3xl font-display font-bold text-ua-blue">
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
