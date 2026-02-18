import Link from 'next/link'
import { Dumbbell, Instagram, Twitter, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg tracking-tight">APEX Studio</span>
            </Link>
            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Premium fitness studio offering world-class classes to help you reach your peak performance.
            </p>
            <div className="mt-4 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors dark:hover:bg-stone-800 dark:hover:text-stone-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Classes */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4">Classes</h3>
            <ul className="space-y-2.5">
              {['Yoga Flow', 'Power HIIT', 'Rhythm Spin', 'Core Pilates', 'Boxing Cardio', 'Ballet Barre'].map(c => (
                <li key={c}>
                  <Link href="/classes" className="text-sm text-stone-500 hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4">Studio</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '#' },
                { label: 'Our Instructors', href: '#' },
                { label: 'Memberships', href: '/memberships' },
                { label: 'Schedule', href: '/classes' },
                { label: 'Blog', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-stone-500 hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-stone-500 dark:text-stone-400">
              <li>123 Fitness Ave, Suite 100</li>
              <li>San Francisco, CA 94102</li>
              <li className="pt-1">
                <a href="tel:+14155551234" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  (415) 555-1234
                </a>
              </li>
              <li>
                <a href="mailto:hello@apexstudio.com" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  hello@apexstudio.com
                </a>
              </li>
              <li className="pt-1 leading-relaxed">
                Mon–Fri: 5:30am – 10pm<br />
                Sat–Sun: 7am – 8pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            © 2026 APEX Studio. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-xs text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
