import { NextResponse } from 'next/server';
import { getToken } from '../../lib/auth';

export function middleware(req) {
  const token = getToken();
  const { pathname } = req.nextUrl;

  if (!token && pathname !== '/login' && pathname !== '/register') {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}