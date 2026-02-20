import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import QuizOption from "../components/QuizOption";
import ProgressBar from "../components/ProgressBar";
import Confetti from "../components/Confetti";

const TOTAL_QUESTIONS = 10;

interface Question {
  word: VocabWord;
  options: string[];
  correctIndex: number;
}

function generateQuestions(words: VocabWord[]): Question[] {
  const selected = shuffle(words).slice(0, Math.min(TOTAL_QUESTIONS, words.length));
  return selected.map((word) => {
    const distractors = shuffle(words.filter((w) => w.uk !== word.uk))
      .slice(0, 3)
      .map((w) => w.en);
    const options = shuffle([word.en, ...distractors]);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.en),
    };
  });
}

export default function VocabQuiz() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (lesson) setQuestions(generateQuestions(lesson.words));
  }, [lesson]);

  const current = questions[qi];

  const playAudio = useCallback(() => {
    if (!lesson || !current) return;
    const audio = new Audio(getVocabAudioPath(lesson.id, current.word.audioIndex));
    audio.play().catch(() => {});
  }, [lesson, current]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !current || !lesson) return;
      setSelected(idx);
      setAnswered(true);
      const isCorrect = idx === current.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      recordWordResult(lesson.id, current.word.uk, isCorrect);
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

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lesson not found.</p>
        <Link to="/" className="text-ua-blue bg-ua-blue-light px-6 py-3 rounded-full mt-4 inline-block font-medium active:scale-95 transition-all">Home</Link>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const restart = () => {
    setQuestions(generateQuestions(lesson.words));
    setQi(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const isHighScore = score >= questions.length * 0.8;
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        {isHighScore && <Confetti />}
        <h1 className="text-4xl font-display font-bold text-ua-blue mb-2 animate-celebrate">🎯 Quiz Complete!</h1>
        <p className="text-7xl font-display font-bold text-gradient my-6 animate-score-pop">
          {score}/{questions.length}
        </p>
        {isHighScore && <p className="text-2xl mb-2 animate-bounce-in">🏆✨🌟</p>}
        <p className="text-gray-500 mb-8">
          {score >= questions.length * 0.8
            ? "Excellent work!"
            : score >= questions.length * 0.5
              ? "Good effort! Keep practicing."
              : "Keep studying, you'll get there!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
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

  return (
    <div className="page-enter max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold text-ua-blue">{lesson.title} Quiz</h1>
        <Link
          to={`/lessons/${lesson.id}`}
          className="text-sm text-ua-blue bg-gray-100 px-4 py-2 rounded-full hover:bg-ua-blue-light active:scale-95 transition-all"
        >
          &larr; Back
        </Link>
      </div>

      <ProgressBar current={qi + 1} total={questions.length} />

      <div className="mt-8 text-center">
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
