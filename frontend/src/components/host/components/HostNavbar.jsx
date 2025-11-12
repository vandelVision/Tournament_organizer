// components/HostNavbar.jsx
import React from "react";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function HostNavbar({ setSidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-30 bg-[#0D1117] border-b border-[#2a2f3a] px-4 py-3 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-white p-2 hover:bg-[#1E2837] rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Logo/Title */}
      <div className="flex items-center gap-2">
        <span className="text-lg sm:text-xl font-bold">
          <span className="text-[#ff4655]">Host</span>
          <span className="text-white">Hub</span>
        </span>
      </div>

      {/* Right side - Logout Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-[#ff4655] hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-[0_0_15px_rgba(255,70,85,0.5)] text-sm sm:text-base font-semibold"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
