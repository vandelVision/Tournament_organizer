import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function HostAuth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // if (!isLogin && data.inviteCode !== "HOST-ACCESS-2025") {
    //   alert("❌ Invalid Host Invite Code");
    //   return;
    // }
    try {
      if (isLogin) {
        const data = await api.loginUser(formData);
        localStorage.setItem('token', data.token);
        setAuth({ user: data.user, token: data.token });
        navigate('/host/dashboard');
      } else {
        const data = await api.registerUser(formData);
        // After signup, you may auto-login or redirect to login
        localStorage.setItem('token', data.token);
        setAuth({ user: data.user, token: data.token });
        navigate('/host/dashboard');
      }
    } catch (err) {
      const message = err?.response?.data?.message ?? err.message ?? 'Something went wrong';
      console.log("Host Signup/Login Error", message);
      
    } finally {
      setLoading(false);
    }
    console.log(isLogin ? "Host Logging in..." : "Host Signing up...", data);
    reset();
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar host={true} />
      <main className="flex-1 bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] flex flex-col items-center justify-center text-white font-orbitron px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#121418] rounded-2xl shadow-[0_0_25px_#ff4655] p-6 sm:p-8 w-full max-w-md mt-10"
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-[#ff4655]">
            {isLogin ? "Host Login" : "Host Registration"}
          </h2>

          <p className="text-center text-gray-400 mb-6 text-sm">
            {isLogin
              ? "Access your host dashboard to manage tournaments"
              : "Register as an authorized tournament host"}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full bg-[#0f1923] rounded-lg px-4 py-2 border border-gray-700 focus:border-[#ff4655] outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min length is 6" },
                })}
                className="w-full bg-[#0f1923] rounded-lg px-4 py-2 border border-gray-700 focus:border-[#ff4655] outline-none"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password & Invite Code (only Signup) */}
            {!isLogin && (
              <>
                <div>
                  <label className="text-gray-300 text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full bg-[#0f1923] rounded-lg px-4 py-2 border border-gray-700 focus:border-[#ff4655] outline-none"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Phone Number</label>
                  <input
                    type="tel"
                    {...register("phone", {
                      pattern: {
                        value: /^\+?[0-9\s\-()]{7,20}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    placeholder="e.g. 9032000200"
                    className="w-full bg-[#0f1923] rounded-lg px-4 py-2 border border-gray-700 focus:border-[#ff4655] outline-none"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className="text-gray-300 text-sm">
                    Host Invite Code
                  </label>
                  <input
                    type="text"
                    {...register("inviteCode", {
                      required: "Invite code is required",
                    })}
                    placeholder="Enter authorized code"
                    className="w-full bg-[#0f1923] rounded-lg px-4 py-2 border border-gray-700 focus:border-[#ff4655] outline-none"
                  />
                  {errors.inviteCode && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.inviteCode.message}
                    </p>
                  )}
                </div> */}
              </>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #ff4655" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="mt-3 bg-[#ff4655] text-white font-bold py-2 rounded-lg uppercase tracking-wide transition-all"
            >
              {isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            {isLogin ? (
              <>
                New Host?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#ff4655] hover:underline"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#ff4655] hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </motion.div>
      </main>
      <footer className="text-gray-500 text-xs text-center py-4">
        Authorized Host Portal © 2025 Valorant eSports
      </footer>
    </div>
  );
}
