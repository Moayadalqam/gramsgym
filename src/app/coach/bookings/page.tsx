import { createClient } from '@/lib/supabase/server'
import { BookingsCalendar } from '@/components/coach/bookings-calendar'
import { startOfWeek, endOfWeek, addDays } from 'date-fns'
import { isDemoMode, demoBookings, demoCoach, demoMembers } from '@/lib/demo-data'

export default async function BookingsPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    return (
      <BookingsCalendar
        bookings={demoBookings}
        coaches={[demoCoach]}
        members={demoMembers}
      />
    )
  }

  const supabase = await createClient()

  // Get bookings for current week
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 6 }) // Saturday
  const weekEnd = endOfWeek(today, { weekStartsOn: 6 })

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      member:members(id, name_en, name_ar, profile_photo_url),
      coach:coaches(id, name_en, name_ar)
    `)
    .gte('scheduled_at', weekStart.toISOString())
    .lte('scheduled_at', weekEnd.toISOString())
    .order('scheduled_at', { ascending: true })

  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar')
    .eq('is_active', true)

  const { data: members } = await supabase
    .from('members')
    .select('id, name_en, name_ar')

  return (
    <BookingsCalendar
      bookings={bookings || []}
      coaches={coaches || []}
      members={members || []}
    />
  )
}
