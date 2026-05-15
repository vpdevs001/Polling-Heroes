import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../ui/Button.js";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          Polling<span className="text-zinc-400">Heroes</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
            Features
          </a>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 transition-all ${isActive ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`
                }
              >
                Dashboard
              </NavLink>
              <span className="hidden text-zinc-500 sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
              <Button variant="ghost" type="button" onClick={() => void logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link className="text-zinc-300 hover:text-white" to="/login">
                Log in
              </Link>
              <Link to="/register">
                <Button type="button">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
