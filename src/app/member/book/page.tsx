import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/member/booking-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { isDemoMode, demoMember, demoCoach, demoPTPackage, demoAvailability, demoBookings } from '@/lib/demo-data'

export default async function BookSessionPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'member') {
    const memberWithCoach = { ...demoMember, coach: demoCoach }
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div>
          <h1 className="text-2xl font-bold">Book a Session</h1>
          <p className="text-muted-foreground">Schedule a personal training session with your coach</p>
        </div>
        <BookingForm
          member={memberWithCoach}
          coach={demoCoach}
          ptPackages={[demoPTPackage]}
          coachAvailability={demoAvailability}
          existingBookings={demoBookings.filter(b => b.status === 'scheduled')}
        />
      </div>
    )
  }

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  // Get member with assigned coach
  const { data: member } = await client
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url, specialty_en)
    `)
    .eq('id', user?.id)
    .single()

  // Get active PT packages for this member
  const { data: ptPackages } = await client
    .from('pt_packages')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('member_id', user?.id)
    .eq('status', 'active')
    .gt('remaining_sessions', 0)

  // Get coach availability
  const { data: coachAvailability } = await client
    .from('coach_availability')
    .select('*')
    .eq('coach_id', member?.assigned_coach_id)
    .eq('is_available', true)

  // Get existing bookings for the next 2 weeks to show unavailable slots
  const today = new Date()
  const twoWeeksLater = addWeeks(today, 2)

  const { data: existingBookings } = await client
    .from('bookings')
    .select('scheduled_at, duration_minutes, coach_id')
    .eq('coach_id', member?.assigned_coach_id)
    .eq('status', 'scheduled')
    .gte('scheduled_at', today.toISOString())
    .lte('scheduled_at', twoWeeksLater.toISOString())

  // Check if member can book
  const canBook = ptPackages && ptPackages.length > 0 && member?.coach

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Book a Session</h1>
        <p className="text-muted-foreground">Schedule a personal training session with your coach</p>
      </div>

      {!member?.coach ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-lg">No Coach Assigned</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                You don&apos;t have an assigned coach yet. Please contact the gym to get a coach assigned to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !canBook ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-lg">No Active PT Package</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                You need an active PT package with remaining sessions to book. Please contact your coach to purchase a package.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <BookingForm
          member={member}
          coach={member.coach}
          ptPackages={ptPackages}
          coachAvailability={coachAvailability || []}
          existingBookings={existingBookings || []}
        />
      )}
    </div>
  )
}
