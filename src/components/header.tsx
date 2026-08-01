import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "../context/user-context";
import DropDown from "./drop-down";
import RedirectLogo from "../assets/redirect.svg";
function Header() {
  const { user } = useUserContext();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img src={RedirectLogo} className="w-12 h-12 object-contain" />
        </Link>
        {!user ? (
          <nav className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-black transition hover:bg-primary-active"
            >
              Get Started
            </NavLink>
          </nav>
        ) : (
          <DropDown />
        )}
      </div>
    </header>
  );
}

export default Header;
