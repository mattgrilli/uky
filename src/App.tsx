import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Alphabet from "./pages/Alphabet";
import LetterDetail from "./pages/LetterDetail";
import MatchingGame from "./pages/MatchingGame";
import MultipleChoice from "./pages/MultipleChoice";
import TypingPractice from "./pages/TypingPractice";
import Lesson from "./pages/Lesson";
import VocabQuiz from "./pages/VocabQuiz";
import VocabMatch from "./pages/VocabMatch";
import Conjugation from "./pages/Conjugation";
import SentenceBuilder from "./pages/SentenceBuilder";
import ListeningQuiz from "./pages/ListeningQuiz";
import SpeedRound from "./pages/SpeedRound";
import ReverseQuiz from "./pages/ReverseQuiz";
import SpellIt from "./pages/SpellIt";
import FallingWords from "./pages/FallingWords";
import Review from "./pages/Review";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="alphabet" element={<Alphabet />} />
          <Route path="alphabet/:id" element={<LetterDetail />} />
          <Route path="lessons/:id" element={<Lesson />} />
          <Route path="lessons/:id/quiz" element={<VocabQuiz />} />
          <Route path="lessons/:id/match" element={<VocabMatch />} />
          <Route path="conjugation" element={<Conjugation />} />
          <Route path="games/matching" element={<MatchingGame />} />
          <Route path="games/quiz" element={<MultipleChoice />} />
          <Route path="games/typing" element={<TypingPractice />} />
          <Route path="games/sentences" element={<SentenceBuilder />} />
          <Route path="games/listening" element={<ListeningQuiz />} />
          <Route path="games/speed" element={<SpeedRound />} />
          <Route path="games/reverse" element={<ReverseQuiz />} />
          <Route path="games/spelling" element={<SpellIt />} />
          <Route path="units/:unitNum/falling-words" element={<FallingWords />} />
          <Route path="review" element={<Review />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
