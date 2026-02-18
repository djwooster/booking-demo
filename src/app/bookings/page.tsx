'use client'

import { useState } from 'react'
import Link from 'next/link'
import { parseISO, isPast } from 'date-fns'
import { toast } from 'sonner'
import {
  Calendar, Clock, Users, CheckCircle2, XCircle, AlertCircle,
  ArrowRight, Clock3, Hourglass
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'
import {
  formatDate, canCancelBooking, getCategoryEmoji, getSpotsColor, cn
} from '@/lib/utils'
import { sendCancellationEmail } from '@/lib/resend'
import type { Booking } from '@/types'

export default function BookingsPage() {
  const { user, isAuthenticated, bookings, cancelBooking } = useAppStore()
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">View your bookings</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6">Sign in to see your upcoming and past classes.</p>
          <Button asChild>
            <Link href="/login">Sign in <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  const upcoming = bookings.filter(b =>
    b.status === 'confirmed' && b.schedule && !isPast(parseISO(b.schedule.startTime))
  )
  const waitlisted = bookings.filter(b => b.status === 'waitlist')
  const past = bookings.filter(b =>
    (b.status === 'confirmed' && b.schedule && isPast(parseISO(b.schedule.startTime))) ||
    b.status === 'cancelled' ||
    b.status === 'attended'
  )

  const handleCancel = async () => {
    if (!cancelTarget || !user) return
    setCancelLoading(true)
    const result = await cancelBooking(cancelTarget.id)
    setCancelLoading(false)

    if (result.success) {
      toast.success('Booking cancelled')
      await sendCancellationEmail(
        user.email,
        user.name,
        cancelTarget.schedule?.class?.name ?? '',
        cancelTarget.schedule ? formatDate(cancelTarget.schedule.startTime) : ''
      )
    } else {
      toast.error(result.error ?? 'Could not cancel booking')
    }
    setCancelTarget(null)
  }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const schedule = booking.schedule
    if (!schedule?.class) return null
    const cls = schedule.class
    const instructor = schedule.instructor
    const startTime = parseISO(schedule.startTime)
    const isUpcoming = !isPast(startTime) && booking.status === 'confirmed'
    const canCancel = isUpcoming && canCancelBooking(schedule.startTime)

    return (
      <div className={cn(
        'flex gap-4 p-4 rounded-xl border bg-white dark:bg-stone-900 transition-all',
        booking.status === 'cancelled' ? 'opacity-60 border-stone-200 dark:border-stone-800' :
        booking.status === 'waitlist' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10' :
        isUpcoming ? 'border-green-200 dark:border-green-800' : 'border-stone-200 dark:border-stone-800'
      )}>
        {/* Icon */}
        <div className={`hidden sm:flex h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${cls.color} items-center justify-center text-2xl`}>
          {getCategoryEmoji(cls.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">{cls.name}</h3>
            {booking.status === 'confirmed' && isUpcoming && (
              <Badge variant="default" className="text-xs">Upcoming</Badge>
            )}
            {booking.status === 'waitlist' && (
              <Badge variant="warning" className="text-xs">Waitlisted</Badge>
            )}
            {booking.status === 'cancelled' && (
              <Badge variant="destructive" className="text-xs">Cancelled</Badge>
            )}
            {booking.status === 'confirmed' && !isUpcoming && (
              <Badge variant="secondary" className="text-xs">Attended</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(schedule.startTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {cls.duration} min
            </span>
            {instructor && (
              <span className="text-stone-400 dark:text-stone-500">{instructor.name}</span>
            )}
          </div>

          {!canCancel && isUpcoming && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              Cancellation window has passed (within 2 hours of class)
            </p>
          )}
          {booking.status === 'waitlist' && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Hourglass className="h-3 w-3" />
              You&apos;ll be notified if a spot opens up
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col items-end justify-between gap-2">
          {isUpcoming && canCancel ? (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              onClick={() => setCancelTarget(booking)}
            >
              <XCircle className="h-4 w-4" /> Cancel
            </Button>
          ) : !isUpcoming && booking.status !== 'cancelled' ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/classes">
                Book again <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  const EmptyState = ({ icon: Icon, message, action }: {
    icon: React.ElementType
    message: string
    action?: React.ReactNode
  }) => (
    <div className="text-center py-16">
      <div className="h-14 w-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-7 w-7 text-stone-400" />
      </div>
      <p className="text-stone-500 dark:text-stone-400 mb-4">{message}</p>
      {action}
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">My Bookings</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {upcoming.length} upcoming · {waitlisted.length} waitlisted
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcoming.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full px-1.5 py-0.5">
                  {upcoming.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="waitlist">
              Waitlist
              {waitlisted.length > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-full px-1.5 py-0.5">
                  {waitlisted.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={Calendar}
                message="No upcoming classes booked."
                action={
                  <Button asChild>
                    <Link href="/classes">Browse classes <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="waitlist">
            {waitlisted.length === 0 ? (
              <EmptyState
                icon={Hourglass}
                message="You're not on any waitlists."
              />
            ) : (
              <div className="space-y-3">
                {waitlisted.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                message="No past bookings yet."
                action={
                  <Button variant="outline" asChild>
                    <Link href="/classes">Book your first class</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {past.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel confirmation dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel booking?</DialogTitle>
            <DialogDescription>
              {cancelTarget?.schedule?.class?.name} on {cancelTarget?.schedule ? formatDate(cancelTarget.schedule.startTime) : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Cancelling will forfeit your credit or drop-in fee if within 2 hours of the class.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Keep booking
            </Button>
            <Button variant="destructive" onClick={handleCancel} loading={cancelLoading}>
              Yes, cancel it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
