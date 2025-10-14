import { NextResponse } from 'next/server';

/**
 * Simple endpoint to check environment variables
 */
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'NOT SET',
      RESEND_FROM_NAME: process.env.RESEND_FROM_NAME || 'NOT SET (using default)',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    },
    message: 'If you see NOT SET for any required variable, add it in Vercel and redeploy',
  });
}

