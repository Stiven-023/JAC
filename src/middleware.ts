import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  
  const { pathname } = req.nextUrl;

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/home', '/events', '/news', '/service', '/contact', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si no hay sesión y el usuario intenta acceder a una ruta protegida
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('message', 'Debes iniciar sesión para acceder a esta página');
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y el usuario intenta acceder al login, redirigir al home
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return res;
}


// Configurar qué rutas procesará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};