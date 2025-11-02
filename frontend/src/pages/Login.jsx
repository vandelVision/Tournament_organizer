import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    if (name === "confirmPassword" || name === "password") {
      if (
        (name === "confirmPassword" && value !== formData.password) ||
        (name === "password" &&
          formData.confirmPassword &&
          formData.confirmPassword !== value)
      ) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = { ...formData, mode };
    console.log("Submitted Data:", JSON.stringify(payload, null, 2));
    alert(`✅ ${mode === "login" ? "Logged in" : "Signed up"} successfully!`);
    setError("");
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setFormData({
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron overflow-hidden px-4">
        {/* Animated red glow */}
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full bg-red-500/20 blur-3xl -z-10"
          animate={{ y: [0, -20, 0], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-sm bg-[#1E2837]/80 backdrop-blur-lg rounded-2xl p-6 shadow-[0_0_30px_#ff4655] border border-[#ff4655]/40 z-10"
        >
          {/* Title */}
          <motion.h2
            key={mode}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl font-extrabold text-center text-red-500 mb-5 drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          >
            {mode === "login" ? "Welcome Back, Agent" : "Join the Arena"}
          </motion.h2>

          {/* AnimatePresence for form switch */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                />
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="+1 555 123 4567"
                      value={formData.mobile}
                      onChange={handleChange}
                      pattern="[0-9+\s-]{8,}"
                      required
                      className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border ${
                      error ? "border-red-500" : "border-[#ff4655]/40"
                    } focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm`}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px #ff4655" }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-2 px-6 py-2.5 font-bold bg-red-600 rounded-md hover:bg-red-500 shadow-[0_0_20px_#ef4444] transition-all text-base"
              >
                {mode === "login" ? "Log In" : "Sign Up"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Toggle between Login and Signup */}
          <div className="mt-4 text-center text-xs text-gray-400">
            {mode === "login" ? (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-red-400 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-red-400 hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
