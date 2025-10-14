import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verification';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/verification-failed?reason=missing-token', request.url)
      );
    }

    // Verify the token
    const result = await verifyToken(token, 'email_verification');

    if (!result.valid) {
      return NextResponse.redirect(
        new URL('/auth/verification-failed?reason=invalid-token', request.url)
      );
    }

    console.log('✅ Email verified for user:', result.userId);

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/auth/verification-success', request.url)
    );

  } catch (error) {
    console.error('❌ Email verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/verification-failed?reason=error', request.url)
    );
  }
}

