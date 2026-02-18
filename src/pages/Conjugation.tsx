import { useState } from "react";
import { Link } from "react-router-dom";
import { conjugations, pronounLabels, type Conjugation } from "../data/verbs";
import { getVocabAudioPath } from "../data/lessons";

function ConjugationTable({ verb, index }: { verb: Conjugation; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const playAudio = () => {
    const audio = new Audio(getVocabAudioPath("verbs", index + 1));
    audio.play().catch(() => {});
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div>
          <span className="text-xl font-bold text-gray-800">{verb.infinitive}</span>
          <span className="text-gray-400 mx-2">—</span>
          <span className="text-gray-600">{verb.en}</span>
          <span className="text-sm text-ua-blue ml-2">({verb.translit})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); playAudio(); }}
            className="text-ua-blue hover:bg-ua-blue-light rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            title="Listen"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4">
          {verb.note && (
            <p className="text-sm text-gray-400 italic mt-3 mb-2">{verb.note}</p>
          )}
          <table className="w-full mt-2">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th className="text-left py-1 font-medium">Pronoun</th>
                <th className="text-left py-1 font-medium">Form</th>
              </tr>
            </thead>
            <tbody>
              {pronounLabels.map(({ key, uk, en }) => (
                <tr key={key} className="border-t border-gray-100">
                  <td className="py-2">
                    <span className="font-semibold text-ua-blue">{uk}</span>
                    <span className="text-xs text-gray-400 ml-1">({en})</span>
                  </td>
                  <td className="py-2 text-lg font-medium text-gray-800">
                    {verb.present[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ConjugationPage() {
  return (
    <div className="page-enter max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Link to="/lessons/verbs" className="text-ua-blue hover:underline text-sm">
          &larr; Verbs Lesson
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-ua-blue mb-1">Verb Conjugation</h1>
      <p className="text-gray-500 mb-6">
        Present tense forms for 20 essential Ukrainian verbs. Tap a verb to see its conjugation table.
      </p>

      <div className="flex flex-col gap-3">
        {conjugations.map((verb, i) => (
          <ConjugationTable key={verb.infinitive} verb={verb} index={i} />
        ))}
      </div>
    </div>
  );
}
