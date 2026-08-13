import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bus,
  LogOut,
  User,
  Menu,
  X,
  Ticket,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      setUser(null);
      setMenuOpen(false);

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const desktopLink = (active) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${active
      ? "bg-white/15 text-white"
      : "text-indigo-50 hover:bg-white/10 hover:text-white"
    }`;

  const mobileLink = (active) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition ${active
      ? "bg-white/15 text-white"
      : "text-indigo-50 hover:bg-white/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">


        <div className="h-16 flex items-center justify-between">


          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 group"
          >
            <div className="bg-white/15 p-2 rounded-xl group-hover:bg-white/20 transition">
              <Bus size={24} />
            </div>

            <div>
              <span className="text-xl font-bold tracking-tight">
                Bus
                <span className="text-indigo-200">
                  Book
                </span>
              </span>

              <p className="hidden sm:block text-[10px] text-indigo-200 -mt-0.5 tracking-wide">
                SIMPLE • FAST • RELIABLE
              </p>
            </div>
          </Link>


          <div className="hidden md:flex items-center gap-1">

            {user ? (
              <>

                <Link
                  to="/"
                  className={desktopLink(isActive("/"))}
                >
                  <Ticket size={17} />
                  Book Ticket
                </Link>



                <Link
                  to="/bookings"
                  className={desktopLink(
                    isActive("/bookings")
                  )}
                >
                  <Ticket size={17} />
                  My Bookings
                </Link>

                {/* Admin */}

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={desktopLink(
                      isActive("/admin")
                    )}
                  >
                    <LayoutDashboard size={17} />
                    Admin
                  </Link>
                )}



                <div className="h-7 w-px bg-white/20 mx-3" />



                <div className="flex items-center gap-2 px-3">

                  <div className="w-8 h-8 rounded-full bg-white/15 border border-white/10 flex items-center justify-center">
                    <User size={16} />
                  </div>

                  <div className="max-w-32">
                    <p className="font-medium text-sm truncate">
                      {user.name || "User"}
                    </p>

                    <p className="text-[10px] text-indigo-200 capitalize">
                      {user.role || "passenger"}
                    </p>
                  </div>

                </div>



                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-50 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <LogOut size={17} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={desktopLink(
                    isActive("/login")
                  )}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="ml-1 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

          {/* ================= MOBILE BUTTON ================= */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

        {/* ================ MOBILE MENU ================= */}

        {menuOpen && (
          <div className="md:hidden border-t border-white/15 py-4">

            {user ? (
              <div className="flex flex-col gap-1">


                <div className="flex items-center gap-3 px-3 py-3 mb-2">

                  <div className="w-11 h-11 rounded-full bg-white/15 border border-white/10 flex items-center justify-center">
                    <User size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold truncate">
                      {user.name || "User"}
                    </p>

                    <p className="text-xs text-indigo-200 capitalize">
                      {user.role === "admin"
                        ? "Administrator"
                        : "Passenger"}
                    </p>

                  </div>

                </div>

                <div className="h-px bg-white/15 mb-2" />



                <Link
                  to="/"
                  onClick={closeMenu}
                  className={mobileLink(
                    isActive("/")
                  )}
                >
                  <Ticket size={19} />
                  Book Ticket
                </Link>



                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className={mobileLink(
                    isActive("/bookings")
                  )}
                >
                  <Ticket size={19} />
                  My Bookings
                </Link>



                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className={mobileLink(
                      isActive("/admin")
                    )}
                  >
                    <LayoutDashboard size={19} />
                    Admin Dashboard
                  </Link>
                )}


                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-left font-medium text-indigo-50 hover:bg-white/10 disabled:opacity-50 transition mt-1"
                >
                  <LogOut size={19} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>

              </div>
            ) : (
              <div className="flex flex-col gap-2">

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={mobileLink(
                    isActive("/login")
                  )}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-xl bg-white text-indigo-600 font-semibold text-center"
                >
                  Sign Up
                </Link>

              </div>
            )}

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;