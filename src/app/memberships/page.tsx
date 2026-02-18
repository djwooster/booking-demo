'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import {
  CheckCircle, CreditCard, Shield, ArrowRight, Zap, Star,
  CalendarDays, RefreshCw, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/lib/store'
import { mockMembershipPlans } from '@/lib/mock-data'
import { formatCurrency, cn } from '@/lib/utils'
import { simulatePayment } from '@/lib/stripe'
import { sendMembershipConfirmation } from '@/lib/resend'
import type { MembershipPlan } from '@/types'

const perks = [
  { icon: Zap, text: 'Book classes instantly, 24/7 from any device' },
  { icon: CalendarDays, text: 'Reserve spots up to 14 days in advance' },
  { icon: Shield, text: 'Free cancellation up to 2 hours before class' },
  { icon: Star, text: 'Priority waitlist access for popular classes' },
  { icon: RefreshCw, text: 'Pause or cancel your membership anytime' },
]

export default function MembershipsPage() {
  const { user, isAuthenticated, userMembership, purchaseMembership, cancelMembership } = useAppStore()
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'success'>('select')

  const activeMembership = userMembership?.status === 'active' ? userMembership : null

  const handleSelectPlan = (plan: MembershipPlan) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to purchase a membership', {
        action: { label: 'Sign in', onClick: () => window.location.href = '/login' }
      })
      return
    }
    setSelectedPlan(plan)
    setPaymentStep('select')
  }

  const handleProceedToPayment = () => setPaymentStep('payment')

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !user) return
    setCheckoutLoading(true)

    // Simulate Stripe payment
    const payment = await simulatePayment(selectedPlan.price)
    if (!payment.success) {
      toast.error(payment.error ?? 'Payment failed. Please try again.')
      setCheckoutLoading(false)
      return
    }

    const result = await purchaseMembership(selectedPlan.id)
    setCheckoutLoading(false)

    if (result.success) {
      setPaymentStep('success')
      await sendMembershipConfirmation(user.email, user.name, selectedPlan.name, selectedPlan.price)
      toast.success(`${selectedPlan.name} activated! 🎉`)
    } else {
      toast.error(result.error ?? 'Could not activate membership')
    }
  }

  const handleCancelMembership = async () => {
    setCancelLoading(true)
    const result = await cancelMembership()
    setCancelLoading(false)
    if (result.success) {
      toast.success('Membership cancelled. You can still use it until the end of the billing period.')
      setCancelDialogOpen(false)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 to-green-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-green-600/20 text-green-400 border-green-600/30">Memberships</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Invest in your health
          </h1>
          <p className="mt-4 text-lg text-stone-300 max-w-xl mx-auto">
            Choose the plan that fits your schedule. All plans include access to every class type.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* Active membership card */}
        {activeMembership && (
          <Card className="mb-12 border-green-300 dark:border-green-800 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">{activeMembership.plan?.name}</h3>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                      {activeMembership.plan?.type === 'unlimited' && 'Unlimited classes this month'}
                      {activeMembership.plan?.type === 'pack' && `${activeMembership.creditsRemaining} of ${activeMembership.plan.credits} credits remaining`}
                      {activeMembership.plan?.type === 'dropin' && 'Pay per class'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {activeMembership.endDate && (
                    <div className="text-right">
                      <p className="text-xs text-stone-400 dark:text-stone-500">
                        {activeMembership.plan?.type === 'pack' ? 'Valid until' : 'Renews'}
                      </p>
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        {format(parseISO(activeMembership.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {/* Credits progress bar for pack */}
                  {activeMembership.plan?.type === 'pack' && (
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1 text-stone-500">
                        <span>Credits</span>
                        <span>{activeMembership.creditsRemaining}/{activeMembership.plan.credits}</span>
                      </div>
                      <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${((activeMembership.creditsRemaining ?? 0) / (activeMembership.plan.credits ?? 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link href="/classes">Book a class <ArrowRight className="h-3 w-3" /></Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    Cancel plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mockMembershipPlans.map(plan => {
            const isCurrentPlan = activeMembership?.planId === plan.id

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border-2 p-8 bg-white dark:bg-stone-900 transition-all',
                  plan.color,
                  plan.popular ? 'shadow-xl shadow-green-500/10' : '',
                  isCurrentPlan ? 'opacity-80' : 'hover:shadow-lg hover:-translate-y-0.5'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{plan.name}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-stone-400 pb-1 text-sm">
                      {plan.type === 'unlimited' ? '/month' : plan.type === 'pack' ? '/pack' : '/class'}
                    </span>
                  </div>
                  {plan.type === 'pack' && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {formatCurrency(plan.price / (plan.credits ?? 1))} per class
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {formatCurrency(20)} drop-in
                      </span>
                    </div>
                  )}
                  {plan.credits && (
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{plan.credits} class credits</p>
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

                {isCurrentPlan ? (
                  <Button className="w-full" disabled>
                    <CheckCircle className="h-4 w-4" /> Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {activeMembership ? 'Switch to this plan' : 'Get started'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Perks */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">All plans include</h2>
          <p className="text-stone-500 dark:text-stone-400 mb-6">Everything you need for a great experience.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map(perk => (
              <div key={perk.text} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <perk.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300">{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(o) => { if (!o) { setSelectedPlan(null); setPaymentStep('select') } }}>
        <DialogContent className="max-w-md">
          {selectedPlan && paymentStep === 'select' && (
            <>
              <DialogHeader>
                <DialogTitle>Review your order</DialogTitle>
                <DialogDescription>You&apos;re purchasing the {selectedPlan.name}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-xl border border-stone-200 dark:border-stone-700 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">{selectedPlan.name}</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {selectedPlan.type === 'pack' ? `${selectedPlan.credits} class credits` : selectedPlan.description}
                      </p>
                    </div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(selectedPlan.price)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>Total today</span>
                  <span>{formatCurrency(selectedPlan.price)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  <span>Secure checkout powered by Stripe (demo mode)</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>Cancel</Button>
                <Button onClick={handleProceedToPayment}>
                  <CreditCard className="h-4 w-4" /> Enter payment
                </Button>
              </DialogFooter>
            </>
          )}

          {selectedPlan && paymentStep === 'payment' && (
            <>
              <DialogHeader>
                <DialogTitle>Payment details</DialogTitle>
                <DialogDescription>Demo mode — no real charges will be made</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Mock card form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">Card number</label>
                    <div className="h-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 flex items-center justify-between text-sm">
                      <span className="text-stone-400">4242 4242 4242 4242</span>
                      <span className="text-xs text-stone-300">VISA</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">Expiry</label>
                      <div className="h-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 flex items-center text-sm text-stone-400">12/28</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">CVC</label>
                      <div className="h-10 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 flex items-center text-sm text-stone-400">•••</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    🔒 Demo mode: This is a simulated Stripe checkout. No real payment will be processed.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPaymentStep('select')}>Back</Button>
                <Button onClick={handleConfirmPayment} loading={checkoutLoading}>
                  Pay {formatCurrency(selectedPlan.price)}
                </Button>
              </DialogFooter>
            </>
          )}

          {selectedPlan && paymentStep === 'success' && (
            <>
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">You&apos;re all set!</h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  Your <span className="font-medium">{selectedPlan.name}</span> is now active. A confirmation has been sent to your email.
                </p>
              </div>
              <DialogFooter>
                <Button className="w-full" asChild onClick={() => setSelectedPlan(null)}>
                  <Link href="/classes">Browse classes <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel membership dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel membership?</DialogTitle>
            <DialogDescription>
              Your {activeMembership?.plan?.name} will remain active until the end of the billing period.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {activeMembership?.plan?.type === 'pack'
                ? `You have ${activeMembership?.creditsRemaining} credits remaining that will expire.`
                : 'You\'ll lose access to unlimited classes at the end of the period.'}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep membership</Button>
            <Button variant="destructive" onClick={handleCancelMembership} loading={cancelLoading}>
              Cancel membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
