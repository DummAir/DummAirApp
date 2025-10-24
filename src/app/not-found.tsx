import Link from 'next/link';
import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2472e0] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#111417] mb-4">Page Not Found</h2>
        <p className="text-[#647287] mb-8 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-x-4">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#2472e0] text-white rounded-lg hover:bg-[#1e5bb8] transition-colors"
          >
            Go Home
          </Link>
          <Link 
            href="/book"
            className="inline-flex items-center px-6 py-3 border border-[#2472e0] text-[#2472e0] rounded-lg hover:bg-[#2472e0] hover:text-white transition-colors"
          >
            Book Flight
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2472e0]"></div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}
