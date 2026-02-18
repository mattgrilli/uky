import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { lessons, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import QuizOption from "../components/QuizOption";
import ProgressBar from "../components/ProgressBar";

const TOTAL_QUESTIONS = 10;

interface Question {
  word: VocabWord;
  lessonId: string;
  options: string[];
  correctIndex: number;
}

const allWords = lessons.flatMap((l) =>
  l.words.map((w) => ({ ...w, lessonId: l.id }))
);

function generateQuestions(): Question[] {
  const selected = shuffle(allWords).slice(0, TOTAL_QUESTIONS);
  return selected.map((word) => {
    const distractors = shuffle(allWords.filter((w) => w.en !== word.en))
      .slice(0, 3)
      .map((w) => w.en);
    const options = shuffle([word.en, ...distractors]);
    return {
      word,
      lessonId: word.lessonId,
      options,
      correctIndex: options.indexOf(word.en),
    };
  });
}

export default function ListeningQuiz() {
  const [questions, setQuestions] = useState<Question[]>(generateQuestions);
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

  // Auto-play audio when question changes
  useEffect(() => {
    if (!finished && current) {
      const timer = setTimeout(playAudio, 300);
      return () => clearTimeout(timer);
    }
  }, [qi, finished, current, playAudio]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !current) return;
      setSelected(idx);
      setAnswered(true);
      const isCorrect = idx === current.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      recordWordResult(current.lessonId, current.word.uk, isCorrect);
    },
    [answered, current]
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
    const timer = setTimeout(handleNext, 2000);
    return () => clearTimeout(timer);
  }, [answered, handleNext]);

  const restart = () => {
    const q = generateQuestions();
    setQuestions(q);
    setQi(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="page-enter text-center py-12 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-ua-blue mb-2">Listening Complete!</h1>
        <p className="text-6xl font-bold text-ua-yellow my-6">{pct}%</p>
        <p className="text-gray-500 mb-2">
          {score}/{questions.length} correct
        </p>
        <p className="text-gray-400 mb-8">
          {pct >= 80 ? "Great ears!" : pct >= 50 ? "Good listening!" : "Keep practicing!"}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={restart}
            className="bg-ua-blue text-white px-6 py-2 rounded-full hover:bg-ua-blue-dark transition-colors"
          >
            Play Again
          </button>
          <Link
            to="/"
            className="border-2 border-ua-blue text-ua-blue px-6 py-2 rounded-full hover:bg-ua-blue-light transition-colors"
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
        <h1 className="text-2xl font-bold text-ua-blue">Listening Quiz</h1>
        <span className="text-sm text-gray-400">
          {qi + 1}/{questions.length}
        </span>
      </div>

      <ProgressBar current={qi + (answered ? 1 : 0)} total={questions.length} />

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4">Listen and pick the correct translation:</p>

        <button
          onClick={playAudio}
          className="w-24 h-24 rounded-full bg-ua-blue text-white hover:bg-ua-blue-dark transition-colors inline-flex items-center justify-center shadow-lg"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </button>

        <p className="text-sm text-gray-400 mt-3">Tap to play again</p>

        {answered && (
          <p className="text-lg font-semibold text-gray-700 mt-3 animate-pop">
            {current.word.uk} — {current.word.translit}
          </p>
        )}
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
