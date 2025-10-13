import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

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

    // Create Supabase client for auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
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
    const serviceClient = createServiceClient();

    console.log('Creating user record for:', authData.user.id);

    const { data: insertedUser, error: userError } = await serviceClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        password_hash: '', // Don't store password, Supabase Auth handles it
        role: 'user',
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user record:', userError);
      // Return error - user must be in users table for orders to work
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ User record created:', insertedUser);

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
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

