import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import omen from '/src/assets/omen.png'

const tournaments = [
  {
    id: 1,
    title: "Valorant Showdown 2025",
    date: "March 15, 2025",
    prize: "$50,000",
    image: omen,
  },
  {
    id: 2,
    title: "Champions Cup",
    date: "April 10, 2025",
    prize: "$75,000",
    image: "https://wallpapers.com/images/high/valorant-computer-jett-red-background-41cnkf389lrq3myk.webp",
  },
  {
    id: 3,
    title: "Battle Nexus Finals",
    date: "May 2, 2025",
    prize: "$100,000",
    image: "https://wallpapers.com/images/high/valorant-characters-k3yaxlo6k86pmtpi.webp",
  },
  {
    id: 4,
    title: "Phoenix Rising",
    date: "June 18, 2025",
    prize: "$40,000",
    image: "https://wallpapers.com/images/high/valorant-jett-and-phoenix-computer-0lvh6plfkmk9z8yv.webp",
  },
];

export default function UpcomingTournaments() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startSlideShow = () => {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setCurrent((prev) => (prev + 1) % tournaments.length);
        }
      }, 3000);
    };

    startSlideShow();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % tournaments.length);
    // Reset timer on manual navigation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + tournaments.length) % tournaments.length);
    // Reset timer on manual navigation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron overflow-hidden">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-red-500 mb-10 drop-shadow-[0_0_30px_rgba(255,0,0,0.6)] text-center"
      >
        Upcoming Tournaments
      </motion.h1>

      {/* Slider Container */}
      <div className="relative w-full max-w-6xl flex justify-center items-center">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-10 z-20 bg-[#1b2430]/60 hover:bg-red-500/30 p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Card Slider */}
        <div className="overflow-hidden w-full px-10">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#212A37]/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_25px_#ff4655] border border-[#ff4655]/40 w-full sm:w-3/4 md:w-2/3"
            >
              <img
                src={tournaments[current].image}
                alt={tournaments[current].title}
                className="w-full h-64 sm:h-80 object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center px-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">
                  {tournaments[current].title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  {tournaments[current].date}
                </p>
                <p className="text-gray-400 text-sm sm:text-base mb-4">
                  Prize Pool: {tournaments[current].prize}
                </p>
                <button className="px-8 py-3 text-sm sm:text-lg font-bold bg-red-600 rounded-md hover:bg-red-500 shadow-[0_0_25px_#ef4444] transition-all">
                  Learn More
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-10 z-20 bg-[#1b2430]/60 hover:bg-red-500/30 p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Subtle floating background glow */}
      <motion.div
        className="absolute -bottom-20 w-[600px] h-[600px] rounded-full bg-red-500/20 blur-3xl z-0"
        animate={{ y: [0, -20, 0], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
