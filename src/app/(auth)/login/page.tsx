'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dumbbell, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      const { user } = useAppStore.getState()
      toast.success(`Welcome back, ${user?.name?.split(' ')[0]}!`)
      if (user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/classes')
      }
    } else {
      toast.error(result.error ?? 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-teal-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
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
            Your fitness journey<br />starts here.
          </h2>
          <p className="mt-4 text-green-100 text-lg leading-relaxed">
            Access premium classes, track your progress, and connect with world-class instructors.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '50+', label: 'Classes weekly' },
              { value: '6', label: 'Expert instructors' },
              { value: '2k+', label: 'Active members' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-green-100 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-200 text-sm relative z-10">© 2026 APEX Studio</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-white dark:bg-stone-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 text-stone-900 dark:text-white font-bold text-xl mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            APEX Studio
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Welcome back</h1>
            <p className="mt-2 text-stone-500 dark:text-stone-400">Sign in to book your next class</p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Demo credentials</p>
            <div className="space-y-1 text-xs text-green-600 dark:text-green-500">
              <p><span className="font-medium">Customer:</span> demo@example.com / demo123</p>
              <p><span className="font-medium">Admin:</span> admin@apexstudio.com / admin123</p>
              <p className="text-green-500 dark:text-green-600 mt-1">Or use any email with a 6+ char password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-green-600 hover:underline dark:text-green-400">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-green-600 hover:underline dark:text-green-400">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
