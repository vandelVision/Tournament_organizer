import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import omen from "/src/assets/omen.png";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron flex flex-col justify-between">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center flex-grow px-6 sm:px-10 gap-10 sm:gap-16 text-center sm:text-left z-10 relative">
        {/* Left Side */}
        <div className="flex flex-col items-center sm:items-end space-y-6 sm:w-1/3">
          <motion.h2
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.6)]"
          >
            BATTLE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gray-300 max-w-xs text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Experience the next evolution of competitive gaming. Enter. Compete.
            Dominate.
          </motion.p>
        </div>

        {/* Center Floating Image */}
        <div className="flex justify-center sm:w-1/3">
          <motion.img
            src={omen}
            alt="Agent Omen"
            className="w-56 sm:w-72 md:w-[480px] opacity-90 pointer-events-none"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: [0, -15, 0] }}
            transition={{
              opacity: { duration: 1.2, ease: "easeOut" },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center sm:items-start space-y-6 sm:w-1/3">
          <motion.h2
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.6)]"
          >
            ARENA 2025
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center sm:justify-start"
          >
            <button className="px-8 py-3 text-lg font-bold border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all">
              Register now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
