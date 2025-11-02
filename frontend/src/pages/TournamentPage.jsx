import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

// Placeholder tournament data (can be replaced by API later)
const tournamentsData = [
  {
    id: 1,
    name: "VALORANT ELITE CUP",
    date: "2025-12-15T18:00:00",
    image: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "PHANTOM ARENA SERIES",
    date: "2025-11-25T21:00:00",
    image: "https://images.unsplash.com/photo-1602526432604-029a709e1221?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "REBELS SHOWDOWN",
    date: "2025-12-05T17:00:00",
    image: "https://images.unsplash.com/photo-1615461066841-4f5c27b4b5d2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "SPIKE MASTERS",
    date: "2025-12-20T20:30:00",
    image: "https://images.unsplash.com/photo-1612036782182-5a9c75d8f9ed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "RED FURY INVITATIONAL",
    date: "2025-11-18T15:00:00",
    image: "https://images.unsplash.com/photo-1623051531851-52a77b3c9c6a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "NEON RUSH OPEN",
    date: "2025-12-08T22:00:00",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Tournaments() {
  const [tournaments, setTournaments] = useState(tournamentsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTournaments((prev) =>
        prev.map((t) => {
          const diff = new Date(t.date) - new Date();
          const isPast = diff <= 0;
          const timeLeft = isPast
            ? "Live Now"
            : formatCountdown(diff);
          return { ...t, timeLeft };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron px-6 py-10">
      <Navbar />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl sm:text-6xl font-extrabold text-[#ff4655] mb-12 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]"
      >
        Upcoming Tournaments
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tournaments.map((tournament, i) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px #ff4655" }}
            className="relative rounded-xl overflow-hidden bg-[#121418] border border-[#2a2f3a] shadow-lg hover:border-[#ff4655] transition-all"
          >
            <img
              src={tournament.image}
              alt={tournament.name}
              className="w-full h-48 object-cover opacity-90"
            />

            <div className="p-5">
              <h3 className="text-2xl font-bold text-[#ff4655] mb-2">
                {tournament.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {tournament.timeLeft === "Live Now"
                  ? "🔥 Match in progress"
                  : "Starts in:"}
              </p>
              <p
                className={`text-lg font-semibold ${
                  tournament.timeLeft === "Live Now"
                    ? "text-green-400"
                    : "text-white"
                }`}
              >
                {tournament.timeLeft}
              </p>

              <div className="flex justify-between items-center mt-5">
                {tournament.timeLeft === "Live Now" ? (
                  <button className="px-5 py-2 text-sm font-bold bg-green-600 rounded-md hover:bg-green-500 transition-all">
                    Watch Live
                  </button>
                ) : (
                  <button className="px-5 py-2 text-sm font-bold bg-[#ff4655] rounded-md hover:bg-red-500 transition-all">
                    Register
                  </button>
                )}
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  #{tournament.id.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="text-gray-500 text-xs text-center mt-12">
        © 2025 Valorant eSports Tournaments
      </footer>
    </div>
  );
}
