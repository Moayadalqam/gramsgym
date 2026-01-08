import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check for demo mode - bypass auth entirely
  const demoMode = request.cookies.get('demo_mode')?.value
  if (demoMode === 'member' || demoMode === 'coach') {
    return supabaseResponse
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip auth checks if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey || !supabaseAnonKey.startsWith('eyJ')) {
    console.warn('Supabase not configured properly. Skipping auth middleware.')
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected routes for coaches
  if (pathname.startsWith('/coach') && !pathname.startsWith('/coach/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/coach/login'
      return NextResponse.redirect(url)
    }

    // Verify user is a coach
    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!coach) {
      const url = request.nextUrl.clone()
      url.pathname = '/coach/login'
      return NextResponse.redirect(url)
    }
  }

  // Protected routes for members
  if (pathname.startsWith('/member') && !pathname.startsWith('/member/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/member/login'
      return NextResponse.redirect(url)
    }

    // Verify user is a member
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!member) {
      const url = request.nextUrl.clone()
      url.pathname = '/member/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in coaches away from login page
  if (pathname === '/coach/login' && user) {
    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)
      .single()

    if (coach) {
      const url = request.nextUrl.clone()
      url.pathname = '/coach/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in members away from login page
  if (pathname === '/member/login' && user) {
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('id', user.id)
      .single()

    if (member) {
      const url = request.nextUrl.clone()
      url.pathname = '/member/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
