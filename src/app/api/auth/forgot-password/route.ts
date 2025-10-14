import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createVerificationToken } from '@/lib/auth/verification';
import { sendAndLogEmail } from '@/lib/email/service';
import { getPasswordResetEmail } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    // Always return success to prevent email enumeration
    if (userError || !user) {
      console.log('User not found, but returning success to prevent enumeration');
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.',
      });
    }

    // Create password reset token
    console.log('🔑 Creating password reset token...');
    const { token } = await createVerificationToken(
      user.id,
      email,
      'password_reset'
    );
    console.log('✅ Reset token created');

    // Send password reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    console.log('📧 Sending password reset email...');
    console.log('   To:', email);
    console.log('   Reset URL:', resetUrl);
    console.log('   User name:', user.full_name || 'User');

    const emailResult = await sendAndLogEmail(
      {
        to: email,
        subject: 'Reset Your Password - DummAir',
        html: getPasswordResetEmail(resetUrl, user.full_name || 'User'),
      },
      {
        userId: user.id,
        emailType: 'password_reset',
        recipient: email,
        subject: 'Reset Your Password - DummAir',
      }
    );

    if (emailResult.success) {
      console.log('✅ Password reset email sent successfully to:', email);
      console.log('   Message ID:', emailResult.messageId);
    } else {
      console.error('❌ Failed to send password reset email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link shortly.',
    });

  } catch (error: unknown) {
    console.error('Password reset error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

