'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Edit3, Trash2, Clock, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { mockClasses, mockInstructors } from '@/lib/mock-data'
import { getCategoryEmoji, getDifficultyColor } from '@/lib/utils'
import type { FitnessClass } from '@/types'

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<FitnessClass[]>(mockClasses)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FitnessClass | null>(null)
  const [editTarget, setEditTarget] = useState<FitnessClass | null>(null)
  const [form, setForm] = useState<Partial<FitnessClass>>({})

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditTarget(null)
    setForm({ category: 'yoga', difficulty: 'all-levels', duration: 60, capacity: 20, color: 'from-emerald-400 to-teal-500' })
    setDialogOpen(true)
  }

  const openEdit = (cls: FitnessClass) => {
    setEditTarget(cls)
    setForm({ ...cls })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.category) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editTarget) {
      setClasses(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...form } as FitnessClass : c))
      toast.success('Class updated')
    } else {
      const newClass: FitnessClass = {
        id: `class-${Date.now()}`,
        name: form.name ?? '',
        description: form.description ?? '',
        category: form.category ?? 'yoga',
        duration: form.duration ?? 60,
        capacity: form.capacity ?? 20,
        difficulty: form.difficulty ?? 'all-levels',
        image: '',
        instructorId: form.instructorId ?? 'inst-001',
        color: form.color ?? 'from-emerald-400 to-teal-500',
      }
      setClasses(prev => [...prev, newClass])
      toast.success('Class created')
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setClasses(prev => prev.filter(c => c.id !== deleteTarget.id))
    toast.success('Class deleted')
    setDeleteTarget(null)
  }

  const colorOptions = [
    { label: 'Green → Teal', value: 'from-emerald-400 to-teal-500' },
    { label: 'Orange → Red', value: 'from-orange-400 to-red-500' },
    { label: 'Purple → Indigo', value: 'from-purple-400 to-indigo-500' },
    { label: 'Pink → Rose', value: 'from-pink-400 to-rose-500' },
    { label: 'Yellow → Orange', value: 'from-yellow-400 to-orange-500' },
    { label: 'Blue → Indigo', value: 'from-blue-400 to-indigo-500' },
    { label: 'Teal → Cyan', value: 'from-teal-400 to-cyan-500' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Classes</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">{classes.length} class types · manage your catalog</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New class
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Classes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(cls => {
          const instructor = mockInstructors.find(i => i.id === cls.instructorId)
          return (
            <Card key={cls.id} className="overflow-hidden group">
              <div className={`h-24 bg-gradient-to-br ${cls.color} flex items-center justify-center`}>
                <span className="text-3xl">{getCategoryEmoji(cls.category)}</span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 leading-tight">{cls.name}</h3>
                  <span className={`shrink-0 text-xs font-medium rounded-full px-2 py-0.5 ${getDifficultyColor(cls.difficulty)}`}>
                    {cls.difficulty}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-3 capitalize">{cls.category}</p>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cls.duration}m</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cls.capacity} spots</span>
                  {instructor && <span>{instructor.name.split(' ')[0]}</span>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(cls)}>
                    <Edit3 className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteTarget(cls)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add new card */}
        <button
          onClick={openCreate}
          className="rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center p-8 text-stone-400 hover:border-green-400 hover:text-green-600 dark:hover:border-green-600 dark:hover:text-green-400 transition-colors min-h-[200px]"
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Add new class</span>
        </button>
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit class' : 'Create new class'}</DialogTitle>
            <DialogDescription>Fill in the details for this class type.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Class name *</Label>
              <Input
                value={form.name ?? ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Morning Power Flow"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe what students can expect..."
                className="w-full h-20 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as FitnessClass['category'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['yoga', 'hiit', 'spin', 'pilates', 'boxing', 'barre', 'strength', 'dance', 'meditation'].map(c => (
                      <SelectItem key={c} value={c}>{getCategoryEmoji(c)} {c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v as FitnessClass['difficulty'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['beginner', 'all-levels', 'intermediate', 'advanced'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={form.duration ?? 60}
                  onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))}
                  min={15}
                  max={120}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={form.capacity ?? 20}
                  onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 20 }))}
                  min={1}
                  max={50}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Lead instructor</Label>
              <Select value={form.instructorId} onValueChange={v => setForm(f => ({ ...f, instructorId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select instructor" /></SelectTrigger>
                <SelectContent>
                  {mockInstructors.map(i => (
                    <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Color theme</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, color: opt.value }))}
                    className={`h-10 rounded-lg bg-gradient-to-br ${opt.value} transition-all ${form.color === opt.value ? 'ring-2 ring-offset-2 ring-green-500' : 'opacity-70 hover:opacity-100'}`}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTarget ? 'Save changes' : 'Create class'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete &ldquo;{deleteTarget?.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              This will permanently remove this class type. All future schedules for this class must be updated manually.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
