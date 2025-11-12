// pages/CreateTournament.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CreateTournament() {
  const [form, setForm] = useState({
    gameName: "",
    date: "",
    slots: "",
    rules: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Tournament for ${form.gameName} scheduled!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white"
      >
        Create Tournament
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg shadow-lg p-4 sm:p-6"
      >
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-gray-300">Game Name</label>
          <input
            type="text"
            name="gameName"
            value={form.gameName}
            onChange={handleChange}
            className="w-full bg-[#0f1923] border border-gray-700 text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-gray-300">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-[#0f1923] border border-gray-700 text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-gray-300">Number of Slots</label>
          <input
            type="number"
            name="slots"
            value={form.slots}
            onChange={handleChange}
            className="w-full bg-[#0f1923] border border-gray-700 text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-gray-300">Rules / Description</label>
          <textarea
            name="rules"
            rows="3"
            value={form.rules}
            onChange={handleChange}
            className="w-full bg-[#0f1923] border border-gray-700 text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 70, 85, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#ff4655] text-white py-2 sm:py-2.5 rounded-md hover:bg-red-600 transition-all shadow-md text-sm sm:text-base font-semibold"
        >
          Schedule Tournament
        </motion.button>
      </form>
      </motion.div>
    </motion.div>
  );
}
