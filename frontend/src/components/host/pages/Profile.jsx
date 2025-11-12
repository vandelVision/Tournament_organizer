// pages/Profile.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const host = {
    name: "Ravi Kumar",
    email: "ravi@hosthub.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=RaviKumar",
    totalTournaments: 12,
    eventsConducted: 10,
    eventsCancelled: 2,
    upcomingEvents: 3,
    totalParticipants: 280,
    role: "Tournament Host",
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
        Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg shadow-lg p-4 sm:p-6"
      >
        {/* Avatar and Basic Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[#2a2f3a]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center"
          >
            <img
              src={host.avatar}
              alt="avatar"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[#ff4655] shadow-lg mb-2"
            />
            <div className="text-base sm:text-lg font-semibold text-white text-center">{host.name}</div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-[#ff4655]">
              {host.role}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex-1 space-y-2 sm:space-y-3 w-full"
          >
            <div className="text-gray-300">
              <span className="text-gray-400 text-xs sm:text-sm">Email:</span>
              <div className="text-white font-semibold text-sm sm:text-base break-all">{host.email}</div>
            </div>
            <div className="text-gray-300">
              <span className="text-gray-400 text-xs sm:text-sm">Total Participants Managed:</span>
              <div className="text-[#ff4655] font-bold text-base sm:text-lg">{host.totalParticipants}</div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 70, 85, 0.3)" }}
              className="bg-[#212A37] rounded-lg p-3 sm:p-4 text-center"
            >
              <div className="text-[10px] sm:text-xs text-gray-400">Total Events</div>
              <div className="text-xl sm:text-2xl font-bold text-red-400">
                {host.totalTournaments}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)" }}
              className="bg-[#212A37] rounded-lg p-3 sm:p-4 text-center"
            >
              <div className="text-[10px] sm:text-xs text-gray-400">Conducted</div>
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {host.eventsConducted}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
              className="bg-[#212A37] rounded-lg p-3 sm:p-4 text-center"
            >
              <div className="text-[10px] sm:text-xs text-gray-400">Cancelled</div>
              <div className="text-xl sm:text-2xl font-bold text-red-500">
                {host.eventsCancelled}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(250, 204, 21, 0.3)" }}
              className="bg-[#212A37] rounded-lg p-3 sm:p-4 text-center"
            >
              <div className="text-[10px] sm:text-xs text-gray-400">Upcoming</div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {host.upcomingEvents}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 70, 85, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#ff4655] text-white px-4 py-2 sm:py-3 rounded-md transition-all shadow-md font-semibold text-sm sm:text-base"
        >
          Edit Profile
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
