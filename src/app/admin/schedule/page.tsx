'use client'

import { useState, useMemo } from 'react'
import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { toast } from 'sonner'
import { Plus, Trash2, XCircle, Calendar, Clock, Users, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { mockClasses, mockInstructors } from '@/lib/mock-data'
import { getCategoryEmoji, formatDate, getSpotsLabel, getSpotsColor, cn } from '@/lib/utils'
import type { Schedule } from '@/types'

export default function AdminSchedulePage() {
  const { schedules, addSchedule, deleteSchedule, cancelScheduledClass } = useAppStore()

  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Schedule | null>(null)
  const [form, setForm] = useState({
    classId: '',
    instructorId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
  })

  const upcoming = useMemo(() =>
    schedules
      .filter(s => new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [schedules]
  )

  const filtered = upcoming.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.class?.name.toLowerCase().includes(q) || s.instructor?.name.toLowerCase().includes(q)
  })

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

  const handleCreate = () => {
    if (!form.classId || !form.instructorId || !form.date || !form.time) {
      toast.error('Please fill in all fields')
      return
    }

    const cls = mockClasses.find(c => c.id === form.classId)
    const instructor = mockInstructors.find(i => i.id === form.instructorId)
    if (!cls) return

    const startTime = new Date(`${form.date}T${form.time}:00`).toISOString()
    const endDate = new Date(new Date(`${form.date}T${form.time}:00`).getTime() + cls.duration * 60 * 1000)
    const endTime = endDate.toISOString()

    addSchedule({
      classId: form.classId,
      instructorId: form.instructorId,
      startTime,
      endTime,
      status: 'active',
      class: cls,
      instructor,
    })

    toast.success(`${cls.name} scheduled for ${format(new Date(`${form.date}T${form.time}`), 'EEE, MMM d at h:mm a')}`)
    setDialogOpen(false)
    setForm({ classId: '', instructorId: '', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00' })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteSchedule(deleteTarget.id)
    toast.success('Schedule removed')
    setDeleteTarget(null)
  }

  const handleCancel = () => {
    if (!cancelTarget) return
    cancelScheduledClass(cancelTarget.id)
    toast.success('Class cancelled. Enrolled members will be notified.')
    setCancelTarget(null)
  }

  const CapacityBar = ({ booked, capacity }: { booked: number; capacity: number }) => {
    const pct = Math.round((booked / capacity) * 100)
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-stone-400 w-12 text-right">{booked}/{capacity}</span>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Schedule</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {upcoming.length} upcoming classes · manage your timetable
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add class
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input placeholder="Search schedule..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Schedule by day */}
      <div className="space-y-8">
        {byDay.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400">No upcoming classes scheduled</p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>Add first class</Button>
          </div>
        ) : byDay.map(({ day, items }) => {
          const date = parseISO(day)
          const dayLabel = isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'EEEE, MMMM d')

          return (
            <div key={day}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{dayLabel}</h2>
                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                <span className="text-xs text-stone-400">{items.length} classes</span>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 dark:bg-stone-800/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Class</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Time</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden md:table-cell">Instructor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden lg:table-cell">Capacity</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {items.map(s => (
                      <tr key={s.id} className={cn('hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors', s.status === 'cancelled' && 'opacity-60')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCategoryEmoji(s.class?.category ?? '')}</span>
                            <div>
                              <p className="font-medium text-stone-900 dark:text-stone-100">{s.class?.name}</p>
                              <p className="text-xs text-stone-400 sm:hidden">{format(parseISO(s.startTime), 'h:mm a')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-500 dark:text-stone-400 hidden sm:table-cell">
                          {format(parseISO(s.startTime), 'h:mm a')} · {s.class?.duration}m
                        </td>
                        <td className="px-4 py-3 text-stone-500 dark:text-stone-400 hidden md:table-cell">
                          {s.instructor?.name}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell w-48">
                          <CapacityBar booked={s.bookedCount} capacity={s.class?.capacity ?? 20} />
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={s.status === 'active' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {s.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            {s.status === 'active' && (
                              <button
                                onClick={() => setCancelTarget(s)}
                                className="p-1.5 rounded-md text-stone-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 transition-colors"
                                title="Cancel class"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteTarget(s)}
                              className="p-1.5 rounded-md text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a class</DialogTitle>
            <DialogDescription>Add a new class session to the schedule.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Class *</Label>
              <Select value={form.classId} onValueChange={v => {
                const cls = mockClasses.find(c => c.id === v)
                setForm(f => ({ ...f, classId: v, instructorId: cls?.instructorId ?? f.instructorId }))
              }}>
                <SelectTrigger><SelectValue placeholder="Select class type" /></SelectTrigger>
                <SelectContent>
                  {mockClasses.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {getCategoryEmoji(c.category)} {c.name} · {c.duration}m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Instructor *</Label>
              <Select value={form.instructorId} onValueChange={v => setForm(f => ({ ...f, instructorId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select instructor" /></SelectTrigger>
                <SelectContent>
                  {mockInstructors.map(i => (
                    <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start time *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                />
              </div>
            </div>

            {form.classId && (
              <div className="rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 text-sm text-stone-600 dark:text-stone-400">
                {(() => {
                  const cls = mockClasses.find(c => c.id === form.classId)
                  if (!cls) return null
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryEmoji(cls.category)}</span>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">{cls.name}</p>
                        <p>{cls.duration} min · Up to {cls.capacity} students · {cls.difficulty}</p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Schedule class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove schedule?</DialogTitle>
            <DialogDescription>
              This will permanently remove {deleteTarget?.class?.name} on {deleteTarget ? format(parseISO(deleteTarget.startTime), 'EEE, MMM d at h:mm a') : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel class confirmation */}
      <Dialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel class?</DialogTitle>
            <DialogDescription>
              {cancelTarget?.bookedCount} members are enrolled in {cancelTarget?.class?.name} on {cancelTarget ? format(parseISO(cancelTarget.startTime), 'EEE, MMM d at h:mm a') : ''}. They will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>Keep class</Button>
            <Button variant="destructive" onClick={handleCancel}>Cancel class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
