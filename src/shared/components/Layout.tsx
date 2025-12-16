import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// create the basic layout for our pages. This includes the navbar and a main content area.
export default function Layout() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />

      <main className="mx-auto max-w-screen w-screen md:w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
