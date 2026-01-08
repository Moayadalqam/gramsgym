import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreditCard, Dumbbell, Calendar, AlertCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { isDemoMode, demoGymMembership, demoPTPackage, demoCoach } from '@/lib/demo-data'

export default async function MemberSubscriptionsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()

  let gymMemberships: typeof demoGymMembership[] | null = null
  let ptPackages: (typeof demoPTPackage & { coach: typeof demoCoach })[] | null = null

  if (demoMode === 'member') {
    gymMemberships = [demoGymMembership]
    ptPackages = [{ ...demoPTPackage, coach: demoCoach }]
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any

    const { data: { user } } = await supabase.auth.getUser()

    // Get all gym memberships
    const { data: gm } = await client
      .from('gym_memberships')
      .select('*')
      .eq('member_id', user?.id)
      .order('created_at', { ascending: false })
    gymMemberships = gm

    // Get all PT packages
    const { data: pt } = await client
      .from('pt_packages')
      .select(`
        *,
        coach:coaches(id, name_en, name_ar, profile_photo_url)
      `)
      .eq('member_id', user?.id)
      .order('created_at', { ascending: false })
    ptPackages = pt
  }

  const today = new Date()
  const activeGymMembership = gymMemberships?.find((m: { status: string }) => m.status === 'active')
  const activePTPackages = ptPackages?.filter((p: { status: string }) => p.status === 'active') || []
  const expiredGymMemberships = gymMemberships?.filter((m: { status: string }) => m.status !== 'active') || []
  const completedPTPackages = ptPackages?.filter((p: { status: string }) => p.status !== 'active') || []

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        <p className="text-muted-foreground">View your gym membership and PT packages</p>
      </div>

      {/* Active Gym Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gym Membership
          </CardTitle>
          <CardDescription>Your current gym access status</CardDescription>
        </CardHeader>
        <CardContent>
          {activeGymMembership ? (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge className="mb-2">Active</Badge>
                  <h3 className="text-xl font-bold capitalize">{activeGymMembership.type} Membership</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Valid until {format(new Date(activeGymMembership.end_date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  {(() => {
                    const daysLeft = differenceInDays(new Date(activeGymMembership.end_date), today)
                    return (
                      <>
                        <div className={`text-3xl font-bold ${daysLeft <= 7 ? 'text-red-500' : 'text-primary'}`}>
                          {daysLeft}
                        </div>
                        <p className="text-sm text-muted-foreground">days remaining</p>
                      </>
                    )
                  })()}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(new Date(activeGymMembership.start_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{format(new Date(activeGymMembership.end_date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold">No Active Membership</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contact the gym to purchase a membership
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active PT Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            PT Packages
          </CardTitle>
          <CardDescription>Your personal training session packages</CardDescription>
        </CardHeader>
        <CardContent>
          {activePTPackages.length > 0 ? (
            <div className="space-y-4">
              {activePTPackages.map((pkg: {
                id: string
                total_sessions: number
                remaining_sessions: number
                price_paid: number | null
                created_at: string
                coach: { name_en: string; profile_photo_url: string | null }
              }) => (
                <div
                  key={pkg.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={pkg.coach.profile_photo_url || undefined} />
                    <AvatarFallback>{pkg.coach.name_en.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{pkg.coach.name_en}</h3>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pkg.total_sessions} session package
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pkg.remaining_sessions <= 3 ? 'bg-red-500' : 'bg-primary'
                          }`}
                          style={{
                            width: `${(pkg.remaining_sessions / pkg.total_sessions) * 100}%`,
                          }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        pkg.remaining_sessions <= 3 ? 'text-red-500' : ''
                      }`}>
                        {pkg.remaining_sessions}/{pkg.total_sessions}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold">No Active PT Packages</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contact your coach to purchase a PT package
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      {(expiredGymMemberships.length > 0 || completedPTPackages.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              History
            </CardTitle>
            <CardDescription>Past memberships and completed packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiredGymMemberships.map((membership: {
                id: string
                type: string
                status: string
                start_date: string
                end_date: string
              }) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{membership.type} Membership</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(membership.start_date), 'MMM d')} - {format(new Date(membership.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {membership.status}
                  </Badge>
                </div>
              ))}
              {completedPTPackages.map((pkg: {
                id: string
                total_sessions: number
                status: string
                coach: { name_en: string }
              }) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pkg.total_sessions} Sessions with {pkg.coach.name_en}</p>
                      <p className="text-sm text-muted-foreground">PT Package</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {pkg.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
