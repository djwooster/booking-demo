'use client'

import { useState } from 'react'
import Link from 'next/link'
import { isPast, parseISO, format } from 'date-fns'
import { toast } from 'sonner'
import {
  User, Mail, Phone, Calendar, CheckCircle2, CreditCard,
  Edit3, Save, ArrowRight, Award, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/lib/store'
import { getCategoryEmoji, formatDate, formatCurrency } from '@/lib/utils'

export default function ProfilePage() {
  const { user, isAuthenticated, bookings, userMembership, updateProfile } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [saving, setSaving] = useState(false)

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">Sign in to view your profile</h2>
          <Button asChild>
            <Link href="/login">Sign in <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const upcomingCount = confirmedBookings.filter(b => b.schedule && !isPast(parseISO(b.schedule.startTime))).length
  const attendedCount = confirmedBookings.filter(b => b.schedule && isPast(parseISO(b.schedule.startTime))).length

  const recentBookings = [...bookings]
    .filter(b => b.schedule)
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .slice(0, 5)

  // Favorite class type (most booked)
  const categoryCounts = bookings
    .filter(b => b.schedule?.class)
    .reduce<Record<string, number>>((acc, b) => {
      const cat = b.schedule!.class!.category
      acc[cat] = (acc[cat] ?? 0) + 1
      return acc
    }, {})
  const favoriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateProfile({ name: formData.name, phone: formData.phone })
    setSaving(false)
    setEditing(false)
    toast.success('Profile updated')
  }

  const stats = [
    { label: 'Upcoming classes', value: upcomingCount, icon: Calendar, color: 'text-green-600 dark:text-green-400' },
    { label: 'Classes attended', value: attendedCount, icon: CheckCircle2, color: 'text-teal-600 dark:text-teal-400' },
    { label: 'Total bookings', value: bookings.length, icon: BarChart3, color: 'text-blue-600 dark:text-blue-400' },
  ]

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 to-green-900 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-white/20">
              <AvatarFallback className="text-2xl font-bold bg-green-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-stone-300">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                  {user.role === 'admin' ? '⚙ Admin' : '👤 Member'}
                </Badge>
                <span className="text-xs text-stone-400">
                  Joined {format(parseISO(user.createdAt), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(stat => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal information</CardTitle>
                {!editing ? (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Edit3 className="h-4 w-4" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSave} loading={saving}>
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  {editing ? (
                    <Input
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                      <User className="h-4 w-4 text-stone-400" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Mail className="h-4 w-4 text-stone-400" />
                    <span>{user.email}</span>
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Phone number</Label>
                  {editing ? (
                    <Input
                      value={formData.phone}
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                      <Phone className="h-4 w-4 text-stone-400" />
                      <span>{user.phone ?? 'Not set'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent bookings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/bookings">View all <ArrowRight className="h-3 w-3" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-stone-400 text-sm mb-3">No bookings yet</p>
                    <Button size="sm" asChild>
                      <Link href="/classes">Book a class</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map(booking => (
                      <div key={booking.id} className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${booking.schedule?.class?.color ?? 'from-stone-400 to-stone-500'} flex items-center justify-center text-lg shrink-0`}>
                          {getCategoryEmoji(booking.schedule?.class?.category ?? '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                            {booking.schedule?.class?.name}
                          </p>
                          <p className="text-xs text-stone-400">
                            {booking.schedule ? formatDate(booking.schedule.startTime) : ''}
                          </p>
                        </div>
                        <Badge
                          variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'warning'}
                          className="text-xs shrink-0"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Membership */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userMembership?.status === 'active' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {userMembership.plan?.name}
                      </span>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>

                    {userMembership.plan?.type === 'pack' && (
                      <div>
                        <div className="flex justify-between text-xs text-stone-500 mb-1">
                          <span>Credits</span>
                          <span>{userMembership.creditsRemaining}/{userMembership.plan.credits}</span>
                        </div>
                        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${((userMembership.creditsRemaining ?? 0) / (userMembership.plan.credits ?? 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {userMembership.endDate && (
                      <p className="text-xs text-stone-400">
                        {userMembership.plan?.type === 'unlimited' ? 'Renews' : 'Valid until'}{' '}
                        {format(parseISO(userMembership.endDate), 'MMM d, yyyy')}
                      </p>
                    )}

                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/memberships">Manage plan</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">No active membership</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/memberships">View plans <ArrowRight className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'First class', earned: bookings.length > 0, emoji: '🎯' },
                  { label: 'Five classes', earned: bookings.length >= 5, emoji: '⭐' },
                  { label: 'Favorite class', earned: !!favoriteCategory, emoji: getCategoryEmoji(favoriteCategory ?? ''), detail: favoriteCategory },
                  { label: 'Member', earned: !!userMembership, emoji: '💳' },
                ].map(a => (
                  <div key={a.label} className={`flex items-center gap-3 ${a.earned ? '' : 'opacity-40'}`}>
                    <span className="text-xl">{a.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{a.label}</p>
                      {a.detail && <p className="text-xs text-stone-400 capitalize">{a.detail}</p>}
                    </div>
                    {a.earned && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
