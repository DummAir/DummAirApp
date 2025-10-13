'use client';

import { useBooking } from '@/contexts/BookingContext';
import FlightTypeSelection from './booking/FlightTypeSelection';
import FlightDetailsForm from './booking/FlightDetailsForm';
import PassengerDetailsForm from './booking/PassengerDetailsForm';
import BookingReview from './booking/BookingReview';
import PaymentPage from './booking/PaymentPage';

export default function BookingFlow() {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <FlightTypeSelection />;
      case 2:
        return <FlightDetailsForm />;
      case 3:
        return <PassengerDetailsForm />;
      case 4:
        return <BookingReview />;
      case 5:
        return <PaymentPage />;
      default:
        return <FlightTypeSelection />;
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden font-[Inter,'Noto_Sans',sans-serif]">
      {renderStep()}
    </div>
  );
}

