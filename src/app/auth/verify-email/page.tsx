'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      router.push('/auth/verification-failed?reason=missing-token');
      return;
    }

    // Trigger verification
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        setIsVerifying(false);
      })
      .catch(() => {
        setIsVerifying(false);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2472e0] to-[#1e5bb8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {isVerifying && (
            <>
              <Loader2 size={48} className="mx-auto text-[#2472e0] mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-[#111417] mb-3">Verifying Your Email...</h1>
              <p className="text-[#647287]">
                Please wait while we verify your email address.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

