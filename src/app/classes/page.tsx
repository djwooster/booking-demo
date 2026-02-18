'use client'

import { useState, useMemo } from 'react'
import { format, parseISO, isToday, isTomorrow, isSameDay } from 'date-fns'
import { toast } from 'sonner'
import {
  Calendar, Clock, Users, Filter, Search, LayoutList, LayoutGrid,
  ChevronRight, Info, AlertCircle, CheckCircle2, ListFilter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { mockClasses, mockInstructors } from '@/lib/mock-data'
import {
  formatDate, formatTime, getSpotsLabel, getSpotsColor,
  getCategoryEmoji, getDifficultyColor, canCancelBooking, cn
} from '@/lib/utils'
import { sendBookingConfirmation } from '@/lib/resend'
import type { Schedule } from '@/types'
import Link from 'next/link'

type ViewMode = 'list' | 'grid'
type FilterCategory = 'all' | string

function ClassCard({ schedule, onBook, isBooked, isWaitlisted, viewMode }: {
  schedule: Schedule
  onBook: (schedule: Schedule) => void
  isBooked: boolean
  isWaitlisted: boolean
  viewMode: ViewMode
}) {
  const cls = schedule.class!
  const instructor = schedule.instructor!
  const available = schedule.availableSpots ?? 0
  const isFull = available <= 0
  const spotsColor = getSpotsColor(available)

  const startDate = parseISO(schedule.startTime)
  const dayLabel = isToday(startDate) ? 'Today' : isTomorrow(startDate) ? 'Tomorrow' : format(startDate, 'EEE, MMM d')

  if (viewMode === 'list') {
    return (
      <div className={cn(
        'flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-stone-900 transition-all hover:shadow-md',
        isBooked ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : 'border-stone-200 dark:border-stone-800',
        schedule.status === 'cancelled' && 'opacity-60'
      )}>
        {/* Color strip */}
        <div className={`hidden sm:flex h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${cls.color} items-center justify-center text-2xl`}>
          {getCategoryEmoji(cls.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">{cls.name}</h3>
            {isBooked && <Badge variant="default" className="text-xs">Booked</Badge>}
            {isWaitlisted && <Badge variant="warning" className="text-xs">Waitlisted</Badge>}
            {schedule.status === 'cancelled' && <Badge variant="destructive" className="text-xs">Cancelled</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dayLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(schedule.startTime)} · {cls.duration}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className={spotsColor + ' font-medium'}>
                {isFull ? 'Full' : getSpotsLabel(available, cls.capacity)}
              </span>
            </span>
            <span className="text-stone-400 dark:text-stone-500">
              {instructor.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`hidden md:inline text-xs font-medium rounded-full px-2.5 py-0.5 ${getDifficultyColor(cls.difficulty)}`}>
            {cls.difficulty}
          </span>
          {isBooked ? (
            <Button variant="outline" size="sm" className="text-green-600 border-green-300 dark:border-green-700" disabled>
              <CheckCircle2 className="h-4 w-4" /> Booked
            </Button>
          ) : isWaitlisted ? (
            <Button variant="outline" size="sm" disabled>On waitlist</Button>
          ) : isFull ? (
            <Button variant="outline" size="sm" onClick={() => onBook(schedule)}>
              Join waitlist
            </Button>
          ) : schedule.status === 'cancelled' ? (
            <Button variant="outline" size="sm" disabled>Cancelled</Button>
          ) : (
            <Button size="sm" onClick={() => onBook(schedule)}>
              Book now
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden bg-white dark:bg-stone-900 transition-all hover:shadow-lg hover:-translate-y-0.5',
      isBooked ? 'border-green-300 dark:border-green-800' : 'border-stone-200 dark:border-stone-800',
      schedule.status === 'cancelled' && 'opacity-60'
    )}>
      <div className={`h-32 bg-gradient-to-br ${cls.color} flex items-center justify-center relative`}>
        <span className="text-4xl">{getCategoryEmoji(cls.category)}</span>
        {isBooked && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 rounded-full px-2 py-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Booked</span>
          </div>
        )}
        {isWaitlisted && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 rounded-full px-2 py-1">
            <span className="text-xs font-medium text-amber-600">Waitlisted</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">{cls.name}</h3>
          <span className={`shrink-0 text-xs font-medium rounded-full px-2 py-0.5 ${getDifficultyColor(cls.difficulty)}`}>
            {cls.difficulty}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-stone-500 dark:text-stone-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dayLabel} · {formatTime(schedule.startTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{cls.duration} min · {instructor.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className={`font-medium ${spotsColor}`}>
              {isFull ? 'Full — Waitlist available' : getSpotsLabel(available, cls.capacity)}
            </span>
          </div>
        </div>

        {isBooked ? (
          <Button variant="outline" className="w-full text-green-600 border-green-300 dark:border-green-700" disabled>
            <CheckCircle2 className="h-4 w-4" /> Booked
          </Button>
        ) : isWaitlisted ? (
          <Button variant="outline" className="w-full" disabled>On waitlist</Button>
        ) : isFull ? (
          <Button variant="outline" className="w-full" onClick={() => onBook(schedule)}>
            Join waitlist
          </Button>
        ) : schedule.status === 'cancelled' ? (
          <Button variant="outline" className="w-full" disabled>Cancelled</Button>
        ) : (
          <Button className="w-full" onClick={() => onBook(schedule)}>Book class</Button>
        )}
      </div>
    </div>
  )
}

export default function ClassesPage() {
  const { user, isAuthenticated, schedules, bookings, userMembership, bookClass } = useAppStore()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Filter active schedules
  const activeSchedules = useMemo(() =>
    schedules
      .filter(s => s.status === 'active')
      .filter(s => new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [schedules]
  )

  // Apply filters
  const filtered = useMemo(() => {
    return activeSchedules.filter(s => {
      const cls = s.class!
      if (categoryFilter !== 'all' && cls.category !== categoryFilter) return false
      if (instructorFilter !== 'all' && s.instructorId !== instructorFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!cls.name.toLowerCase().includes(q) && !s.instructor?.name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activeSchedules, categoryFilter, instructorFilter, search])

  // Group by day
  const byDay = useMemo(() => {
    const map = new Map<string, Schedule[]>()
    filtered.forEach(s => {
      const day = format(parseISO(s.startTime), 'yyyy-MM-dd')
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(s)
    })
    return Array.from(map.entries()).map(([day, items]) => ({ day, items }))
  }, [filtered])

  const userBookedIds = new Set(
    bookings.filter(b => b.status === 'confirmed').map(b => b.scheduleId)
  )
  const userWaitlistIds = new Set(
    bookings.filter(b => b.status === 'waitlist').map(b => b.scheduleId)
  )

  const handleBookClick = (schedule: Schedule) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a class', {
        action: { label: 'Sign in', onClick: () => window.location.href = '/login' }
      })
      return
    }
    setSelectedSchedule(schedule)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSchedule || !user) return
    setBookingLoading(true)
    const result = await bookClass(selectedSchedule.id)
    setBookingLoading(false)

    if (result.success) {
      if (result.onWaitlist) {
        toast.info('Added to waitlist! We\'ll notify you if a spot opens up.')
      } else {
        toast.success(`Booked! See you in ${selectedSchedule.class?.name} 🎉`)
        await sendBookingConfirmation(
          user.email,
          user.name,
          selectedSchedule.class?.name ?? '',
          formatDate(selectedSchedule.startTime),
          selectedSchedule.instructor?.name ?? ''
        )
        toast.info('Confirmation email sent', { duration: 2000 })
      }
    } else {
      toast.error(result.error ?? 'Could not complete booking')
    }
    setSelectedSchedule(null)
  }

  const selectedIsFull = selectedSchedule ? (selectedSchedule.availableSpots ?? 0) <= 0 : false
  const creditsRemaining = userMembership?.plan?.type === 'pack' ? userMembership.creditsRemaining : null

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Class Schedule</h1>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                {filtered.length} classes available · Book up to 14 days ahead
              </p>
            </div>

            {/* Membership badge */}
            {userMembership?.status === 'active' && (
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">{userMembership.plan?.name}</p>
                  {creditsRemaining !== null && (
                    <p className="text-xs text-green-600 dark:text-green-500">{creditsRemaining} credits remaining</p>
                  )}
                  {userMembership.plan?.type === 'unlimited' && (
                    <p className="text-xs text-green-600 dark:text-green-500">Unlimited access</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search classes or instructors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <ListFilter className="h-4 w-4 mr-1 text-stone-400" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {['yoga', 'hiit', 'spin', 'pilates', 'boxing', 'barre', 'strength', 'dance', 'meditation'].map(c => (
                  <SelectItem key={c} value={c}>
                    {getCategoryEmoji(c)} {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={instructorFilter} onValueChange={setInstructorFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All instructors</SelectItem>
                {mockInstructors.map(i => (
                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-1 border border-stone-200 dark:border-stone-700 rounded-lg p-1 bg-white dark:bg-stone-900">
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 rounded-md transition-colors', viewMode === 'list' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-stone-400 hover:text-stone-600')}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 rounded-md transition-colors', viewMode === 'grid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-stone-400 hover:text-stone-600')}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <Link href="/login" className="font-semibold underline">Sign in</Link>
              {' '}or{' '}
              <Link href="/signup" className="font-semibold underline">create a free account</Link>
              {' '}to book classes.
            </p>
          </div>
        )}

        {byDay.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">No classes found</h3>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Try adjusting your filters</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setCategoryFilter('all'); setInstructorFilter('all') }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {byDay.map(({ day, items }) => {
              const date = parseISO(day)
              const dayLabel = isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'EEEE, MMMM d')
              return (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{dayLabel}</h2>
                    <span className="text-sm text-stone-400">{format(date, 'MMM d')}</span>
                    <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                    <span className="text-xs text-stone-400">{items.length} classes</span>
                  </div>

                  {viewMode === 'list' ? (
                    <div className="space-y-3">
                      {items.map(s => (
                        <ClassCard
                          key={s.id}
                          schedule={s}
                          onBook={handleBookClick}
                          isBooked={userBookedIds.has(s.id)}
                          isWaitlisted={userWaitlistIds.has(s.id)}
                          viewMode="list"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map(s => (
                        <ClassCard
                          key={s.id}
                          schedule={s}
                          onBook={handleBookClick}
                          isBooked={userBookedIds.has(s.id)}
                          isWaitlisted={userWaitlistIds.has(s.id)}
                          viewMode="grid"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="max-w-md">
          {selectedSchedule && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedIsFull ? 'Join Waitlist' : 'Confirm Booking'}</DialogTitle>
                <DialogDescription>
                  {selectedIsFull
                    ? "This class is full. We'll notify you if a spot opens up."
                    : 'Review the details below and confirm your booking.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Class summary */}
                <div className={`rounded-xl p-4 bg-gradient-to-br ${selectedSchedule.class?.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryEmoji(selectedSchedule.class?.category ?? '')}</span>
                    <div>
                      <h3 className="font-bold text-lg">{selectedSchedule.class?.name}</h3>
                      <p className="text-white/80 text-sm">{selectedSchedule.class?.duration} min · {selectedSchedule.class?.difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <Calendar className="h-4 w-4 text-stone-400 shrink-0" />
                    <span>{formatDate(selectedSchedule.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <Users className="h-4 w-4 text-stone-400 shrink-0" />
                    <span>
                      Instructor: <span className="font-medium">{selectedSchedule.instructor?.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <Users className="h-4 w-4 text-stone-400 shrink-0" />
                    <span className={getSpotsColor(selectedSchedule.availableSpots ?? 0) + ' font-medium'}>
                      {selectedIsFull
                        ? `Full · ${selectedSchedule.waitlistCount} on waitlist`
                        : getSpotsLabel(selectedSchedule.availableSpots ?? 0, selectedSchedule.class?.capacity ?? 20)}
                    </span>
                  </div>
                </div>

                {/* Payment info */}
                {userMembership?.status === 'active' ? (
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          {userMembership.plan?.type === 'unlimited'
                            ? 'Covered by Unlimited membership'
                            : `Using 1 credit (${creditsRemaining} remaining)`}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">No charge today</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600 dark:text-stone-400">Drop-in rate</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">$20.00</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Save with a{' '}
                      <Link href="/memberships" className="text-green-600 underline dark:text-green-400" onClick={() => setSelectedSchedule(null)}>
                        membership plan
                      </Link>
                    </p>
                  </div>
                )}

                {/* Cancellation policy */}
                <div className="flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>Free cancellation up to 2 hours before class. Late cancellations forfeit the credit/fee.</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedSchedule(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  loading={bookingLoading}
                  variant={selectedIsFull ? 'teal' : 'default'}
                >
                  {selectedIsFull ? 'Join waitlist' : 'Confirm booking'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
