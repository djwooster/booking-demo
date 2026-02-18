export type UserRole = 'customer' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: string
}

export interface Instructor {
  id: string
  name: string
  bio: string
  specialties: string[]
  image: string
  rating: number
  classCount: number
}

export type ClassCategory = 'yoga' | 'hiit' | 'spin' | 'pilates' | 'boxing' | 'barre' | 'strength' | 'dance' | 'meditation'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all-levels'

export interface FitnessClass {
  id: string
  name: string
  description: string
  category: ClassCategory
  duration: number
  capacity: number
  difficulty: Difficulty
  image: string
  instructorId: string
  color: string
}

export interface Schedule {
  id: string
  classId: string
  instructorId: string
  startTime: string
  endTime: string
  status: 'active' | 'cancelled'
  bookedCount: number
  waitlistCount: number
  class?: FitnessClass
  instructor?: Instructor
  availableSpots?: number
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlist' | 'attended'

export interface Booking {
  id: string
  userId: string
  scheduleId: string
  status: BookingStatus
  bookedAt: string
  cancelledAt?: string
  schedule?: Schedule
}

export type MembershipType = 'dropin' | 'pack' | 'unlimited'

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  type: MembershipType
  credits?: number
  durationDays?: number
  features: string[]
  popular?: boolean
  color: string
}

export interface UserMembership {
  id: string
  userId: string
  planId: string
  plan?: MembershipPlan
  status: 'active' | 'expired' | 'cancelled'
  startDate: string
  endDate?: string
  creditsRemaining?: number
  creditsUsed?: number
}

export interface BookingResult {
  success: boolean
  booking?: Booking
  error?: string
  onWaitlist?: boolean
}

export interface DashboardMetrics {
  bookingsToday: number
  bookingsThisWeek: number
  revenueThisMonth: number
  activeMembers: number
  upcomingClasses: number
  averageCapacity: number
  popularClass: string
  newMembersThisWeek: number
}
