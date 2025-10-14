'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/dashboard');

  useEffect(() => {
    // Check for redirect parameter
    const redirect = searchParams.get('redirect');
    const step = searchParams.get('step');
    
    if (redirect === 'book') {
      setRedirectPath(`/book${step ? '?step=' + step : ''}`);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Call our API route to handle signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      console.log('✅ Account created successfully');

      // Auto-login the user after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('❌ Auto-login failed:', signInError);
        // Still show success, user can login manually
        setSuccess(true);
      } else {
        console.log('✅ Auto-login successful, redirecting to:', redirectPath);
        // Redirect to dashboard or booking flow
        router.push(redirectPath);
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after signup
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#111417] mb-3">Account Created Successfully!</h1>
            <p className="text-[#647287] mb-6">
              Welcome to DummAir! We&apos;ve sent a verification link to <strong className="text-[#111417]">{email}</strong>.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-[#111417] font-semibold mb-2">📧 Next Steps:</p>
              <ol className="text-sm text-[#647287] space-y-1 ml-4">
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link we sent</li>
                <li>3. You can login now or after verification!</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full bg-[#2472e0] text-white py-3 rounded-lg font-bold hover:bg-[#1e5bb8] transition-colors"
              >
                Go to Login
              </Link>
              <p className="text-xs text-[#647287]">
                Didn&apos;t receive the email? Check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-white flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
            <p className="text-[#111417]">Join DummAir today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#647287]" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0] transition-all placeholder:text-[#9ca3af] text-black font-semibold"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#647287]" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0] transition-all placeholder:text-[#9ca3af] text-black font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#647287]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0] transition-all placeholder:text-[#9ca3af] text-black font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#647287] hover:text-[#111417] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#647287]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-[#dce0e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2472e0] transition-all placeholder:text-[#9ca3af] text-black font-semibold"
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2472e0] text-white py-3 rounded-lg font-bold hover:bg-[#1e5bb8] transition-colors disabled:bg-[#dce0e5] disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#dce0e5]"></div>
            <span className="text-sm text-[#111417]">or</span>
            <div className="flex-1 h-px bg-[#dce0e5]"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[#111417] text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#2472e0] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <Loader2 size={48} className="mx-auto text-[#2472e0] mb-4 animate-spin" />
            <p className="text-[#647287]">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

