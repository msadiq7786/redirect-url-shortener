import { Link } from "react-router-dom";
import RedirectLogo from "../assets/redirect.svg";

const year = new Date().getFullYear();

function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-white/6 bg-canvas p-4">
      <Link
        to="/"
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <img src={RedirectLogo} className="w-8 h-8" />
      </Link>
      <p className="text-xs text-zinc-600">
        © {year} Redirect. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
