// pages/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const stats = [
    { title: "Total Tournaments", value: 12 },
    { title: "Active", value: 4 },
    { title: "Completed", value: 6 },
    { title: "Cancelled", value: 2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
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
        Dashboard Overview
      </motion.h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map((s, index) => (
          <motion.div
            key={s.title}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 70, 85, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#1E2837] border border-[#2a2f3a] p-3 sm:p-4 rounded-lg shadow-lg cursor-pointer text-center"
          >
            <h2 className="text-gray-400 text-xs sm:text-sm">{s.title}</h2>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="text-xl sm:text-2xl font-bold text-[#ff4655]"
            >
              {s.value}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
