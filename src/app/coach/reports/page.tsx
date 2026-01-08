import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, CreditCard, TrendingUp } from 'lucide-react'
import { isDemoMode, demoMembers, demoBookings, demoGymMemberships, demoPTPackages } from '@/lib/demo-data'

export default async function ReportsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()

  let totalMembers = 0
  let activeMembers = 0
  let totalBookings = 0
  let completedBookings = 0
  let totalRevenue = 0
  let activeMemberships = 0
  let activePTPackages = 0

  if (demoMode === 'coach') {
    totalMembers = demoMembers.length
    activeMembers = demoMembers.length
    totalBookings = demoBookings.length
    completedBookings = demoBookings.filter(b => b.status === 'completed').length
    totalRevenue = demoGymMemberships.reduce((sum, m) => sum + (m.price_paid || 0), 0) +
                   demoPTPackages.reduce((sum, p) => sum + (p.price_paid || 0), 0)
    activeMemberships = demoGymMemberships.filter(m => m.status === 'active').length
    activePTPackages = demoPTPackages.filter(p => p.status === 'active').length
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    // Get member counts
    const { count: membersCount } = await client
      .from('members')
      .select('*', { count: 'exact', head: true })
    totalMembers = membersCount || 0
    activeMembers = membersCount || 0

    // Get booking stats
    const { data: bookings } = await client
      .from('bookings')
      .select('status')
    totalBookings = bookings?.length || 0
    completedBookings = bookings?.filter((b: { status: string }) => b.status === 'completed').length || 0

    // Get revenue from memberships
    const { data: memberships } = await client
      .from('gym_memberships')
      .select('price_paid, status')
    const membershipRevenue = memberships?.reduce((sum: number, m: { price_paid: number }) => sum + (m.price_paid || 0), 0) || 0
    activeMemberships = memberships?.filter((m: { status: string }) => m.status === 'active').length || 0

    // Get revenue from PT packages
    const { data: ptPackages } = await client
      .from('pt_packages')
      .select('price_paid, status')
    const ptRevenue = ptPackages?.reduce((sum: number, p: { price_paid: number }) => sum + (p.price_paid || 0), 0) || 0
    activePTPackages = ptPackages?.filter((p: { status: string }) => p.status === 'active').length || 0

    totalRevenue = membershipRevenue + ptRevenue
  }

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      description: `${activeMembers} active members`,
      icon: Users,
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      description: `${completedBookings} completed sessions`,
      icon: Calendar,
    },
    {
      title: 'Active Subscriptions',
      value: activeMemberships + activePTPackages,
      description: `${activeMemberships} memberships, ${activePTPackages} PT packages`,
      icon: CreditCard,
    },
    {
      title: 'Total Revenue',
      value: `${totalRevenue} JOD`,
      description: 'From all subscriptions',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Overview of gym performance and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Membership Distribution</CardTitle>
            <CardDescription>Active gym memberships by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly</span>
                <span className="text-sm font-medium">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quarterly</span>
                <span className="text-sm font-medium">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Yearly</span>
                <span className="text-sm font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Statistics</CardTitle>
            <CardDescription>PT session completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">{completedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Scheduled</span>
                <span className="text-sm font-medium">{totalBookings - completedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completion Rate</span>
                <span className="text-sm font-medium">
                  {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
