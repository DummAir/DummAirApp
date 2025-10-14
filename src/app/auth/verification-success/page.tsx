'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#111417] mb-3">Email Verified!</h1>
          <p className="text-[#647287] mb-8">
            Your email has been successfully verified. You can now access all features of your DummAir account.
          </p>

          <Link
            href="/auth/login"
            className="block w-full bg-[#2472e0] text-white py-3 rounded-lg font-bold hover:bg-[#1e5bb8] transition-colors"
          >
            Login to Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

