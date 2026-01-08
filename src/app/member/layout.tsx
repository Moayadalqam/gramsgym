import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { MemberSidebar } from '@/components/member/sidebar'
import { MemberHeader } from '@/components/member/header'

// Demo member data
const demoMember = {
  id: 'demo-member',
  email: 'ahmad@demo.com',
  phone: '+962 79 123 4567',
  whatsapp_number: '+962 79 123 4567',
  name_en: 'Ahmad Khalil',
  name_ar: 'أحمد خليل',
  bio_en: null,
  bio_ar: null,
  profile_photo_url: null,
  assigned_coach_id: 'demo-coach',
  preferred_language: 'en' as const,
  notification_preference: 'whatsapp' as const,
  created_at: new Date().toISOString(),
  coach: {
    id: 'demo-coach',
    email: 'coach@gramsgym.com',
    phone: '+962 79 999 8888',
    whatsapp_number: '+962 79 999 8888',
    name_en: 'Ahmad Grams',
    name_ar: 'أحمد جرامز',
    bio_en: 'Professional fitness coach with 10+ years of experience.',
    bio_ar: 'مدرب لياقة بدنية محترف.',
    specialty_en: 'Strength & Conditioning',
    specialty_ar: 'القوة والتكييف',
    specialization: 'Strength Training',
    profile_photo_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
}

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for demo mode
  const cookieStore = await cookies()
  const demoMode = cookieStore.get('demo_mode')?.value === 'member'

  if (demoMode) {
    // Render with demo data
    return (
      <div className="min-h-screen bg-black">
        <MemberSidebar member={demoMember} />
        <div className="lg:pl-72">
          <MemberHeader member={demoMember} />
          <main className="p-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Normal auth flow
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/member/login')
  }

  // Get member data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: member } = await (supabase as any)
    .from('members')
    .select(`
      *,
      coach:coaches(id, name_en, name_ar, profile_photo_url)
    `)
    .eq('id', user.id)
    .single()

  if (!member) {
    redirect('/member/login')
  }

  return (
    <div className="min-h-screen bg-black">
      <MemberSidebar member={member} />
      <div className="lg:pl-72">
        <MemberHeader member={member} />
        <main className="p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
