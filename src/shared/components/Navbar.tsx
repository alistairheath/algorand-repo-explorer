import { NavLink } from "react-router-dom";
import algoLogo from "../../assets/algorand-algo-logo.png";

// Create a reusable component for the navigation items
function NavItem({ to, label, emoji }: { to: string; label: string; emoji: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `btn btn-ghost btn-sm ${isActive ? "bg-accent text-accent-content" : ""}`
      }
      end={to === "/repos"}
    >
      {emoji} {label}
    </NavLink>
  );
}

// Create the navbar component
export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b max-w-screen">
      <div className="mx-auto max-w-screen w-screen flex flex-row">
        <div className="flex-1">
          <NavLink to="/repos" className="btn btn-ghost md:text-xl text-md">
            <img src={algoLogo} alt="Algorand Logo" className="h-8 w-8 mr-2 dark:invert" />
            Algorand Repo Explorer
          </NavLink>
        </div>

        <div className="flex flex-row gap-2">
          <NavItem to="/repos" label="Repos" emoji="📦"/>
          <NavItem to="/favorites" label="Favorites" emoji="❤️" />
        </div>
      </div>
    </div>
  );
}
