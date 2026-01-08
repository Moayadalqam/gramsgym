import { createClient } from '@/lib/supabase/server'
import { ScheduleManager } from '@/components/coach/schedule-manager'
import { isDemoMode, demoCoach, demoAvailability, demoBookings } from '@/lib/demo-data'

export default async function SchedulePage() {
  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    return (
      <ScheduleManager
        currentCoach={demoCoach}
        coaches={[demoCoach]}
        availability={demoAvailability}
        bookings={demoBookings}
      />
    )
  }

  const supabase = await createClient()

  // Get current coach
  const { data: { user } } = await supabase.auth.getUser()

  let coach = null
  if (user?.id) {
    const { data } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', user.id)
      .single()
    coach = data
  }

  // Get all coaches for admin view
  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar, specialization, profile_photo_url')
    .eq('is_active', true)

  // Get coach availability
  const { data: availability } = await supabase
    .from('coach_availability')
    .select('*')
    .order('day_of_week', { ascending: true })

  // Get upcoming bookings for the next 2 weeks
  const today = new Date()
  const twoWeeksLater = new Date()
  twoWeeksLater.setDate(today.getDate() + 14)

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      member:members(id, name_en, name_ar, profile_photo_url),
      coach:coaches(id, name_en, name_ar)
    `)
    .gte('scheduled_at', today.toISOString())
    .lte('scheduled_at', twoWeeksLater.toISOString())
    .order('scheduled_at', { ascending: true })

  return (
    <ScheduleManager
      currentCoach={coach}
      coaches={coaches || []}
      availability={availability || []}
      bookings={bookings || []}
    />
  )
}
