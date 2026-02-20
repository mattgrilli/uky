import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById, getVocabAudioPath, type VocabWord } from "../data/lessons";
import ProgressBar from "../components/ProgressBar";

function WordCard({
  word,
  lessonId,
  index,
  total,
}: {
  word: VocabWord;
  lessonId: string;
  index: number;
  total: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playAudio = () => {
    const audio = new Audio(getVocabAudioPath(lessonId, word.audioIndex));
    setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    audio.play().catch(() => setPlaying(false));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-ua-blue">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-800">{word.uk}</p>
          <p className="text-sm text-ua-blue mt-1">{word.translit}</p>

          {revealed ? (
            <div className="mt-3">
              <p className="text-xl text-gray-600">{word.en}</p>
              {word.note && (
                <p className="text-sm text-gray-400 mt-1 italic">{word.note}</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-3 bg-gray-100 text-ua-blue px-4 py-2 rounded-lg text-sm font-medium
                hover:bg-ua-blue-light active:scale-95 transition-all"
            >
              Show translation
            </button>
          )}
        </div>

        <button
          onClick={playAudio}
          disabled={playing}
          className="ml-4 bg-ua-blue text-white w-12 h-12 rounded-full flex items-center justify-center
            hover:bg-ua-blue-dark transition-colors disabled:opacity-50 shrink-0"
          title="Listen"
        >
          {playing ? (
            <span className="text-sm">...</span>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-300">
        {index + 1} / {total}
      </div>
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards");
  const [cardIndex, setCardIndex] = useState(0);

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Lesson not found.</p>
        <Link to="/" className="text-ua-blue underline mt-4 inline-block">
          Back Home
        </Link>
      </div>
    );
  }

  const word = lesson.words[cardIndex];

  return (
    <div className="page-enter max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Link to="/" className="text-ua-blue hover:underline text-sm">
          &larr; Home
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("cards")}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all active:scale-95 ${viewMode === "cards" ? "bg-ua-blue text-white" : "bg-gray-200 text-gray-600"}`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all active:scale-95 ${viewMode === "list" ? "bg-ua-blue text-white" : "bg-gray-200 text-gray-600"}`}
          >
            List
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-ua-blue">{lesson.title}</h1>
      <p className="text-gray-400 text-sm">{lesson.titleUk}</p>
      <p className="text-gray-500 mt-1 mb-6">{lesson.description}</p>

      {viewMode === "cards" ? (
        <>
          <ProgressBar
            current={cardIndex + 1}
            total={lesson.words.length}
            label="Progress"
          />

          <div className="mt-6">
            <WordCard
              key={cardIndex}
              word={word}
              lessonId={lesson.id}
              index={cardIndex}
              total={lesson.words.length}
            />
          </div>

          <div className="flex justify-between mt-6 gap-4">
            <button
              onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
              disabled={cardIndex === 0}
              className="flex-1 py-3 px-5 rounded-xl border-2 border-ua-blue text-ua-blue font-medium
                hover:bg-ua-blue-light active:scale-95 transition-all text-base
                disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-white disabled:active:scale-100"
            >
              &larr; Previous
            </button>
            <button
              onClick={() =>
                setCardIndex((i) => Math.min(lesson.words.length - 1, i + 1))
              }
              disabled={cardIndex === lesson.words.length - 1}
              className="flex-1 py-3 px-5 rounded-xl bg-ua-blue text-white font-medium
                hover:bg-ua-blue-dark active:scale-95 transition-all text-base
                disabled:bg-gray-200 disabled:text-gray-300 disabled:hover:bg-gray-200 disabled:active:scale-100"
            >
              Next &rarr;
            </button>
          </div>

          {cardIndex === lesson.words.length - 1 && (
            <div className="mt-8 text-center bg-ua-yellow-light rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-3">
                Ready to practice?
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  to={`/lessons/${lesson.id}/quiz`}
                  className="bg-ua-blue text-white px-5 py-2 rounded-full hover:bg-ua-blue-dark transition-colors"
                >
                  Take Quiz
                </Link>
                <Link
                  to={`/lessons/${lesson.id}/match`}
                  className="border-2 border-ua-blue text-ua-blue px-5 py-2 rounded-full hover:bg-ua-blue-light transition-colors"
                >
                  Matching Game
                </Link>
                {lesson.id === "verbs" && (
                  <Link
                    to="/conjugation"
                    className="border-2 border-purple-500 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    Conjugation Tables
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {lesson.words.map((w, i) => (
              <WordCard
                key={i}
                word={w}
                lessonId={lesson.id}
                index={i}
                total={lesson.words.length}
              />
            ))}
          </div>

          <div className="mt-8 text-center bg-ua-yellow-light rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-3">
              Ready to practice?
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to={`/lessons/${lesson.id}/quiz`}
                className="bg-ua-blue text-white px-5 py-2 rounded-full hover:bg-ua-blue-dark transition-colors"
              >
                Take Quiz
              </Link>
              <Link
                to={`/lessons/${lesson.id}/match`}
                className="border-2 border-ua-blue text-ua-blue px-5 py-2 rounded-full hover:bg-ua-blue-light transition-colors"
              >
                Matching Game
              </Link>
              {lesson.id === "verbs" && (
                <Link
                  to="/conjugation"
                  className="border-2 border-purple-500 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Conjugation Tables
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
