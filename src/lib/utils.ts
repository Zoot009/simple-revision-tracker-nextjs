import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency (USD)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a time string from HH:MM to human readable format
 * @param timeString - Time in HH:MM format (e.g., "09:30")
 * @returns Formatted time string (e.g., "9:30 AM")
 */
export function formatTime(timeString: string): string {
  if (!timeString || !timeString.includes(':')) {
    return timeString
  }

  const [hours, minutes] = timeString.split(':').map(Number)
  
  // Create a date object with the time
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  
  // Format using Intl.DateTimeFormat
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Get relative time from now
 * @param date - The date to compare
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (Math.abs(diffInDays) >= 1) {
    return `${diffInDays > 0 ? 'in' : ''} ${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''} ${diffInDays < 0 ? 'ago' : ''}`
  } else if (Math.abs(diffInHours) >= 1) {
    return `${diffInHours > 0 ? 'in' : ''} ${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''} ${diffInHours < 0 ? 'ago' : ''}`
  } else if (Math.abs(diffInMinutes) >= 1) {
    return `${diffInMinutes > 0 ? 'in' : ''} ${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''} ${diffInMinutes < 0 ? 'ago' : ''}`
  } else {
    return 'just now'
  }
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}