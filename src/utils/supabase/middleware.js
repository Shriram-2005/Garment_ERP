import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Define routes that should be protected
  const isProtectedRoute = request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/';
  
  if (!user && isProtectedRoute) {
    // No user, redirect to login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // RBAC checks for authenticated users
  if (user && isProtectedRoute) {
    // Always fetch the latest role from user_profiles to ensure it is accurate (especially after SQL migrations)
    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
    const roleString = profile?.role || user.user_metadata?.role || '';

    const isAdmin = roleString.toLowerCase().includes('admin');
    const isSuperAdmin = roleString.toUpperCase().includes('SUPER_ADMIN');
    
    // Extract the base module from path
    const pathParts = request.nextUrl.pathname.split('/').filter(Boolean);
    const baseModule = pathParts[0];

    // If Super Admin, force them to their dashboard
    if (isSuperAdmin) {
      if (baseModule !== 'settings' && baseModule !== 'api') {
        const url = request.nextUrl.clone();
        url.pathname = '/settings/companies';
        return NextResponse.redirect(url);
      }
    }

    // Allowed generic routes
    const genericRoutes = ['dashboard', 'export', 'api'];
    
    // Check if trying to access settings (Admin only)
    if (baseModule === 'settings') {
      if (request.nextUrl.pathname.startsWith('/settings/companies') && !isSuperAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }

    // Check module-specific access (if not generic and not admin)
    if (!isAdmin && !genericRoutes.includes(baseModule) && baseModule !== 'settings') {
      const allowedModules = roleString.split(',').map(m => m.trim().toLowerCase());
      if (!allowedModules.includes(baseModule.toLowerCase())) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse
}
