import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

interface MemberRow {
  name_en: string
  name_ar?: string
  email: string
  phone?: string
  whatsapp_number?: string
  membership_type?: 'monthly' | 'quarterly' | 'yearly'
  membership_start_date?: string
  membership_end_date?: string
  pt_sessions?: number
}

interface ImportResult {
  success: boolean
  totalRows: number
  imported: number
  failed: number
  errors: Array<{ row: number; error: string; data?: Partial<MemberRow> }>
}

export async function POST(request: NextRequest): Promise<NextResponse<ImportResult>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const coachId = formData.get('coach_id') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, totalRows: 0, imported: 0, failed: 0, errors: [{ row: 0, error: 'No file provided' }] },
        { status: 400 }
      )
    }

    // Read the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse Excel/CSV
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, totalRows: 0, imported: 0, failed: 0, errors: [{ row: 0, error: 'No data found in file' }] },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()
    const results: ImportResult = {
      success: true,
      totalRows: jsonData.length,
      imported: 0,
      failed: 0,
      errors: [],
    }

    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      const rowNum = i + 2 // Excel rows start at 1, plus header row

      try {
        // Map column names (support various formats)
        const memberData: MemberRow = {
          name_en: String(row['name_en'] || row['Name (English)'] || row['Name'] || row['name'] || '').trim(),
          name_ar: String(row['name_ar'] || row['Name (Arabic)'] || row['الاسم'] || '').trim() || undefined,
          email: String(row['email'] || row['Email'] || row['البريد الإلكتروني'] || '').trim().toLowerCase(),
          phone: String(row['phone'] || row['Phone'] || row['الهاتف'] || '').trim() || undefined,
          whatsapp_number: String(row['whatsapp'] || row['whatsapp_number'] || row['WhatsApp'] || row['واتساب'] || row['phone'] || row['Phone'] || '').trim() || undefined,
          membership_type: (String(row['membership_type'] || row['Membership Type'] || row['membership'] || '').trim().toLowerCase() || undefined) as MemberRow['membership_type'],
          membership_start_date: String(row['start_date'] || row['membership_start_date'] || row['Start Date'] || '').trim() || undefined,
          membership_end_date: String(row['end_date'] || row['membership_end_date'] || row['End Date'] || '').trim() || undefined,
          pt_sessions: row['pt_sessions'] || row['PT Sessions'] || row['sessions'] ? Number(row['pt_sessions'] || row['PT Sessions'] || row['sessions']) : undefined,
        }

        // Validate required fields
        if (!memberData.name_en) {
          results.errors.push({ row: rowNum, error: 'Name (English) is required', data: memberData })
          results.failed++
          continue
        }

        if (!memberData.email) {
          results.errors.push({ row: rowNum, error: 'Email is required', data: memberData })
          results.failed++
          continue
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(memberData.email)) {
          results.errors.push({ row: rowNum, error: 'Invalid email format', data: memberData })
          results.failed++
          continue
        }

        // Check if email already exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingMember } = await (supabase as any)
          .from('members')
          .select('id')
          .eq('email', memberData.email)
          .single()

        if (existingMember) {
          results.errors.push({ row: rowNum, error: `Email already exists: ${memberData.email}`, data: memberData })
          results.failed++
          continue
        }

        // Generate a random password for the member
        const password = generatePassword()

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: memberData.email,
          password,
          email_confirm: true,
        })

        if (authError || !authData.user) {
          results.errors.push({ row: rowNum, error: authError?.message || 'Failed to create user account', data: memberData })
          results.failed++
          continue
        }

        // Create member record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: memberError } = await (supabase as any).from('members').insert({
          id: authData.user.id,
          email: memberData.email,
          name_en: memberData.name_en,
          name_ar: memberData.name_ar || null,
          phone: memberData.phone || null,
          whatsapp_number: memberData.whatsapp_number || memberData.phone || null,
          assigned_coach_id: coachId || null,
          preferred_language: 'ar',
          notification_preference: 'whatsapp',
        })

        if (memberError) {
          // Rollback: delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id)
          results.errors.push({ row: rowNum, error: memberError.message, data: memberData })
          results.failed++
          continue
        }

        // Create gym membership if provided
        if (memberData.membership_type && memberData.membership_end_date) {
          const startDate = memberData.membership_start_date || new Date().toISOString().split('T')[0]

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('gym_memberships').insert({
            member_id: authData.user.id,
            type: memberData.membership_type,
            start_date: startDate,
            end_date: memberData.membership_end_date,
            status: new Date(memberData.membership_end_date) > new Date() ? 'active' : 'expired',
            price_paid: getMembershipPrice(memberData.membership_type),
          })
        }

        // Create PT package if sessions provided
        if (memberData.pt_sessions && memberData.pt_sessions > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('pt_packages').insert({
            member_id: authData.user.id,
            coach_id: coachId || null,
            total_sessions: memberData.pt_sessions,
            remaining_sessions: memberData.pt_sessions,
            status: 'active',
            price_paid: getPTPrice(memberData.pt_sessions),
          })
        }

        results.imported++
      } catch (error) {
        results.errors.push({
          row: rowNum,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: row as Partial<MemberRow>
        })
        results.failed++
      }
    }

    results.success = results.failed === 0

    return NextResponse.json(results)
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      {
        success: false,
        totalRows: 0,
        imported: 0,
        failed: 0,
        errors: [{ row: 0, error: error instanceof Error ? error.message : 'Import failed' }]
      },
      { status: 500 }
    )
  }
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

function getMembershipPrice(type: string): number {
  switch (type) {
    case 'monthly': return 35
    case 'quarterly': return 90
    case 'yearly': return 300
    default: return 0
  }
}

function getPTPrice(sessions: number): number {
  if (sessions <= 5) return 75
  if (sessions <= 10) return 140
  if (sessions <= 20) return 250
  return sessions * 12 // Bulk rate
}
