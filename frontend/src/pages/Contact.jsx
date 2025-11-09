import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { FaDiscord } from "react-icons/fa";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    platform: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    setForm({
      name: "",
      email: "",
      category: "",
      platform: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1923] text-white flex flex-col">
      <Navbar />
      <section className="flex flex-col lg:flex-row items-center justify-center flex-1 px-6 py-6 pt-28">
        {/* RIGHT FORM PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl bg-[#121418] rounded-2xl shadow-[0_0_25px_#ff4655] p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#ff4655] font-orbitron mb-4 text-center lg:text-left">
            Fill Out the Form
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base"
          >
            <div>
              <label htmlFor="name" className="block mb-1 text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Name"
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 outline-none border border-gray-700 focus:border-[#ff4655] transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 outline-none border border-gray-700 focus:border-[#ff4655] transition-all"
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-1 text-gray-300">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 border border-gray-700 focus:border-[#ff4655] outline-none transition-all"
              >
                <option value="">Select Category</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
                <option value="tournament">Tournament</option>
              </select>
            </div>

            <div>
              <label htmlFor="platform" className="block mb-1 text-gray-300">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 border border-gray-700 focus:border-[#ff4655] outline-none transition-all"
              >
                <option value="">Select Platform</option>
                <option value="pc">PC</option>
                <option value="console">Console</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="subject" className="block mb-1 text-gray-300">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 outline-none border border-gray-700 focus:border-[#ff4655] transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-1 text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Your Message"
                className="w-full bg-[#0f1923] rounded-md px-3 py-2 outline-none border border-gray-700 focus:border-[#ff4655] transition-all resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #ff4655" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="sm:col-span-2 mt-1 bg-[#ff4655] text-white font-bold py-2 rounded-md uppercase tracking-wide transition-all text-sm sm:text-base"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}