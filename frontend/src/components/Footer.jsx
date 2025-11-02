import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f14] text-gray-300 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-[#ff4655] transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 0 1 1.77 1.02 4.92 4.92 0 0 1 1.02 1.77c.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.92 4.92 0 0 1-1.02 1.77 4.92 4.92 0 0 1-1.77 1.02c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.92 4.92 0 0 1-1.77-1.02 4.92 4.92 0 0 1-1.02-1.77c-.164-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.92 4.92 0 0 1 1.02-1.77 4.92 4.92 0 0 1 1.77-1.02c.46-.164 1.26-.35 2.43-.403C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.74 0 8.332.013 7.052.072 5.77.131 4.802.36 4.042.67a6.99 6.99 0 0 0-2.57 1.66A6.99 6.99 0 0 0 .67 4.042C.36 4.802.131 5.77.072 7.052.013 8.332 0 8.74 0 12s.013 3.668.072 4.948c.059 1.282.288 2.25.598 3.01.33.8.774 1.484 1.66 2.37a6.99 6.99 0 0 0 2.37 1.66c.76.31 1.728.539 3.01.598C8.332 23.987 8.74 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.25-.288 3.01-.598a6.99 6.99 0 0 0 2.37-1.66 6.99 6.99 0 0 0 1.66-2.37c.31-.76.539-1.728.598-3.01C23.987 15.668 24 15.26 24 12s-.013-3.668-.072-4.948c-.059-1.282-.288-2.25-.598-3.01a6.99 6.99 0 0 0-1.66-2.37 6.99 6.99 0 0 0-2.37-1.66c-.76-.31-1.728-.539-3.01-.598C15.668.013 15.26 0 12 0z" />
                <path d="M12 5.838A6.162 6.162 0 1 0 18.162 12 6.169 6.169 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 16 12a3.999 3.999 0 0 1-4 4z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff4655] transition-colors" aria-label="Snapchat">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.243 2 7 4.243 7 7v.07c-1.15.165-2.213.662-3.057 1.36C2.293 9.708 2 10.293 2 11v1c0 .707.293 1.292 1.943 2.57C5.019 15.866 6 16.6 6 18c0 2.761 2.239 5 5 5s5-2.239 5-5c0-1.4.981-2.134 2.057-3.43C21.707 13.292 22 12.707 22 12v-1c0-.707-.293-1.292-1.943-2.57C18.981 7.866 18 7.13 18 5.999V7c0-2.757-2.243-5-5-5z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff4655] transition-colors" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0 0 16.616 3c-2.716 0-4.92 2.206-4.92 4.917 0 .386.045.762.127 1.124C7.728 8.77 4.1 6.797 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c.001 1.997 1.397 3.872 3.448 4.292A4.936 4.936 0 0 1 2 14.307c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.009-7.513 14.009-14.009v-.636A9.935 9.935 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#ff4655] transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8.08v-2.88h2.42V9.41c0-2.39 1.43-3.71 3.61-3.71 1.05 0 2.15.19 2.15.19v2.36h-1.21c-1.2 0-1.57.74-1.57 1.5v1.8h2.67l-.43 2.88h-2.24v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>
          </div>

          {/* Inline Links */}
          <ul className="flex flex-wrap justify-center gap-4 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-[#ff4655]">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-[#ff4655]">About</Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-400 hover:text-[#ff4655]">Terms</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-[#ff4655]">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/access/hp-portal" className="text-gray-400 hover:text-[#ff4655]">Tournament Orgraniser?</Link>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-[#ffffff0a] pt-4">
          <p className="text-center text-xs text-gray-500">Company Name © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
