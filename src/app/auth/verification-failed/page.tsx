'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function VerificationFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';

  const getErrorMessage = () => {
    switch (reason) {
      case 'missing-token':
        return 'The verification link is incomplete. Please use the full link from your email.';
      case 'invalid-token':
        return 'This verification link is invalid or has expired. Please request a new verification email.';
      case 'error':
        return 'An error occurred during verification. Please try again or contact support.';
      default:
        return 'Verification failed. Please try again or contact support.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#111417] mb-3">Verification Failed</h1>
          <p className="text-[#647287] mb-8">
            {getErrorMessage()}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full bg-[#2472e0] text-white py-3 rounded-lg font-bold hover:bg-[#1e5bb8] transition-colors"
            >
              Go to Login
            </Link>
            <Link
              href="mailto:support@dummair.com"
              className="block text-[#2472e0] hover:underline text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificationFailedPage() {
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
      <VerificationFailedContent />
    </Suspense>
  );
}

