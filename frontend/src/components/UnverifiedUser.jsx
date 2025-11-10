import React, { useState } from "react";
import { motion } from "framer-motion";
import { CircleAlert, RefreshCw } from "lucide-react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

const UnverifiedUser = () => {
  const { user } = useUser();
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await api.resendVerification?.();
      toast.success(
        "Verification email sent. Check your inbox (and spam folder).",
        { duration: 4000 }
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not resend verification right now."
      );
    } finally {
      setSending(false);
    }
  };

  if (!user) return null; // Guard: only show if a user exists

  return (
    <div className="flex items-center justify-center font-sans w-full min-h-[74vh] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full mx-auto rounded-xl border border-[#2a2f3a] bg-[#1E2837] p-4 sm:p-6 shadow-lg shadow-black/40"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 mt-0.5 sm:mt-1 text-[#ff4655]">
            <CircleAlert className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-[#ff4655]">
              Verify Your Account
            </h2>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">
              Hey{" "}
              <span className="font-semibold text-white">
                {user?.username || user?.email}
              </span>
              , your account isn't verified yet. Please check your email for a
              verification link. Once verified, refresh this page or log back in
              to unlock full access.
            </p>
            <ul className="text-gray-400 text-[10px] xs:text-xs sm:text-sm space-y-1 list-disc pl-4 sm:pl-5">
              <li>
                If you don't see the email, check spam / promotions folders.
              </li>
              <li>
                The link may expire after a short period—request another if
                needed.
              </li>
              <li>
                Contact support if you're stuck:{" "}
                <a
                  href="mailto:critzone@zohomail.in"
                  className="text-[#ff4655] hover:underline break-all"
                >
                  critzone@zohomail.in
                </a>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={sending}
                className={`group inline-flex items-center justify-center gap-2 rounded-md px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[#ff4655] focus:ring-offset-2 focus:ring-offset-[#1E2837] shadow-md ${
                  sending
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#ff4655] to-red-600 hover:from-red-600 hover:to-[#ff4655] text-white"
                }`}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${sending ? "animate-spin" : ""}`}
                />
                {sending ? "Sending…" : "Resend Email"}
              </button>
              {/* Optional logout button for UX (can hide if not desired) */}
              {/* <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold uppercase tracking-wide bg-[#2a2f3a] text-gray-300 hover:bg-[#334153] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4655] focus:ring-offset-2 focus:ring-offset-[#1E2837]"
            >
              Logout
            </button> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UnverifiedUser;
