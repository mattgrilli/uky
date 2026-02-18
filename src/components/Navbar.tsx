import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { lessons } from "../data/lessons";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-ua-blue-dark text-ua-yellow"
      : "text-white/90 hover:bg-ua-blue-dark hover:text-white"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [lessonsOpen, setLessonsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLessonsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="bg-ua-blue sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink
            to="/"
            className="text-ua-yellow font-bold text-xl tracking-tight"
          >
            UKY
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/alphabet" className={linkClass}>
              Alphabet
            </NavLink>

            {/* Lessons dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLessonsOpen(!lessonsOpen)}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white/90 hover:bg-ua-blue-dark hover:text-white inline-flex items-center gap-1"
              >
                Lessons
                <svg className={`w-3 h-3 transition-transform ${lessonsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {lessonsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-1 min-w-45 z-50">
                  {lessons.map((lesson) => (
                    <NavLink
                      key={lesson.id}
                      to={`/lessons/${lesson.id}`}
                      onClick={() => setLessonsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-ua-blue-light text-ua-blue font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {lesson.icon} {lesson.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/games/sentences" className={linkClass}>
              Sentences
            </NavLink>
            <NavLink to="/review" className={linkClass}>
              Review
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              Progress
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            <NavLink to="/alphabet" className={linkClass} onClick={() => setOpen(false)}>
              Alphabet
            </NavLink>
            <p className="px-3 pt-2 pb-1 text-xs font-semibold text-white/50 uppercase tracking-wide">
              Lessons
            </p>
            {lessons.map((lesson) => (
              <NavLink
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {lesson.icon} {lesson.title}
              </NavLink>
            ))}
            <p className="px-3 pt-2 pb-1 text-xs font-semibold text-white/50 uppercase tracking-wide">
              Games
            </p>
            <NavLink to="/games/quiz" className={linkClass} onClick={() => setOpen(false)}>
              Alphabet Quiz
            </NavLink>
            <NavLink to="/games/matching" className={linkClass} onClick={() => setOpen(false)}>
              Letter Matching
            </NavLink>
            <NavLink to="/games/typing" className={linkClass} onClick={() => setOpen(false)}>
              Typing Practice
            </NavLink>
            <NavLink to="/games/listening" className={linkClass} onClick={() => setOpen(false)}>
              Listening Quiz
            </NavLink>
            <NavLink to="/games/speed" className={linkClass} onClick={() => setOpen(false)}>
              Speed Round
            </NavLink>
            <NavLink to="/games/reverse" className={linkClass} onClick={() => setOpen(false)}>
              Reverse Quiz
            </NavLink>
            <NavLink to="/games/spelling" className={linkClass} onClick={() => setOpen(false)}>
              Spell It
            </NavLink>
            <NavLink to="/games/sentences" className={linkClass} onClick={() => setOpen(false)}>
              Sentence Builder
            </NavLink>
            <p className="px-3 pt-2 pb-1 text-xs font-semibold text-white/50 uppercase tracking-wide">
              Tools
            </p>
            <NavLink to="/review" className={linkClass} onClick={() => setOpen(false)}>
              Review
            </NavLink>
            <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
              Progress Dashboard
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
