import { createClient } from '@/lib/supabase/server'
import { MemberForm } from '@/components/coach/member-form'
import { isDemoMode, demoCoach } from '@/lib/demo-data'

export default async function NewMemberPage() {
  // Check for demo mode
  const demoMode = await isDemoMode()
  if (demoMode === 'coach') {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Add New Member</h2>
          <p className="text-sm text-muted-foreground">
            Create a new member account with login credentials
          </p>
        </div>
        <MemberForm coaches={[demoCoach]} />
      </div>
    )
  }

  const supabase = await createClient()

  const { data: coaches } = await supabase
    .from('coaches')
    .select('id, name_en, name_ar')
    .eq('is_active', true)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-medium">Add New Member</h2>
        <p className="text-sm text-muted-foreground">
          Create a new member account with login credentials
        </p>
      </div>

      <MemberForm coaches={coaches || []} />
    </div>
  )
}
