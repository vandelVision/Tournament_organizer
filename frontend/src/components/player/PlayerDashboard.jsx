import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
// Dummy data for demonstration
const playerStats = {
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=JohnDoe",
  rank: "Diamond",
  rankIcon:
    "https://upload.wikimedia.org/wikipedia/commons/6/6a/Valorant_rank_diamond.png",
  totalTournaments: 12,
  wins: 5,
  losses: 7,
  winRate: "41.7%",
  kda: "1.23",
  topScore: 28,
  history: [
    {
      name: "Summer Cup 2025",
      result: "Win",
      score: 22,
      kda: "1.45",
      date: "2025-06-15",
    },
    {
      name: "Autumn Clash",
      result: "Loss",
      score: 14,
      kda: "0.98",
      date: "2025-09-10",
    },
    {
      name: "Spring Showdown",
      result: "Win",
      score: 28,
      kda: "1.67",
      date: "2025-03-22",
    },
    {
      name: "Winter Brawl",
      result: "Loss",
      score: 10,
      kda: "0.75",
      date: "2025-01-18",
    },
    {
      name: "Winter Brawl",
      result: "Loss",
      score: 10,
      kda: "0.75",
      date: "2025-01-18",
    },
  ],
};

const PlayerDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col text-white font-orbitron">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-28 pb-16">
        <div className="w-full max-w-[1200px] mx-auto rounded-2xl p-8 border border-white/10">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <img
                src={playerStats.avatar}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-[#ff4655] shadow-lg mb-2"
              />
              <div className="text-lg font-semibold">{playerStats.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                <div className="text-sm text-gray-400">Tournaments</div>
                <div className="text-2xl font-bold text-red-400">
                  {playerStats.totalTournaments}
                </div>
              </div>
              <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                <div className="text-sm text-gray-400">Wins</div>
                <div className="text-2xl font-bold text-green-400">
                  {playerStats.wins}
                </div>
              </div>
              <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                <div className="text-sm text-gray-400">Losses</div>
                <div className="text-2xl font-bold text-red-500">
                  {playerStats.losses}
                </div>
              </div>
              <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                <div className="text-sm text-gray-400">Win Rate</div>
                <div className="text-2xl font-bold text-green-400">
                  {playerStats.winRate}
                </div>
              </div>
            </div>
          </div>
          {/* Career Stats */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 justify-start items-center">
            <div className="bg-[#212A37] rounded-xl p-6 text-center w-full md:w-1/3 shadow-lg">
              <div className="text-sm text-gray-400">Best Score</div>
              <div className="text-2xl font-bold text-yellow-400">
                {playerStats.topScore}
              </div>
            </div>
            <div className="bg-[#212A37] rounded-xl p-6 text-center w-full md:w-1/3 shadow-lg">
              <div className="text-sm text-gray-400">KDA</div>
              <div className="text-2xl font-bold text-blue-400">
                {playerStats.kda}
              </div>
            </div>
          </div>
          {/* Match History Grid */}
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-4">
              Recent Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playerStats.history.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#212A37] rounded-xl p-4 border border-white/10 shadow-lg flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">
                      {item.name}
                    </span>
                    <span
                      className={`font-bold px-3 py-1 rounded ${
                        item.result === "Win"
                          ? "bg-green-700 text-green-300"
                          : "bg-red-700 text-red-300"
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Date: {item.date}</span>
                    <span>
                      KDA:{" "}
                      <span className="text-blue-400 font-bold">
                        {item.kda}
                      </span>
                    </span>
                    <span>
                      Score:{" "}
                      <span className="text-yellow-400 font-bold">
                        {item.score}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;
