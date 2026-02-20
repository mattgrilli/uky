import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getWordsToReview, recordWordResult } from "../lib/progress";
import { getLessonById, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import QuizOption from "../components/QuizOption";
import Confetti from "../components/Confetti";

const REVIEW_SIZE = 10;

interface ReviewQuestion {
  lessonId: string;
  word: VocabWord;
  options: string[];
  correctIndex: number;
}

function buildReviewQuestions(): ReviewQuestion[] {
  const toReview = getWordsToReview();
  if (toReview.length === 0) return [];

  const selected = toReview.slice(0, REVIEW_SIZE);
  return selected.map(({ lessonId, uk }) => {
    const lesson = getLessonById(lessonId);
    const word = lesson?.words.find((w) => w.uk === uk);
    if (!lesson || !word) return null;

    const distractors = shuffle(lesson.words.filter((w) => w.uk !== uk))
      .slice(0, 3)
      .map((w) => w.en);
    const options = shuffle([word.en, ...distractors]);
    return {
      lessonId,
      word,
      options,
      correctIndex: options.indexOf(word.en),
    };
  }).filter(Boolean) as ReviewQuestion[];
}

export default function Review() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>(buildReviewQuestions);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[qi];

  const playAudio = useCallback(() => {
    if (!current) return;
    const audio = new Audio(getVocabAudioPath(current.lessonId, current.word.audioIndex));
    audio.play().catch(() => {});
  }, [current]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !current) return;
      setSelected(idx);
      setAnswered(true);
      const isCorrect = idx === current.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      recordWordResult(current.lessonId, current.word.uk, isCorrect);
      playAudio();
    },
    [answered, current, playAudio]
  );

  const handleNext = useCallback(() => {
    if (qi + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQi((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [qi, questions.length]);

  useEffect(() => {
    if (!answered) return;
    const timer = setTimeout(handleNext, 1800);
    return () => clearTimeout(timer);
  }, [answered, handleNext]);

  const restart = () => {
    const q = buildReviewQuestions();
    setQuestions(q);
    setQi(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(q.length === 0);
  };

  if (questions.length === 0) {
    return (
      <div className="page-enter text-center py-20 max-w-md mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-display font-bold text-ua-blue mb-3">Nothing to Review!</h1>
        <p className="text-gray-500 mb-8">
          Take some quizzes first — any words you get wrong will appear here for review.
        </p>
        <Link
          to="/"
          className="font-display bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold btn-glow active:scale-95 transition-all"
        >
          Go to Lessons
        </Link>
      </div>
    );
  }

  if (finished) {
    const isHighScore = score === questions.length;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🌟 Review Complete!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">
          {score}/{questions.length}
        </p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-8">
          {score === questions.length
            ? "Perfect! Those words are getting stronger."
            : "Keep reviewing — you'll nail them soon!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={restart}
            className="font-display bg-ua-blue text-white px-8 py-3 rounded-full text-lg font-semibold btn-glow active:scale-95 transition-all"
          >
            Review Again
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
        <h1 className="text-2xl font-display font-bold text-ua-blue">Review</h1>
        <Link to="/" className="text-sm text-ua-blue bg-gray-100 px-4 py-2 rounded-full hover:bg-ua-blue-light active:scale-95 transition-all">Home</Link>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-ua-yellow h-2 rounded-full transition-all"
          style={{ width: `${((qi + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1 text-xs text-yellow-700 mb-4 text-center">
        Reviewing words you've gotten wrong before
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm mb-2">What does this mean?</p>
        <p className="text-4xl font-bold text-gray-800">{current.word.uk}</p>
        <p className="text-sm text-ua-blue mt-1">{current.word.translit}</p>

        <button
          onClick={playAudio}
          className="mt-3 text-sm text-ua-blue bg-ua-blue-light px-4 py-2 rounded-full inline-flex items-center gap-1 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Listen
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-8">
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
