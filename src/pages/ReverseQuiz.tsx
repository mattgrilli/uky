import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { lessons, getVocabAudioPath, type VocabWord } from "../data/lessons";
import { shuffle } from "../data/alphabet";
import { recordWordResult } from "../lib/progress";
import QuizOption from "../components/QuizOption";
import ProgressBar from "../components/ProgressBar";

const TOTAL_QUESTIONS = 10;

interface WordWithLesson extends VocabWord {
  lessonId: string;
}

interface Question {
  word: WordWithLesson;
  options: string[];
  correctIndex: number;
}

const allWords: WordWithLesson[] = lessons.flatMap((l) =>
  l.words.map((w) => ({ ...w, lessonId: l.id }))
);

function generateQuestions(): Question[] {
  const selected = shuffle(allWords).slice(0, TOTAL_QUESTIONS);
  return selected.map((word) => {
    const distractors = shuffle(allWords.filter((w) => w.uk !== word.uk))
      .slice(0, 3)
      .map((w) => w.uk);
    const options = shuffle([word.uk, ...distractors]);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.uk),
    };
  });
}

export default function ReverseQuiz() {
  const [questions, setQuestions] = useState<Question[]>(generateQuestions);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[qi];

  const playAudio = useCallback(() => {
    if (!current) return;
    const audio = new Audio(getVocabAudioPath(current.word.lessonId, current.word.audioIndex));
    audio.play().catch(() => {});
  }, [current]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !current) return;
      setSelected(idx);
      setAnswered(true);
      const isCorrect = idx === current.correctIndex;
      if (isCorrect) setScore((s) => s + 1);
      recordWordResult(current.word.lessonId, current.word.uk, isCorrect);
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
        <h1 className="text-4xl font-bold text-ua-blue mb-2">Quiz Complete!</h1>
        <p className="text-6xl font-bold text-ua-yellow my-6">{pct}%</p>
        <p className="text-gray-500 mb-2">
          {score}/{questions.length} correct
        </p>
        <p className="text-gray-400 mb-8">
          {pct >= 80 ? "Excellent recall!" : pct >= 50 ? "Good progress!" : "Keep studying!"}
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
        <h1 className="text-2xl font-bold text-ua-blue">Reverse Quiz</h1>
        <span className="text-sm text-gray-400">
          {qi + 1}/{questions.length}
        </span>
      </div>

      <ProgressBar current={qi + (answered ? 1 : 0)} total={questions.length} />

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-2">How do you say this in Ukrainian?</p>
        <p className="text-4xl font-bold text-gray-800">{current.word.en}</p>
        {current.word.note && (
          <p className="text-sm text-gray-400 mt-1 italic">{current.word.note}</p>
        )}

        {answered && (
          <div className="mt-3">
            <button
              type="button"
              onClick={playAudio}
              className="text-sm text-ua-blue hover:underline inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 mt-8">
        {current.options.map((opt, i) => {
          const optWord = allWords.find((w) => w.uk === opt);
          return (
            <QuizOption
              key={`${qi}-${i}`}
              label={`${opt}${answered && optWord ? ` (${optWord.translit})` : ""}`}
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
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Score: {score}/{qi + (answered ? 1 : 0)}
      </p>
    </div>
  );
}
