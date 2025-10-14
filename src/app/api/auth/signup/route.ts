import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { createVerificationToken } from '@/lib/auth/verification';
import { sendAndLogEmail } from '@/lib/email/service';
import { getEmailVerificationEmail } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Sign up user with Supabase Auth (with auto-confirm using admin API)
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

    // Create user with admin API (bypasses email confirmation)
    const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Use service role client to create user record (bypasses RLS)
    const serviceClient = await createServiceClient();

    console.log('Creating user record for:', authData.user.id);

    const { data: insertedUser, error: userError } = await serviceClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: name,
        password_hash: '', // Don't store password, Supabase Auth handles it
        role: 'user',
        email_verified: false, // Not verified yet
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user record:', userError);
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ User record created:', insertedUser);

    // Create verification token
    console.log('📧 Creating verification token...');
    const { token } = await createVerificationToken(
      authData.user.id,
      email,
      'email_verification'
    );
    console.log('✅ Verification token created');

    // Send verification email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;

    console.log('📧 Sending verification email...');
    console.log('   To:', email);
    console.log('   Verification URL:', verificationUrl);

    const emailResult = await sendAndLogEmail(
      {
        to: email,
        subject: 'Verify Your Email - Welcome to DummAir!',
        html: getEmailVerificationEmail(verificationUrl, name),
      },
      {
        userId: authData.user.id,
        emailType: 'welcome',
        recipient: email,
        subject: 'Verify Your Email - Welcome to DummAir!',
      }
    );

    if (emailResult.success) {
      console.log('✅ Verification email sent successfully to:', email);
      console.log('   Message ID:', emailResult.messageId);
    } else {
      console.error('❌ Failed to send verification email:', emailResult.error);
      // Continue anyway - user can still login
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Check your email for verification link.',
      emailSent: emailResult.success,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });

  } catch (error: unknown) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

