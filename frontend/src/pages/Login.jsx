import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { isAuthenticated } = useUser();
  const { login, signup } = useAuth();

  // If already authenticated, redirect away from login/signup page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const password = watch("password");

  const onSubmit = async (data) => {
    if (mode === "signup" && data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { duration: 3000 });
      return;
    }

    try {
      setLoading(true);
      if (mode === "signup") {
        const res = await signup(data);
        toast.success("Signed up successfully!");
        setMode("login");
      } else {
        const res = await login(data);
        toast.success(res.message || "Login successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(
        error.response?.data?.message ||
          "Authentication failed. Please try again.",
        { duration: 3000 }
      );
    } finally {
      setLoading(false);
    }
    reset();
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    reset();
  };

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen flex flex-col pt-28 justify-center items-center bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron overflow-hidden px-4">
        {/* Show loader overlay when loading */}
        {loading && <Loader />}

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
              onSubmit={handleSubmit(onSubmit)}
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
                  {...register("email", { required: "Email is required" })}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    placeholder="Gamer123"
                    className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /[0-9+\s-]{8,}/,
                        message: "Enter a valid mobile number",
                      },
                    })}
                    placeholder="9455566555"
                    className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border border-[#ff4655]/40 focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-md bg-[#0D1117]/60 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[#ff4655]/40"
                    } focus:border-[#ff4655] outline-none text-white placeholder-gray-500 text-sm`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
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
