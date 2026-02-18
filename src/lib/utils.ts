import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, parseISO, differenceInHours } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`
  return format(date, 'EEE, MMM d • h:mm a')
}

export function formatShortDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d')
}

export function formatTime(dateString: string): string {
  return format(parseISO(dateString), 'h:mm a')
}

export function formatDayDate(dateString: string): string {
  return format(parseISO(dateString), 'EEEE, MMMM d')
}

export function canCancelBooking(startTime: string): boolean {
  const hoursUntilClass = differenceInHours(parseISO(startTime), new Date())
  return hoursUntilClass >= 2
}

export function getSpotsLabel(available: number, capacity: number): string {
  if (available === 0) return 'Full'
  if (available === 1) return '1 spot left'
  if (available <= 3) return `${available} spots left`
  return `${available} of ${capacity} spots`
}

export function getSpotsColor(available: number): string {
  if (available === 0) return 'text-red-600'
  if (available <= 3) return 'text-amber-600'
  return 'text-green-600'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    yoga: '🧘',
    hiit: '⚡',
    spin: '🚴',
    pilates: '🤸',
    boxing: '🥊',
    barre: '🩰',
    strength: '💪',
    dance: '💃',
    meditation: '🌿',
  }
  return map[category] || '🏋️'
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'all-levels': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[difficulty] || 'bg-stone-100 text-stone-700'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
