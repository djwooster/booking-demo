'use client'

import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { Search, Filter, Download, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { mockAllBookings } from '@/lib/mock-data'
import { getCategoryEmoji } from '@/lib/utils'

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return mockAllBookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return b.schedule?.class?.name.toLowerCase().includes(q) ||
          b.schedule?.instructor?.name.toLowerCase().includes(q)
      }
      return true
    })
  }, [search, statusFilter])

  const stats = {
    total: mockAllBookings.length,
    confirmed: mockAllBookings.filter(b => b.status === 'confirmed').length,
    cancelled: mockAllBookings.filter(b => b.status === 'cancelled').length,
    waitlist: mockAllBookings.filter(b => (b.status as string) === 'waitlist').length,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Bookings</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {stats.total} total · {stats.confirmed} confirmed · {stats.cancelled} cancelled
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300' },
          { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
          { label: 'Waitlisted', value: stats.waitlist, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color.split(' ').slice(1).join(' ')}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <Filter className="h-4 w-4 mr-1 text-stone-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="waitlist">Waitlist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Class</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden md:table-cell">Instructor</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden lg:table-cell">Booked at</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryEmoji(b.schedule?.class?.category ?? '')}</span>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">{b.schedule?.class?.name ?? '—'}</p>
                        <p className="text-xs text-stone-400 sm:hidden">
                          {b.schedule ? format(parseISO(b.schedule.startTime), 'MMM d, h:mma') : '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 dark:text-stone-400 hidden sm:table-cell">
                    {b.schedule ? format(parseISO(b.schedule.startTime), 'EEE, MMM d · h:mm a') : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-stone-500 dark:text-stone-400 hidden md:table-cell">
                    {b.schedule?.instructor?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-stone-400 hidden lg:table-cell">
                    {format(parseISO(b.bookedAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {(b.status as string) === 'confirmed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {(b.status as string) === 'cancelled' && <XCircle className="h-4 w-4 text-red-500" />}
                      {(b.status as string) === 'waitlist' && <Clock className="h-4 w-4 text-amber-500" />}
                      <Badge
                        variant={(b.status as string) === 'confirmed' ? 'default' : (b.status as string) === 'cancelled' ? 'destructive' : 'warning'}
                        className="text-xs"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-stone-400">
                    No bookings match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
