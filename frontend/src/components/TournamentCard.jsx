import { motion } from "framer-motion";
import { Calendar, Clock, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateIST, formatTimeIST } from "../utils/dateUtils";

export default function TournamentCard({ tournament, index }) {
  const navigate = useNavigate();
  const isLive = tournament.timeLeft === "Live Now";

  const handleButtonClick = () => {
    if (!isLive) {
      navigate(`/tournament/${tournament.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="relative group"
    >
      {/* Animated Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655] via-red-600 to-[#ff4655] rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

      <div className="relative bg-[#1E2837] rounded-2xl overflow-hidden border border-[#2a2f3a] group-hover:border-[#ff4655] transition-all duration-300">
        {/* Live Badge */}
        {isLive && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </motion.div>
        )}

        {/* Image with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2837] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tournament Name */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff4655] transition-colors">
            {tournament.name}
          </h3>

          {/* Info Grid */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4 text-[#ff4655]" />
              <span>{formatDateIST(tournament.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4 text-[#ff4655]" />
              <span>{formatTimeIST(tournament.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4 text-[#ff4655]" />
              <span>{tournament.participants || "32"} Slots</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-[#121418] rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase">
                {isLive ? "Match in Progress" : "Starts In"}
              </span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <motion.p
              animate={isLive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className={`text-lg font-bold mt-1 ${
                isLive ? "text-green-400" : "text-[#ff4655]"
              }`}
            >
              {tournament.timeLeft}
            </motion.p>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={!isLive ? { scale: 1.02 } : {}}
            whileTap={!isLive ? { scale: 0.98 } : {}}
            onClick={handleButtonClick}
            disabled={isLive}
            className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              isLive
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#ff4655] to-red-600 hover:from-red-600 hover:to-[#ff4655] text-white"
            }`}
          >
            {isLive ? "Closed for Registration" : "Register Now"}
          </motion.button>
        </div>

        {/* Tournament ID Badge */}
        <div className="absolute bottom-4 right-4 bg-[#121418] border border-[#2a2f3a] rounded-full px-3 py-1">
          <span className="text-xs text-gray-500 font-mono">
            #{tournament.id.toString().padStart(3, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
