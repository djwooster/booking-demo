'use client'

import { useState } from 'react'
import { Star, BookOpen, Plus, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockInstructors, mockSchedules } from '@/lib/mock-data'
import { getCategoryEmoji } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInstructorsPage() {
  const [selected, setSelected] = useState<typeof mockInstructors[0] | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const instructorSchedules = (id: string) =>
    mockSchedules.filter(s => s.instructorId === id && s.status === 'active').length

  const handleInvite = () => {
    if (!inviteEmail) { toast.error('Enter an email address'); return }
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteOpen(false)
    setInviteEmail('')
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Instructors</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">{mockInstructors.length} instructors on the team</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <Plus className="h-4 w-4" /> Invite instructor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockInstructors.map(inst => {
          const upcomingCount = instructorSchedules(inst.id)
          return (
            <Card
              key={inst.id}
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              onClick={() => setSelected(inst)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-stone-200 dark:ring-stone-700">
                    <AvatarImage src={inst.image} alt={inst.name} />
                    <AvatarFallback className="text-lg font-bold">
                      {inst.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-stone-900 dark:text-stone-100">{inst.name}</h3>
                      <Badge variant="default" className="text-xs shrink-0">Active</Badge>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{inst.rating}</span>
                      <span className="text-xs text-stone-400">· {inst.classCount.toLocaleString()} classes total</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {inst.specialties.map(s => (
                        <span key={s} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full px-2 py-0.5">
                          {getCategoryEmoji(s.toLowerCase())} {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs text-stone-400">
                      <BookOpen className="h-3 w-3" />
                      {upcomingCount} upcoming classes
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">{inst.bio}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Instructor detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selected.image} alt={selected.name} />
                    <AvatarFallback className="text-lg font-bold">{selected.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{selected.rating}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{selected.bio}</p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.specialties.map(s => (
                      <Badge key={s} variant="secondary">
                        {getCategoryEmoji(s.toLowerCase())} {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl bg-stone-50 dark:bg-stone-800 p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{selected.rating}</p>
                    <p className="text-xs text-stone-400">Avg rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{selected.classCount.toLocaleString()}</p>
                    <p className="text-xs text-stone-400">Classes taught</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite instructor</DialogTitle>
            <DialogDescription>
              Send an invitation email to a new instructor to join the APEX Studio team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="instructor@example.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
