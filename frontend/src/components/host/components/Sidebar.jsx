// components/Sidebar.jsx
import React from "react";
import { X } from "lucide-react";

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  const menu = ["Dashboard", "Create Tournament", "My Tournaments", "Profile"];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen
        w-64 md:w-60 
        bg-[#0D1117] border-r border-[#2a2f3a] text-white 
        flex flex-col 
        transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-[#2a2f3a]">
          <span className="text-lg font-bold">
            <span className="text-[#ff4655]">Host</span>Hub
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-[#1E2837] p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-3">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActivePage(item);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                activePage === item 
                  ? "bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.3)]" 
                  : "hover:bg-[#1E2837] hover:border-[#ff4655] border border-transparent"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs sm:text-sm text-center border-t border-[#2a2f3a] text-gray-400">
          © 2025 HostHub
        </div>
      </div>
    </>
  );
}
