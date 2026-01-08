import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MemberDetail } from '@/components/coach/member-detail'
import { isDemoMode, demoMembers, demoCoach, demoGymMembership, demoPTPackage, demoBookings } from '@/lib/demo-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params

  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    const foundMember = demoMembers.find(m => m.id === id)
    const member = foundMember
      ? { ...foundMember, coach: demoCoach }
      : { ...demoMembers[0], coach: demoCoach }
    return (
      <MemberDetail
        member={member}
        gymMemberships={[demoGymMembership]}
        ptPackages={[{ ...demoPTPackage, coach: demoCoach }]}
        bookings={demoBookings.map(b => ({ ...b, coach: demoCoach }))}
        coaches={[demoCoach]}
      />
    )
  }

  const supabase = await createClient()

  const { data: member } = await supabase
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('id', id)
    .single()

  if (!member) {
    notFound()
  }

  const { data: gymMemberships } = await supabase
    .from('gym_memberships')
    .select('*')
    .eq('member_id', id)
    .order('created_at', { ascending: false })

  const { data: ptPackages } = await supabase
    .from('pt_packages')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('member_id', id)
    .order('created_at', { ascending: false })

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar)
    `)
    .eq('member_id', id)
    .order('scheduled_at', { ascending: false })
    .limit(10)

  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar')
    .eq('is_active', true)

  return (
    <MemberDetail
      member={member}
      gymMemberships={gymMemberships || []}
      ptPackages={ptPackages || []}
      bookings={bookings || []}
      coaches={coaches || []}
    />
  )
}
