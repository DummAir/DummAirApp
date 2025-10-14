/**
 * Email Verification Service
 * Handles custom email verification and password reset tokens
 */

import { createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create email verification token
 */
export async function createVerificationToken(
  userId: string,
  email: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ token: string; expiresAt: Date }> {
  const supabase = await createServiceClient();
  const token = generateToken();
  const expiresAt = new Date();
  
  // Verification tokens expire in 24 hours
  // Password reset tokens expire in 1 hour
  expiresAt.setHours(expiresAt.getHours() + (type === 'email_verification' ? 24 : 1));

  const { error } = await supabase
    .from('email_verification_tokens')
    .insert({
      user_id: userId,
      email,
      token,
      type,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error('Failed to create verification token:', error);
    throw new Error('Failed to create verification token');
  }

  return { token, expiresAt };
}

/**
 * Verify token and mark user as verified
 */
export async function verifyToken(
  token: string,
  type: 'email_verification' | 'password_reset'
): Promise<{ valid: boolean; userId?: string; email?: string }> {
  const supabase = await createServiceClient();

  // Find token
  const { data: tokenData, error: tokenError } = await supabase
    .from('email_verification_tokens')
    .select('*')
    .eq('token', token)
    .eq('type', type)
    .is('used_at', null)
    .single();

  if (tokenError || !tokenData) {
    return { valid: false };
  }

  // Check if expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  
  if (now > expiresAt) {
    return { valid: false };
  }

  // Mark token as used
  await supabase
    .from('email_verification_tokens')
    .update({ used_at: now.toISOString() })
    .eq('id', tokenData.id);

  // If email verification, mark user as verified
  if (type === 'email_verification') {
    await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', tokenData.user_id);
  }

  return {
    valid: true,
    userId: tokenData.user_id,
    email: tokenData.email,
  };
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('users')
    .select('email_verified')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.email_verified || false;
}

