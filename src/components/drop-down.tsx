import { LayoutDashboard, Link2, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/user-context";
import useFetch from "../hooks/use-fetch";
import { logout } from "../db/auth";

function DropDown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { user, fetchUser } = useUserContext();
  const { loading, fn: logoutFn } = useFetch(logout);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutFn();
    fetchUser();
    navigate("/login");
  };

  if (!user) return null;
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)}>
        <img
          src={user.user_metadata?.profile}
          alt={user.user_metadata?.name || "User"}
          className="h-10 w-10 rounded-full border-2 border-primary cursor-pointer object-contain"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl backdrop-blur">
          <div className="border-b border-white/10 p-4">
            <p className="font-semibold text-primary capitalize">
              {user.user_metadata?.name || "User "}
            </p>

            <p className="truncate text-sm text-zinc-400">{user.email}</p>
          </div>

          <div className="p-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/links"
              className="mt-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <Link2 size={18} />
              My Links
            </Link>

            <div className="my-2 border-t border-white/10" />

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDown;
