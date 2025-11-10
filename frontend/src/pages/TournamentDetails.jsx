import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  MapPin,
  DollarSign,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  formatDateIST,
  formatTimeIST,
  formatDateTimeIST,
} from "../utils/dateUtils";
import { useUser } from "../context/UserContext";
import UnverifiedUser from "../components/UnverifiedUser";

// This would typically come from an API or props
const tournamentsData = [
  {
    id: 1,
    name: "VALORANT ELITE CUP",
    date: "2025-12-15T18:00:00",
    image:
      "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=800&q=80",
    description:
      "Join the most prestigious VALORANT tournament of the season. Compete against the best teams and prove your worth in the arena.",
    prizePool: "$10,000",
    entryFee: "$50",
    maxTeams: 32,
    registeredTeams: 24,
    format: "Single Elimination",
    location: "Online",
    rules: [
      "Teams must consist of 5 players",
      "All matches are best of 3",
      "Finals are best of 5",
      "No cheating or unfair play tolerated",
    ],
    schedule: [
      { round: "Registration Closes", time: "2025-12-14T23:59:00" },
      { round: "Check-in Opens", time: "2025-12-15T17:00:00" },
      { round: "Tournament Starts", time: "2025-12-15T18:00:00" },
    ],
  },
  {
    id: 2,
    name: "PHANTOM ARENA SERIES",
    date: "2025-11-25T21:00:00",
    image:
      "https://images.unsplash.com/photo-1602526432604-029a709e1221?auto=format&fit=crop&w=800&q=80",
    description:
      "Battle it out in the Phantom Arena Series for glory and rewards.",
    prizePool: "$5,000",
    entryFee: "$25",
    maxTeams: 16,
    registeredTeams: 12,
    format: "Double Elimination",
    location: "Online",
  },
  {
    id: 3,
    name: "REBELS SHOWDOWN",
    date: "2025-12-05T17:00:00",
    image:
      "https://images.unsplash.com/photo-1615461066841-4f5c27b4b5d2?auto=format&fit=crop&w=800&q=80",
    description:
      "The Rebels Showdown brings together competitive teams for an intense tournament.",
    prizePool: "$7,500",
    entryFee: "$30",
    maxTeams: 24,
    registeredTeams: 18,
    format: "Swiss System",
    location: "Online",
  },
  {
    id: 4,
    name: "SPIKE MASTERS",
    date: "2025-12-20T20:30:00",
    image:
      "https://images.unsplash.com/photo-1612036782182-5a9c75d8f9ed?auto=format&fit=crop&w=800&q=80",
    description:
      "Master the spike and dominate your opponents in this thrilling competition.",
    prizePool: "$15,000",
    entryFee: "$75",
    maxTeams: 32,
    registeredTeams: 20,
    format: "Single Elimination",
    location: "Online",
  },
  {
    id: 5,
    name: "RED FURY INVITATIONAL",
    date: "2025-11-18T15:00:00",
    image:
      "https://images.unsplash.com/photo-1623051531851-52a77b3c9c6a?auto=format&fit=crop&w=800&q=80",
    description:
      "An exclusive invitational tournament featuring top-tier teams.",
    prizePool: "$20,000",
    entryFee: "Invite Only",
    maxTeams: 16,
    registeredTeams: 16,
    format: "Round Robin + Playoffs",
    location: "Hybrid",
  },
  {
    id: 6,
    name: "NEON RUSH OPEN",
    date: "2025-12-08T22:00:00",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80",
    description: "Rush into action with the Neon Rush Open tournament series.",
    prizePool: "$8,000",
    entryFee: "$40",
    maxTeams: 32,
    registeredTeams: 15,
    format: "Single Elimination",
    location: "Online",
  },
];

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const tournament = tournamentsData.find((t) => t.id === parseInt(id));

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#ff4655] mb-4">
            Tournament Not Found
          </h1>
          <button
            onClick={() => navigate("/tournaments")}
            className="px-6 py-3 bg-[#ff4655] rounded-lg hover:bg-red-600 transition-all"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const spotsLeft = tournament.maxTeams - tournament.registeredTeams;
  const progressPercentage =
    (tournament.registeredTeams / tournament.maxTeams) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron">
      <Navbar />
      {user?.Verified === false ? (
        <UnverifiedUser />
      ) : (
        <div className="px-6 py-20 pt-28 max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/tournaments")}
            className="mb-6 text-gray-400 hover:text-[#ff4655] transition-colors flex items-center gap-2"
          >
            ← Back to Tournaments
          </button>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={tournament.image}
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-extrabold text-[#ff4655] mb-2"
              >
                {tournament.name}
              </motion.h1>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1E2837] rounded-2xl p-6 border border-[#2a2f3a]"
              >
                <h2 className="text-2xl font-bold text-[#ff4655] mb-4">
                  About Tournament
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {tournament.description ||
                    "Join this exciting tournament and compete for glory!"}
                </p>
              </motion.div>

              {/* Tournament Rules */}
              {tournament.rules && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#1E2837] rounded-2xl p-6 border border-[#2a2f3a]"
                >
                  <h2 className="text-2xl font-bold text-[#ff4655] mb-4">
                    Rules & Requirements
                  </h2>
                  <ul className="space-y-2">
                    {tournament.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className="text-[#ff4655] mt-1">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Schedule */}
              {tournament.schedule && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#1E2837] rounded-2xl p-6 border border-[#2a2f3a]"
                >
                  <h2 className="text-2xl font-bold text-[#ff4655] mb-4">
                    Schedule
                  </h2>
                  <div className="space-y-3">
                    {tournament.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-[#2a2f3a] pb-3"
                      >
                        <span className="text-gray-300">{item.round}</span>
                        <span className="text-gray-400 text-sm">
                          {formatDateTimeIST(item.time)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1E2837] rounded-2xl p-6 border border-[#2a2f3a] space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white font-semibold">
                      {formatDateIST(tournament.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-white font-semibold">
                      {formatTimeIST(tournament.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Prize Pool</p>
                    <p className="text-white font-semibold">
                      {tournament.prizePool}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Entry Fee</p>
                    <p className="text-white font-semibold">
                      {tournament.entryFee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Format</p>
                    <p className="text-white font-semibold">
                      {tournament.format}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#ff4655]" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-white font-semibold">
                      {tournament.location}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Registration Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1E2837] rounded-2xl p-6 border border-[#2a2f3a]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-[#ff4655]" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Teams Registered</p>
                    <p className="text-white font-semibold">
                      {tournament.registeredTeams} / {tournament.maxTeams}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#121418] rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-gradient-to-r from-[#ff4655] to-red-600 h-2 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  {spotsLeft > 0
                    ? `${spotsLeft} spots remaining`
                    : "Tournament Full"}
                </p>

                {/* Register Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={spotsLeft === 0}
                  className={`w-full mt-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                    spotsLeft > 0
                      ? "bg-gradient-to-r from-[#ff4655] to-red-600 hover:from-red-600 hover:to-[#ff4655] text-white"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {spotsLeft > 0 ? "Register Now" : "Registration Closed"}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
