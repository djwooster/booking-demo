'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { isPast, isToday, parseISO, format } from 'date-fns'
import {
  BookOpen, Users, TrendingUp, Calendar, ArrowRight,
  ArrowUpRight, Dumbbell, Star, Clock, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { mockAllBookings, mockInstructors, revenueData, classTypeData } from '@/lib/mock-data'
import { getCategoryEmoji, formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDashboard() {
  const { user, isAuthenticated, schedules } = useAppStore()

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">Access denied</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6">Admin credentials required.</p>
          <Button asChild><Link href="/login">Sign in as admin</Link></Button>
        </div>
      </div>
    )
  }

  const todaySchedules = schedules.filter(s => s.status === 'active' && isToday(parseISO(s.startTime)))
  const todayBookings = mockAllBookings.filter(b =>
    b.status === 'confirmed' && b.schedule && isToday(parseISO(b.schedule.startTime))
  )
  const upcomingSchedules = schedules
    .filter(s => s.status === 'active' && !isPast(parseISO(s.startTime)))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 6)

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const avgCapacity = Math.round(
    schedules.reduce((s, sc) => s + (sc.bookedCount / (sc.class?.capacity ?? 20)) * 100, 0) / (schedules.length || 1)
  )

  const metrics = [
    {
      label: 'Bookings today',
      value: todayBookings.length,
      icon: BookOpen,
      change: '+12%',
      positive: true,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      label: 'Classes today',
      value: todaySchedules.length,
      icon: Calendar,
      change: 'scheduled',
      positive: true,
      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Revenue (7 days)',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      change: '+8.2%',
      positive: true,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Avg. capacity',
      value: `${avgCapacity}%`,
      icon: Users,
      change: avgCapacity >= 70 ? 'Great' : 'Growing',
      positive: avgCapacity >= 70,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/schedule">Add class</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/bookings">
              View bookings <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{m.label}</p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">{m.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs">
                <ArrowUpRight className={`h-3 w-3 ${m.positive ? 'text-green-500' : 'text-red-500'}`} />
                <span className={m.positive ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600'}>
                  {m.change}
                </span>
                <span className="text-stone-400">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bookings & Revenue</CardTitle>
              <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">Last 7 days</p>
            </div>
            <Badge variant="default">+8.2%</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v, n) => [n === 'revenue' ? formatCurrency(Number(v)) : v, n === 'revenue' ? 'Revenue' : 'Bookings'] as [string | number, string]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class type breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by class</CardTitle>
            <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">This week</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={classTypeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="bookings" radius={[0, 4, 4, 0]} fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming classes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/schedule">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedules.map(s => {
                const cls = s.class!
                const pct = Math.round((s.bookedCount / cls.capacity) * 100)
                const startDate = parseISO(s.startTime)
                const dayLabel = isToday(startDate) ? 'Today' : format(startDate, 'EEE')

                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${cls.color} flex items-center justify-center text-lg shrink-0`}>
                      {getCategoryEmoji(cls.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{cls.name}</p>
                        <span className="text-xs text-stone-400 shrink-0">{dayLabel} {format(startDate, 'h:mma')}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-stone-400 shrink-0">
                          {s.bookedCount}/{cls.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructors performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Instructor overview</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/instructors">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInstructors.slice(0, 5).map(inst => (
                <div key={inst.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={inst.image} alt={inst.name} />
                    <AvatarFallback>{inst.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{inst.name}</p>
                    <p className="text-xs text-stone-400">{inst.specialties.slice(0, 2).join(' · ')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{inst.rating}</span>
                    </div>
                    <p className="text-xs text-stone-400">{inst.classCount.toLocaleString()} classes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <th className="text-left pb-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Class</th>
                  <th className="text-left pb-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Time</th>
                  <th className="text-left pb-3 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Instructor</th>
                  <th className="text-left pb-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {mockAllBookings.slice(0, 6).map(b => (
                  <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getCategoryEmoji(b.schedule?.class?.category ?? '')}</span>
                        <span className="font-medium text-stone-900 dark:text-stone-100">{b.schedule?.class?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-stone-500 dark:text-stone-400">
                      {b.schedule ? format(parseISO(b.schedule.startTime), 'MMM d, h:mma') : '—'}
                    </td>
                    <td className="py-3 text-stone-500 dark:text-stone-400 hidden sm:table-cell">
                      {b.schedule?.instructor?.name}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={b.status === 'confirmed' ? 'default' : b.status === 'cancelled' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
