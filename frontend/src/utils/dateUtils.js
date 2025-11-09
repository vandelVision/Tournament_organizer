/**
 * Date and Time Utility Functions
 * All dates and times are displayed in IST (Indian Standard Time) timezone
 * Format: DD/MM/YYYY for dates and h:mm AM/PM IST for times
 */

import { differenceInSeconds } from 'date-fns';

/**
 * Format date in DD/MM/YYYY format in IST timezone
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string (e.g., "15/12/2025")
 */
export const formatDateIST = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  };
  return date.toLocaleDateString('en-GB', options);
};

/**
 * Format time in h:mm AM/PM IST format in IST timezone
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted time string (e.g., "6:00 PM IST")
 */
export const formatTimeIST = (dateString) => {
  const date = new Date(dateString);
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };
  return date.toLocaleTimeString('en-US', options) + ' IST';
};

/**
 * Format date and time together in IST timezone
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date and time string (e.g., "15/12/2025 6:00 PM IST")
 */
export const formatDateTimeIST = (dateString) => {
  return `${formatDateIST(dateString)} ${formatTimeIST(dateString)}`;
};

/**
 * Format countdown time left until a tournament starts
 * Shows seconds only when less than 1 hour remains
 * @param {string|Date} date - The tournament start date
 * @returns {string} Formatted countdown string (e.g., "18d 5h 23m" or "23m 45s")
 */
export const formatTimeLeft = (date) => {
  const totalSeconds = differenceInSeconds(new Date(date), new Date());
  if (totalSeconds <= 0) return "Live Now";

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Show seconds only when less than 1 hour remains
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
};
