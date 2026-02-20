import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-playful">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 page-enter">
        <Outlet />
      </main>
    </div>
  );
}
