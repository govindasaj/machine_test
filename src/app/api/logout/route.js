import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect('/login');
  response.cookies.set('token', '', { expires: new Date(0) });
  return response;
}
