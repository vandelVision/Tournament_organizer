import { useEffect, useState } from "react";

const TournamentCard = ({ title, date, prizePool, entryFee, teamSize, image }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / (1000 * 60)) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="bg-gradient-to-b from-[#0c0f1a] to-[#161b2e] rounded-2xl shadow-[0_0_15px_rgba(255,0,85,0.25)] hover:shadow-[0_0_25px_rgba(255,0,85,0.6)] transition-transform transform hover:scale-[1.03] duration-300 overflow-hidden max-w-xs sm:max-w-sm mx-auto">
      <img src={image} alt={title} className="w-full h-36 object-cover" />

      <div className="p-4 text-center space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-pink-500">{title}</h2>
        <div className="flex justify-between text-sm text-gray-400 px-1">
          <p>Prize: <span className="text-white font-medium">{prizePool}</span></p>
          <p>Entry: <span className="text-white font-medium">{entryFee}</span></p>
        </div>
        <p className="text-sm text-gray-400">Team Size: <span className="text-white font-medium">{teamSize}</span></p>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-2 mt-3">
          {["days", "hours", "mins", "secs"].map((unit, i) => (
            <div key={i} className="bg-[#1a1f35] px-2 py-1 rounded-md">
              <span className="text-pink-500 font-semibold text-sm">{timeLeft[unit]}</span>
              <span className="block text-[10px] text-gray-400 uppercase">{unit}</span>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold text-sm shadow-md shadow-pink-500/30">
          Book Slot
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
