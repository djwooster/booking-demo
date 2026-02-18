'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Schedule, Booking, UserMembership, MembershipPlan } from '@/types'
import {
  mockAdminUser,
  mockCustomerUser,
  mockSchedules,
  mockUserBookings,
  mockUserMembership,
  mockMembershipPlans,
  MOCK_ADMIN_EMAIL,
  MOCK_ADMIN_PASSWORD,
  MOCK_USER_EMAIL,
  MOCK_USER_PASSWORD,
} from './mock-data'
import { generateId } from './utils'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean

  // Data
  schedules: Schedule[]
  bookings: Booking[]
  userMembership: UserMembership | null
  membershipPlans: MembershipPlan[]

  // Toast queue (managed externally via sonner)

  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void

  // Booking actions
  bookClass: (scheduleId: string) => Promise<{ success: boolean; onWaitlist?: boolean; error?: string }>
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>
  joinWaitlist: (scheduleId: string) => Promise<{ success: boolean; error?: string }>
  leaveWaitlist: (scheduleId: string) => Promise<{ success: boolean; error?: string }>

  // Membership actions
  purchaseMembership: (planId: string) => Promise<{ success: boolean; error?: string }>
  cancelMembership: () => Promise<{ success: boolean; error?: string }>

  // Admin: schedule management
  addSchedule: (schedule: Omit<Schedule, 'id' | 'bookedCount' | 'waitlistCount' | 'availableSpots'>) => void
  updateSchedule: (id: string, data: Partial<Schedule>) => void
  deleteSchedule: (id: string) => void
  cancelScheduledClass: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      schedules: mockSchedules,
      bookings: [],
      userMembership: null,
      membershipPlans: mockMembershipPlans,

      login: async (email, password) => {
        await new Promise(r => setTimeout(r, 800)) // simulate network

        if (email.toLowerCase() === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
          set({ user: mockAdminUser, isAuthenticated: true, bookings: [], userMembership: null })
          return { success: true }
        }
        if (email.toLowerCase() === MOCK_USER_EMAIL && password === MOCK_USER_PASSWORD) {
          set({
            user: mockCustomerUser,
            isAuthenticated: true,
            bookings: mockUserBookings as Booking[],
            userMembership: mockUserMembership,
          })
          return { success: true }
        }
        // Allow any email/password for demo
        if (email && password.length >= 6) {
          const demoUser: User = {
            id: generateId(),
            email,
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            role: 'customer',
            createdAt: new Date().toISOString(),
          }
          set({ user: demoUser, isAuthenticated: true, bookings: [], userMembership: null })
          return { success: true }
        }
        return { success: false, error: 'Password must be at least 6 characters' }
      },

      signup: async ({ email, name, password }) => {
        await new Promise(r => setTimeout(r, 1000))
        if (!email || !name || password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' }
        }
        const newUser: User = {
          id: generateId(),
          email,
          name,
          role: 'customer',
          createdAt: new Date().toISOString(),
        }
        set({ user: newUser, isAuthenticated: true, bookings: [], userMembership: null })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, bookings: [], userMembership: null })
      },

      updateProfile: (data) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...data } })
      },

      bookClass: async (scheduleId) => {
        await new Promise(r => setTimeout(r, 600))
        const { schedules, bookings, user, userMembership } = get()
        if (!user) return { success: false, error: 'Please log in to book a class' }

        const existing = bookings.find(b => b.scheduleId === scheduleId && b.status === 'confirmed')
        if (existing) return { success: false, error: 'You have already booked this class' }

        const schedule = schedules.find(s => s.id === scheduleId)
        if (!schedule) return { success: false, error: 'Class not found' }

        const available = (schedule.availableSpots ?? 0)

        if (available <= 0) {
          // Add to waitlist
          const waitlistBooking: Booking = {
            id: generateId(),
            userId: user.id,
            scheduleId,
            status: 'waitlist',
            bookedAt: new Date().toISOString(),
            schedule,
          }
          set({
            bookings: [...bookings, waitlistBooking],
            schedules: schedules.map(s =>
              s.id === scheduleId ? { ...s, waitlistCount: s.waitlistCount + 1 } : s
            ),
          })
          return { success: true, onWaitlist: true, booking: waitlistBooking }
        }

        // Deduct credit if pack membership
        if (userMembership?.plan?.type === 'pack' && (userMembership.creditsRemaining ?? 0) > 0) {
          set({
            userMembership: {
              ...userMembership,
              creditsRemaining: (userMembership.creditsRemaining ?? 0) - 1,
              creditsUsed: (userMembership.creditsUsed ?? 0) + 1,
            },
          })
        }

        const newBooking: Booking = {
          id: generateId(),
          userId: user.id,
          scheduleId,
          status: 'confirmed',
          bookedAt: new Date().toISOString(),
          schedule,
        }

        set({
          bookings: [...bookings, newBooking],
          schedules: schedules.map(s =>
            s.id === scheduleId
              ? { ...s, bookedCount: s.bookedCount + 1, availableSpots: available - 1 }
              : s
          ),
        })
        return { success: true, booking: newBooking }
      },

      cancelBooking: async (bookingId) => {
        await new Promise(r => setTimeout(r, 500))
        const { bookings, schedules } = get()
        const booking = bookings.find(b => b.id === bookingId)
        if (!booking) return { success: false, error: 'Booking not found' }

        set({
          bookings: bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } : b
          ),
          schedules: schedules.map(s =>
            s.id === booking.scheduleId
              ? {
                  ...s,
                  bookedCount: Math.max(0, s.bookedCount - 1),
                  availableSpots: (s.availableSpots ?? 0) + 1,
                }
              : s
          ),
        })
        return { success: true }
      },

      joinWaitlist: async (scheduleId) => {
        await new Promise(r => setTimeout(r, 500))
        const { schedules, bookings, user } = get()
        if (!user) return { success: false, error: 'Please log in' }
        const schedule = schedules.find(s => s.id === scheduleId)
        if (!schedule) return { success: false, error: 'Class not found' }

        const waitlistBooking: Booking = {
          id: generateId(),
          userId: user.id,
          scheduleId,
          status: 'waitlist',
          bookedAt: new Date().toISOString(),
          schedule,
        }
        set({
          bookings: [...bookings, waitlistBooking],
          schedules: schedules.map(s =>
            s.id === scheduleId ? { ...s, waitlistCount: s.waitlistCount + 1 } : s
          ),
        })
        return { success: true }
      },

      leaveWaitlist: async (scheduleId) => {
        await new Promise(r => setTimeout(r, 500))
        const { bookings, schedules } = get()
        const booking = bookings.find(b => b.scheduleId === scheduleId && b.status === 'waitlist')
        if (!booking) return { success: false, error: 'Not on waitlist' }
        set({
          bookings: bookings.filter(b => b.id !== booking.id),
          schedules: schedules.map(s =>
            s.id === scheduleId ? { ...s, waitlistCount: Math.max(0, s.waitlistCount - 1) } : s
          ),
        })
        return { success: true }
      },

      purchaseMembership: async (planId) => {
        await new Promise(r => setTimeout(r, 1200))
        const { user, membershipPlans } = get()
        if (!user) return { success: false, error: 'Please log in' }
        const plan = membershipPlans.find(p => p.id === planId)
        if (!plan) return { success: false, error: 'Plan not found' }

        const newMembership: UserMembership = {
          id: generateId(),
          userId: user.id,
          planId,
          plan,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: plan.durationDays
            ? new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
          creditsRemaining: plan.credits,
          creditsUsed: 0,
        }
        set({ userMembership: newMembership })
        return { success: true }
      },

      cancelMembership: async () => {
        await new Promise(r => setTimeout(r, 500))
        const { userMembership } = get()
        if (!userMembership) return { success: false, error: 'No active membership' }
        set({ userMembership: { ...userMembership, status: 'cancelled' } })
        return { success: true }
      },

      addSchedule: (scheduleData) => {
        const { schedules } = get()
        const classItem = scheduleData.class
        const newSchedule: Schedule = {
          ...scheduleData,
          id: generateId(),
          bookedCount: 0,
          waitlistCount: 0,
          availableSpots: classItem?.capacity ?? 20,
        }
        set({ schedules: [...schedules, newSchedule] })
      },

      updateSchedule: (id, data) => {
        set(state => ({
          schedules: state.schedules.map(s => s.id === id ? { ...s, ...data } : s),
        }))
      },

      deleteSchedule: (id) => {
        set(state => ({ schedules: state.schedules.filter(s => s.id !== id) }))
      },

      cancelScheduledClass: (id) => {
        set(state => ({
          schedules: state.schedules.map(s => s.id === id ? { ...s, status: 'cancelled' } : s),
        }))
      },
    }),
    {
      name: 'apex-studio-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        bookings: state.bookings,
        userMembership: state.userMembership,
      }),
    }
  )
)
