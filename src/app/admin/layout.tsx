import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard', template: '%s | APEX Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <AdminSidebar />
      <div className="lg:pl-64 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  )
}
