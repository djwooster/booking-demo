'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Calendar, BookOpen, Users, CreditCard,
  Dumbbell, LogOut, Sun, Moon, ChevronRight, BarChart3, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/classes', label: 'Classes', icon: Dumbbell },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { href: '/admin/instructors', label: 'Instructors', icon: Users },
  { href: '/admin/memberships', label: 'Memberships', icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAppStore()

  useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'A'

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-stone-200 px-6 dark:border-stone-800">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">APEX Studio</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          Management
        </p>
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
              )}
            >
              <item.icon className={cn('h-4 w-4', active ? 'text-green-600 dark:text-green-400' : '')} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3 w-3 text-green-600 dark:text-green-400" />}
            </Link>
          )
        })}

        <div className="pt-4">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Quick Links
          </p>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 transition-all"
          >
            <BarChart3 className="h-4 w-4" />
            View Live Site
          </Link>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-stone-200 p-3 dark:border-stone-800 space-y-1">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-all"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        )}

        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{user?.name}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-50 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 dark:border-stone-800 dark:bg-stone-950">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <Dumbbell className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold">APEX Admin</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
