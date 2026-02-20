import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BackgroundDecor from "./BackgroundDecor";

export default function Layout() {
  return (
    <div className="min-h-screen bg-playful">
      <BackgroundDecor />
      <Navbar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 page-enter">
        <Outlet />
      </main>
    </div>
  );
}
