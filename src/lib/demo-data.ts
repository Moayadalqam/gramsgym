import { cookies } from 'next/headers'

// Check if demo mode is active
export async function isDemoMode(): Promise<'member' | 'coach' | false> {
  const cookieStore = await cookies()
  const demoMode = cookieStore.get('demo_mode')?.value
  if (demoMode === 'member') return 'member'
  if (demoMode === 'coach') return 'coach'
  return false
}

// Demo member data
export const demoMember = {
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
}

// Demo coach data
export const demoCoach = {
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

// Demo bookings
export const demoBookings = [
  {
    id: 'demo-booking-1',
    member_id: 'demo-member',
    coach_id: 'demo-coach',
    pt_package_id: 'demo-package-1',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration_minutes: 60,
    status: 'scheduled' as const,
    notes: 'Focus on upper body',
    created_at: new Date().toISOString(),
    coach: demoCoach,
    member: demoMember,
  },
  {
    id: 'demo-booking-2',
    member_id: 'demo-member',
    coach_id: 'demo-coach',
    pt_package_id: 'demo-package-1',
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    duration_minutes: 60,
    status: 'scheduled' as const,
    notes: 'Leg day',
    created_at: new Date().toISOString(),
    coach: demoCoach,
    member: demoMember,
  },
  {
    id: 'demo-booking-3',
    member_id: 'demo-member',
    coach_id: 'demo-coach',
    pt_package_id: 'demo-package-1',
    scheduled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    duration_minutes: 60,
    status: 'completed' as const,
    notes: 'Great session!',
    created_at: new Date().toISOString(),
    coach: demoCoach,
    member: demoMember,
  },
]

// Demo gym membership
export const demoGymMembership = {
  id: 'demo-membership-1',
  member_id: 'demo-member',
  type: 'quarterly' as const,
  start_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  price_paid: 150,
  status: 'active' as const,
  created_at: new Date().toISOString(),
}

// Demo PT package
export const demoPTPackage = {
  id: 'demo-package-1',
  member_id: 'demo-member',
  coach_id: 'demo-coach',
  total_sessions: 16,
  remaining_sessions: 12,
  price_paid: 400,
  purchased_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active' as const,
  created_at: new Date().toISOString(),
  coach: demoCoach,
}

// Demo coach availability
export const demoAvailability = [
  { id: '1', coach_id: 'demo-coach', day_of_week: 0, start_time: '09:00', end_time: '17:00', is_available: true, created_at: new Date().toISOString() },
  { id: '2', coach_id: 'demo-coach', day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true, created_at: new Date().toISOString() },
  { id: '3', coach_id: 'demo-coach', day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true, created_at: new Date().toISOString() },
  { id: '4', coach_id: 'demo-coach', day_of_week: 3, start_time: '09:00', end_time: '17:00', is_available: true, created_at: new Date().toISOString() },
  { id: '5', coach_id: 'demo-coach', day_of_week: 4, start_time: '09:00', end_time: '17:00', is_available: true, created_at: new Date().toISOString() },
  { id: '6', coach_id: 'demo-coach', day_of_week: 5, start_time: '10:00', end_time: '14:00', is_available: true, created_at: new Date().toISOString() },
  { id: '7', coach_id: 'demo-coach', day_of_week: 6, start_time: '00:00', end_time: '00:00', is_available: false, created_at: new Date().toISOString() },
]

// Demo members list (for coach view)
export const demoMembers = [
  {
    ...demoMember,
    coach: demoCoach,
    gym_memberships: [demoGymMembership],
    pt_packages: [demoPTPackage],
  },
  {
    id: 'demo-member-2',
    email: 'sara@demo.com',
    phone: '+962 79 234 5678',
    whatsapp_number: '+962 79 234 5678',
    name_en: 'Sara Ahmed',
    name_ar: 'سارة أحمد',
    bio_en: null,
    bio_ar: null,
    profile_photo_url: null,
    assigned_coach_id: 'demo-coach',
    preferred_language: 'ar' as const,
    notification_preference: 'both' as const,
    created_at: new Date().toISOString(),
    coach: demoCoach,
    gym_memberships: [{
      id: 'demo-membership-2',
      member_id: 'demo-member-2',
      type: 'monthly' as const,
      start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      price_paid: 60,
      status: 'active' as const,
      created_at: new Date().toISOString(),
    }],
    pt_packages: [{
      id: 'demo-package-2',
      member_id: 'demo-member-2',
      coach_id: 'demo-coach',
      total_sessions: 8,
      remaining_sessions: 5,
      price_paid: 200,
      purchased_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active' as const,
      created_at: new Date().toISOString(),
      coach: demoCoach,
    }],
  },
]

// Demo pricing
export const demoPricing = [
  { id: '1', name_en: 'Monthly Membership', name_ar: 'اشتراك شهري', type: 'gym_membership' as const, duration_or_sessions: '1 month', price: 60, is_active: true, updated_at: new Date().toISOString() },
  { id: '2', name_en: 'Quarterly Membership', name_ar: 'اشتراك ربع سنوي', type: 'gym_membership' as const, duration_or_sessions: '3 months', price: 150, is_active: true, updated_at: new Date().toISOString() },
  { id: '3', name_en: 'Yearly Membership', name_ar: 'اشتراك سنوي', type: 'gym_membership' as const, duration_or_sessions: '12 months', price: 500, is_active: true, updated_at: new Date().toISOString() },
  { id: '4', name_en: '8 PT Sessions', name_ar: '8 جلسات تدريب', type: 'pt_package' as const, duration_or_sessions: '8 sessions', price: 200, is_active: true, updated_at: new Date().toISOString() },
  { id: '5', name_en: '16 PT Sessions', name_ar: '16 جلسة تدريب', type: 'pt_package' as const, duration_or_sessions: '16 sessions', price: 400, is_active: true, updated_at: new Date().toISOString() },
]

// Demo gym settings
export const demoGymSettings = {
  id: 'demo-gym',
  name_en: 'Grams Gym',
  name_ar: 'جرامز جيم',
  description_en: 'Premium fitness center with state-of-the-art equipment',
  description_ar: 'مركز لياقة بدنية متميز بأحدث المعدات',
  address_en: 'Amman, Jordan',
  address_ar: 'عمان، الأردن',
  phone: '+962 79 999 8888',
  email: 'info@gramsgym.com',
  instagram: '@gramsgym',
  whatsapp: '+962 79 999 8888',
  created_at: new Date().toISOString(),
}

// Demo working hours
export const demoWorkingHours = [
  { id: '1', day_of_week: 0, open_time: '06:00', close_time: '23:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '2', day_of_week: 1, open_time: '06:00', close_time: '23:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '3', day_of_week: 2, open_time: '06:00', close_time: '23:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '4', day_of_week: 3, open_time: '06:00', close_time: '23:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '5', day_of_week: 4, open_time: '06:00', close_time: '23:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '6', day_of_week: 5, open_time: '08:00', close_time: '20:00', is_closed: false, created_at: new Date().toISOString() },
  { id: '7', day_of_week: 6, open_time: '08:00', close_time: '20:00', is_closed: false, created_at: new Date().toISOString() },
]

// Demo gym memberships for coach view
export const demoGymMemberships = [
  { ...demoGymMembership, member: demoMember },
  {
    id: 'demo-membership-2',
    member_id: 'demo-member-2',
    type: 'monthly' as const,
    start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    price_paid: 60,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    member: demoMembers[1],
  },
]

// Demo PT packages for coach view
export const demoPTPackages = [
  { ...demoPTPackage, member: demoMember, coach: demoCoach },
  {
    id: 'demo-package-2',
    member_id: 'demo-member-2',
    coach_id: 'demo-coach',
    total_sessions: 8,
    remaining_sessions: 5,
    price_paid: 200,
    purchased_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active' as const,
    created_at: new Date().toISOString(),
    member: demoMembers[1],
    coach: demoCoach,
  },
]
