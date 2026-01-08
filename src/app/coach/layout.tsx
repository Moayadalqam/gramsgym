import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { CoachSidebar } from '@/components/coach/sidebar'
import { CoachHeader } from '@/components/coach/header'

// Demo coach data
const demoCoach = {
  id: 'demo-coach',
  email: 'coach@gramsgym.com',
  phone: '+962 79 999 8888',
  whatsapp_number: '+962 79 999 8888',
  name_en: 'Ahmad Grams',
  name_ar: 'أحمد جرامز',
  bio_en: 'Professional fitness coach with 10+ years of experience in strength training and body transformation.',
  bio_ar: 'مدرب لياقة بدنية محترف مع خبرة تزيد عن 10 سنوات في تدريب القوة وتحويل الجسم.',
  specialty_en: 'Strength & Conditioning',
  specialty_ar: 'القوة والتكييف',
  specialization: 'Strength Training',
  profile_photo_url: null,
  is_active: true,
  created_at: new Date().toISOString(),
}

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for demo mode
  const cookieStore = await cookies()
  const demoMode = cookieStore.get('demo_mode')?.value === 'coach'

  if (demoMode) {
    // Render with demo data
    return (
      <div className="min-h-screen bg-black">
        <CoachSidebar coach={demoCoach} />
        <div className="lg:pl-72">
          <CoachHeader coach={demoCoach} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    )
  }

  // Normal auth flow
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/coach/login')
  }

  // Get coach info
  const { data: coach } = await supabase
    .from('coaches')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!coach) {
    redirect('/coach/login')
  }

  return (
    <div className="min-h-screen bg-black">
      <CoachSidebar coach={coach} />
      <div className="lg:pl-72">
        <CoachHeader coach={coach} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
