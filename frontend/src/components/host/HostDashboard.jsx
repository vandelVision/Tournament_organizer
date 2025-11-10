import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useUser } from "../../context/UserContext";
import UnverifiedUser from "../UnverifiedUser";
// Dummy data for demonstration
const hostStats = {
  name: "Jane Smith",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=JaneSmith",
  totalEvents: 18,
  eventsConducted: 15,
  eventsCancelled: 3,
  upcomingEvents: 2,
  totalParticipants: 320,
  avgParticipants: 21,
  topEvent: "Valorant Masters 2025",
  history: [
    {
      name: "Valorant Masters 2025",
      status: "Conducted",
      participants: 40,
      date: "2025-10-12",
    },
    {
      name: "Spring Showdown",
      status: "Cancelled",
      participants: 0,
      date: "2025-03-22",
    },
    {
      name: "Summer Cup",
      status: "Conducted",
      participants: 28,
      date: "2025-06-15",
    },
    {
      name: "Autumn Clash",
      status: "Conducted",
      participants: 35,
      date: "2025-09-10",
    },
    {
      name: "Winter Brawl",
      status: "Upcoming",
      participants: null,
      date: "2025-12-01",
    },
  ],
};

const HostDashboard = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col text-white font-orbitron">
      <Navbar host={true} />
      {user && user.Verified === false ? (
        <UnverifiedUser />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-start px-4 pt-28 pb-16">
          <div className="w-full max-w-[1200px] mx-auto rounded-2xl p-8 border border-white/10">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <img
                  src={hostStats.avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-[#ff4655] shadow-lg mb-2"
                />
                <div className="text-lg font-semibold">{hostStats.name}</div>
                <div className="mt-2 text-base font-bold text-[#ff4655]">
                  Host
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                  <div className="text-sm text-gray-400">Total Events</div>
                  <div className="text-2xl font-bold text-red-400">
                    {hostStats.totalEvents}
                  </div>
                </div>
                <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                  <div className="text-sm text-gray-400">Conducted</div>
                  <div className="text-2xl font-bold text-green-400">
                    {hostStats.eventsConducted}
                  </div>
                </div>
                <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                  <div className="text-sm text-gray-400">Cancelled</div>
                  <div className="text-2xl font-bold text-red-500">
                    {hostStats.eventsCancelled}
                  </div>
                </div>
                <div className="bg-[#212A37] rounded-xl p-4 text-center shadow-lg">
                  <div className="text-sm text-gray-400">Upcoming</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {hostStats.upcomingEvents}
                  </div>
                </div>
              </div>
            </div>
            {/* Event Stats */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center items-center">
              <div className="bg-[#212A37] rounded-xl p-6 text-center shadow-lg w-full md:w-1/3">
                <div className="text-sm text-gray-400">Total Participants</div>
                <div className="text-2xl font-bold text-blue-400">
                  {hostStats.totalParticipants}
                </div>
              </div>
              <div className="bg-[#212A37] rounded-xl p-6 text-center shadow-lg w-full md:w-1/3">
                <div className="text-sm text-gray-400">
                  Avg. Participants/Event
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {hostStats.avgParticipants}
                </div>
              </div>
              <div className="bg-[#212A37] rounded-xl p-6 text-center shadow-lg w-full md:w-1/3">
                <div className="text-sm text-gray-400">Top Event</div>
                <div className="text-lg font-bold text-yellow-400">
                  {hostStats.topEvent}
                </div>
              </div>
            </div>
            {/* Event History Grid */}
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4">
                Recent Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostStats.history.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#212A37] rounded-xl p-4 border border-white/10 shadow-lg flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-white">
                        {item.name}
                      </span>
                      <span
                        className={`font-bold px-3 py-1 rounded text-xs sm:text-sm ${
                          item.status === "Conducted"
                            ? "bg-green-700 text-green-300"
                            : item.status === "Cancelled"
                            ? "bg-red-700 text-red-300"
                            : "bg-yellow-700 text-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Date: {item.date}</span>
                      <span>
                        Participants:{" "}
                        <span className="text-blue-400 font-bold">
                          {item.participants !== null ? item.participants : "-"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default HostDashboard;
