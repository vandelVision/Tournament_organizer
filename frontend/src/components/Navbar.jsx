import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import Loader from "./Loader";

const Navbar = ({ host = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, loading, setLoading } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await logout();
      toast.success(res.message || "Logged out successfully", {
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again.",
        { duration: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full flex justify-between items-center px-6 md:px-10 py-4 md:py-6 z-40 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-[#0b0f13]/60 backdrop-blur-md border-white/5"
          : "bg-transparent border-transparent"
      }`}
    >
      {loading && <Loader />}
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <svg
          className="w-12 h-12"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad2" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#ff4655" />
              <stop offset="100%" stopColor="#ff9f43" />
            </linearGradient>
          </defs>

          <circle cx="32" cy="32" r="28" stroke="url(#grad2)" strokeWidth="4" />
          <circle cx="32" cy="32" r="6" fill="url(#grad2)" />
          <path
            d="M32 12V20M32 44V52M12 32H20M44 32H52"
            stroke="url(#grad2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <span className="text-white font-orbitron text-xl sm:text-2xl font-bold tracking-widest">
          CritZone
        </span>
      </motion.div>

      {/* Desktop Menu */}
      {!host && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden md:flex space-x-10 text-sm uppercase items-center"
        >
          <Link to="/" className="hover:text-red-400 transition-colors">
            Home
          </Link>
          <Link
            to="/tournaments"
            className="hover:text-red-400 transition-colors"
          >
            Tournaments
          </Link>
          <Link to="/contact" className="hover:text-red-400 transition-colors">
            Contact
          </Link>
          {isAuthenticated ? (
            <Link
              onClick={handleLogout}
              className="px-6 py-2 text-lg font-bold bg-red-600 rounded-md hover:bg-red-500 shadow-[0_0_25px_#ef4444] transition-all"
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 text-lg font-bold bg-red-600 rounded-md hover:bg-red-500 shadow-[0_0_25px_#ef4444] transition-all"
            >
              Login
            </Link>
          )}
        </motion.div>
      )}

      {/* Mobile Menu Button */}
      {!host && (
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && !host && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-[56px] left-0 w-full bg-[#1B2430] flex flex-col items-center space-y-6 py-6 text-sm uppercase md:hidden z-10"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/tournaments"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Tournaments
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400 transition-colors"
          >
            Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
