import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');

  // Redirect to login page if no token is found and accessing a protected route
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Specify which routes to apply middleware to
export const config = {
  matcher: ['/dashboard/:path*'],
};
