import Link from 'next/link'
import { ArrowRight, Calendar, CheckCircle, Clock, CreditCard, MapPin, Star, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockClasses, mockInstructors, mockMembershipPlans } from '@/lib/mock-data'
import { getCategoryEmoji, getDifficultyColor, formatCurrency } from '@/lib/utils'

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Browse and book classes up to two weeks in advance. Real-time spot availability so you\'re never left guessing.',
  },
  {
    icon: Zap,
    title: 'World-Class Instructors',
    description: 'Learn from certified professionals with decades of combined experience across all fitness disciplines.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Memberships',
    description: 'From drop-in sessions to unlimited monthly plans — choose the option that fits your lifestyle and budget.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a thriving community of 2,000+ members who motivate and support each other every day.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    avatar: 'SM',
    role: 'Unlimited Member',
    rating: 5,
    text: 'APEX completely changed my fitness routine. Samantha\'s yoga classes are phenomenal — I\'ve never felt more flexible or centered.',
  },
  {
    name: 'James T.',
    avatar: 'JT',
    role: '10-Class Pack',
    rating: 5,
    text: 'Marcus\'s HIIT sessions are brutal in the best way. The booking system is so smooth — I can reserve my spot in seconds.',
  },
  {
    name: 'Priya K.',
    avatar: 'PK',
    role: 'Unlimited Member',
    rating: 5,
    text: 'I\'ve tried every gym in the city. APEX is different. The instructors actually know your name. Worth every penny.',
  },
]

export default function HomePage() {
  const featuredClasses = mockClasses.slice(0, 6)

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-stone-950 via-stone-900 to-green-950">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-600 rounded-full opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-green-600/20 text-green-400 border border-green-600/30 text-xs px-3 py-1">
              ✦ Now booking — Spring 2026 schedule
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Train harder.<br />
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Live stronger.
              </span>
            </h1>

            <p className="mt-6 text-xl text-stone-300 leading-relaxed max-w-2xl">
              Premium fitness classes with world-class instructors. Yoga, HIIT, spin, pilates, boxing and more — all in one studio.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="xl" asChild className="shadow-xl shadow-green-900/30">
                <Link href="/classes">
                  Browse Classes
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-stone-600 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/signup">Join Free Today</Link>
              </Button>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { value: '50+', label: 'Classes weekly' },
                { value: '6', label: 'Expert instructors' },
                { value: '2,000+', label: 'Active members' },
                { value: '4.9★', label: 'Average rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-stone-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent" />
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="teal" className="mb-4">Why APEX</Badge>
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Everything you need to reach your peak
            </h2>
            <p className="mt-4 text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
              We&apos;ve built the complete fitness experience — from booking to the workout to post-class recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="group">
                <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">{feature.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Classes ─── */}
      <section className="py-24 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <Badge className="mb-4">Our Classes</Badge>
              <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                Find your perfect workout
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/classes">
                View full schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClasses.map(cls => {
              const instructor = mockInstructors.find(i => i.id === cls.instructorId)
              return (
                <Link
                  key={cls.id}
                  href="/classes"
                  className="group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-48 bg-gradient-to-br ${cls.color} flex items-center justify-center`}>
                    <span className="text-5xl">{getCategoryEmoji(cls.category)}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {cls.name}
                      </h3>
                      <span className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-0.5 ${getDifficultyColor(cls.difficulty)}`}>
                        {cls.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">{cls.description}</p>
                    <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cls.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Up to {cls.capacity}
                      </span>
                      {instructor && (
                        <span className="font-medium text-stone-500 dark:text-stone-400">
                          {instructor.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Instructors ─── */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="teal" className="mb-4">Our Team</Badge>
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Meet your instructors
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
              Certified, experienced, and passionate about helping you reach your goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockInstructors.map(inst => (
              <div key={inst.id} className="text-center group">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-transparent group-hover:ring-green-500 transition-all duration-300">
                  <img src={inst.image} alt={inst.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{inst.name}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{inst.specialties[0]}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-400">{inst.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-24 bg-white dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockMembershipPlans.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${plan.color} p-8 bg-white dark:bg-stone-900 ${plan.popular ? 'shadow-xl shadow-green-500/10 dark:shadow-green-500/5' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{plan.name}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-stone-400 text-sm ml-1">
                    {plan.type === 'unlimited' ? '/month' : plan.type === 'pack' ? '/pack' : '/class'}
                  </span>
                  {plan.type === 'pack' && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      = {formatCurrency(plan.price / (plan.credits ?? 1))} per class
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-300">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                  <Link href="/memberships">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 bg-stone-50 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="teal" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              What our members say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 text-sm font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to transform?
          </h2>
          <p className="mt-4 text-xl text-green-100">Join APEX Studio today. First class is on us.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="xl" className="bg-white text-green-700 hover:bg-green-50 shadow-xl" asChild>
              <Link href="/signup">
                Start free today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/classes">Browse schedule</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-green-200">
            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> No commitment required</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Open 7 days a week</span>
          </div>
        </div>
      </section>
    </div>
  )
}
