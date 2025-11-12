// pages/MyTournaments.jsx
import React from "react";
import { motion } from "framer-motion";

export default function MyTournaments() {
  const tournaments = [
    { name: "Valorant Cup", status: "Active", date: "2025-11-20" },
    { name: "CS:GO Showdown", status: "Completed", date: "2025-09-10" },
    { name: "Apex Clash", status: "Cancelled", date: "2025-08-01" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white"
      >
        My Tournaments
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg shadow-lg overflow-x-auto"
      >
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-[#ff4655] text-white">
            <tr>
              <th className="p-2 sm:p-3 text-left">Game</th>
              <th className="p-2 sm:p-3 text-left">Date</th>
              <th className="p-2 sm:p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                whileHover={{ backgroundColor: "#151b26", scale: 1.01 }}
                className="border-b border-[#2a2f3a] cursor-pointer"
              >
                <td className="p-2 sm:p-3 text-gray-300">{t.name}</td>
                <td className="p-2 sm:p-3 text-gray-300">{t.date}</td>
                <td
                  className={`p-2 sm:p-3 font-semibold ${
                    t.status === "Active"
                      ? "text-green-400"
                      : t.status === "Cancelled"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {t.status}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
