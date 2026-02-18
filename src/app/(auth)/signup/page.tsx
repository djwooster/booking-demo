'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dumbbell, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'
import { sendWelcomeEmail } from '@/lib/resend'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const perks = [
  'Book classes instantly, 24/7',
  'Track your attendance and progress',
  'Manage membership credits',
  'Get class reminders by email',
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await signup({ email: data.email, name: data.name, password: data.password, phone: data.phone })
    if (result.success) {
      await sendWelcomeEmail(data.email, data.name)
      toast.success('Account created! Welcome to APEX Studio 🎉')
      router.push('/classes')
    } else {
      toast.error(result.error ?? 'Could not create account')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-green-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          APEX Studio
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Join thousands of<br />members today.
          </h2>
          <p className="mt-4 text-teal-100 text-lg">Create your free account and start booking classes immediately.</p>

          <ul className="mt-8 space-y-3">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="h-5 w-5 text-green-200 shrink-0" />
                <span className="text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-teal-200 text-sm relative z-10">© 2026 APEX Studio</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white dark:bg-stone-950 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="flex lg:hidden items-center gap-2 text-stone-900 dark:text-white font-bold text-xl mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            APEX Studio
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Create your account</h1>
            <p className="mt-2 text-stone-500 dark:text-stone-400">Free to join — start booking classes today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jordan Rivera" autoComplete="name" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone <span className="text-stone-400 font-normal">(optional)</span></Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" {...register('phone')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              Create account
            </Button>

            <p className="text-xs text-center text-stone-400 dark:text-stone-500">
              By signing up, you agree to our{' '}
              <a href="#" className="underline hover:text-stone-600 dark:hover:text-stone-300">Terms</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-stone-600 dark:hover:text-stone-300">Privacy Policy</a>
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:underline dark:text-green-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
