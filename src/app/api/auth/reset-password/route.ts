import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verification';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify the token
    const result = await verifyToken(token, 'password_reset');

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Update password in Supabase Auth using service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      result.userId!,
      { password }
    );

    if (updateError) {
      console.error('Failed to update password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    console.log('✅ Password reset successful for user:', result.userId);

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });

  } catch (error: unknown) {
    console.error('Password reset error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

