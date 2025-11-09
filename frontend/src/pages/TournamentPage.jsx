import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TournamentCard from "../components/TournamentCard";
import Footer from "../components/Footer";
import { formatTimeLeft } from "../utils/dateUtils";

// Placeholder tournament data (can be replaced by API later)
const tournamentsData = [
  {
    id: 1,
    name: "VALORANT ELITE CUP",
    date: "2025-11-07T19:00:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
  {
    id: 2,
    name: "PHANTOM ARENA SERIES",
    date: "2025-11-25T21:00:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
  {
    id: 3,
    name: "REBELS SHOWDOWN",
    date: "2025-12-05T17:00:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
  {
    id: 4,
    name: "SPIKE MASTERS",
    date: "2025-12-20T20:30:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
  {
    id: 5,
    name: "RED FURY INVITATIONAL",
    date: "2025-11-18T15:00:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
  {
    id: 6,
    name: "NEON RUSH OPEN",
    date: "2025-12-08T22:00:00",
    image: "https://wallpapercave.com/wp/wp8213594.jpg",
  },
];

export default function Tournaments() {
  const [tournaments, setTournaments] = useState(tournamentsData);

  useEffect(() => {
    const updateCountdowns = () => {
      setTournaments((prev) =>
        prev.map((t) => ({
          ...t,
          timeLeft: formatTimeLeft(t.date),
        }))
      );
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron">
      <Navbar />

      <div className="px-6 py-20 pt-28 max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,70,85,0.6)",
                "0 0 40px rgba(255,70,85,0.8)",
                "0 0 20px rgba(255,70,85,0.6)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-6xl font-extrabold text-[#ff4655] mb-4"
          >
            Upcoming Tournaments
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Join the battlefield and compete for glory
          </p>
        </motion.div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tournaments.map((tournament, index) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              index={index}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
