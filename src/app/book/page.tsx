'use client';

import { BookingProvider } from '@/contexts/BookingContext';
import BookingFlow from '@/components/BookingFlow';

export default function BookPage() {
  return (
    <BookingProvider>
      <BookingFlow />
    </BookingProvider>
  );
}

