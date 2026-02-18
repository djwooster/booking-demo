'use client'

import { CheckCircle, Users, TrendingUp, CreditCard, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockMembershipPlans } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

// Mock subscriber counts for demo
const planStats = {
  'plan-001': { subscribers: 124, revenue: 2480, growth: '+5%' },
  'plan-002': { subscribers: 89, revenue: 13350, growth: '+12%' },
  'plan-003': { subscribers: 67, revenue: 8040, growth: '+18%' },
}

const recentPurchases = [
  { name: 'Jordan R.', plan: '10-Class Pack', date: '2 min ago', amount: 150 },
  { name: 'Taylor S.', plan: 'Unlimited Monthly', date: '15 min ago', amount: 120 },
  { name: 'Casey M.', plan: 'Drop-In Pass', date: '1 hr ago', amount: 20 },
  { name: 'Alex P.', plan: '10-Class Pack', date: '2 hr ago', amount: 150 },
  { name: 'Morgan L.', plan: 'Unlimited Monthly', date: '3 hr ago', amount: 120 },
]

export default function AdminMembershipsPage() {
  const totalRevenue = Object.values(planStats).reduce((s, p) => s + p.revenue, 0)
  const totalMembers = Object.values(planStats).reduce((s, p) => s + p.subscribers, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Memberships</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {totalMembers} active members · {formatCurrency(totalRevenue)} monthly revenue
          </p>
        </div>
        <Button onClick={() => toast.info('Plan builder coming soon')}>
          Add plan
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active members', value: totalMembers, icon: Users, color: 'text-green-600 dark:text-green-400' },
          { label: 'Monthly revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Avg. revenue/member', value: formatCurrency(Math.round(totalRevenue / totalMembers)), icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Plans active', value: mockMembershipPlans.length, icon: CreditCard, color: 'text-amber-600 dark:text-amber-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-stone-500 dark:text-stone-400">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mockMembershipPlans.map(plan => {
          const stats = planStats[plan.id as keyof typeof planStats]
          const pct = Math.round((stats.subscribers / totalMembers) * 100)

          return (
            <Card key={plan.id} className={`border-2 ${plan.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.popular && <Badge variant="default" className="text-xs">Popular</Badge>}
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-stone-400 ml-1">
                    {plan.type === 'unlimited' ? '/mo' : plan.type === 'pack' ? '/pack' : '/class'}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-500 dark:text-stone-400">Subscribers</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{stats.subscribers}</span>
                  </div>
                  <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{pct}% of all members</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Monthly revenue</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(stats.revenue)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Growth</span>
                  <Badge variant="default" className="text-xs">{stats.growth} this month</Badge>
                </div>

                <ul className="space-y-1.5">
                  {plan.features.slice(0, 3).map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Plan editor coming soon')}>
                  Edit plan
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPurchases.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-semibold text-green-700 dark:text-green-400">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.plan} · {p.date}</p>
                  </div>
                </div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  {formatCurrency(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
