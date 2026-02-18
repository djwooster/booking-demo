'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import {
  Sun, Moon, Menu, X, Dumbbell, User, LogOut, LayoutDashboard, Calendar, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const customerLinks = [
  { href: '/classes', label: 'Browse Classes' },
  { href: '/bookings', label: 'My Bookings' },
  { href: '/memberships', label: 'Memberships' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAppStore()

  useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  const isAdmin = user?.role === 'admin'
  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) return null

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg tracking-tight">APEX Studio</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {customerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400',
                pathname === link.href
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-stone-600 dark:text-stone-400'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {isAuthenticated && user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-green-500">
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-green-500 transition-all">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-stone-200 bg-white p-1 shadow-xl dark:border-stone-800 dark:bg-stone-900"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800 mb-1">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/admin"
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 outline-none"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenu.Item>
                  )}

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/profile"
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 outline-none"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/bookings"
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 outline-none"
                    >
                      <Calendar className="h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/memberships"
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 outline-none"
                    >
                      <CreditCard className="h-4 w-4" />
                      Membership
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="my-1 h-px bg-stone-100 dark:bg-stone-800" />

                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 outline-none"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-950 md:hidden">
          <div className="flex flex-col gap-1">
            {customerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800'
                )}
              >
                {link.label}
              </Link>
            ))}

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            )}

            {!isAuthenticated && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
