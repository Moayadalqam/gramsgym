import { createClient } from '@/lib/supabase/server'
import { SubscriptionsManager } from '@/components/coach/subscriptions-manager'
import { isDemoMode, demoMembers, demoCoach, demoGymMemberships, demoPTPackages, demoPricing } from '@/lib/demo-data'

interface PageProps {
  searchParams: Promise<{ member?: string; type?: string }>
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    return (
      <SubscriptionsManager
        members={demoMembers}
        coaches={[demoCoach]}
        gymMemberships={demoGymMemberships}
        ptPackages={demoPTPackages}
        pricing={demoPricing}
        defaultMemberId={params.member}
        defaultType={params.type}
      />
    )
  }

  const supabase = await createClient()

  const { data: members } = await supabase
    .from('members')
    .select('id, name_en, name_ar, email')
    .order('name_en')

  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar')
    .eq('is_active', true)

  const { data: gymMemberships } = await supabase
    .from('gym_memberships')
    .select(`
      *,
      member:members(id, name_en, name_ar, email)
    `)
    .order('end_date', { ascending: true })

  const { data: ptPackages } = await supabase
    .from('pt_packages')
    .select(`
      *,
      member:members(id, name_en, name_ar, email),
      coach:coaches(id, name_en, name_ar)
    `)
    .order('created_at', { ascending: false })

  const { data: pricing } = await supabase
    .from('pricing')
    .select('*')
    .eq('is_active', true)

  return (
    <SubscriptionsManager
      members={members || []}
      coaches={coaches || []}
      gymMemberships={gymMemberships || []}
      ptPackages={ptPackages || []}
      pricing={pricing || []}
      defaultMemberId={params.member}
      defaultType={params.type}
    />
  )
}
