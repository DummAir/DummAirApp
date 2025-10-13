'use client';

import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft } from 'lucide-react';

export default function FlightTypeSelection() {
  const { dispatch } = useBooking();

  const handleFlightTypeSelect = (type: 'one-way' | 'return') => {
    dispatch({ type: 'SET_FLIGHT_TYPE', payload: type });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <button
            onClick={handleBack}
            className="text-[#111417] flex size-12 shrink-0 items-center"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-[#111417] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            New Booking
          </h2>
        </div>

        {/* Progress Indicator */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
          <div className="h-2 w-2 rounded-full bg-[#111417]"></div>
          <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
          <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
          <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
        </div>

        {/* Title */}
        <h1 className="text-[#111417] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
          Select Flight Type
        </h1>

        {/* Flight Type Options */}
        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-[2_2_0px] flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#111417] text-base font-bold leading-tight">One-way</p>
                <p className="text-[#647287] text-sm font-normal leading-normal">
                  Fly to your destination without a return flight.
                </p>
              </div>
              <button
                onClick={() => handleFlightTypeSelect('one-way')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111417] text-sm font-medium leading-normal w-fit hover:bg-[#e0e4e8] transition-colors"
              >
                <span className="truncate">Select</span>
              </button>
            </div>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop")'
              }}
            ></div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
            <div className="flex flex-[2_2_0px] flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[#111417] text-base font-bold leading-tight">Return</p>
                <p className="text-[#647287] text-sm font-normal leading-normal">
                  Book a round-trip flight with a return date.
                </p>
              </div>
              <button
                onClick={() => handleFlightTypeSelect('return')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111417] text-sm font-medium leading-normal w-fit hover:bg-[#e0e4e8] transition-colors"
              >
                <span className="truncate">Select</span>
              </button>
            </div>
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&h=300&fit=crop")'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-5 bg-white"></div>
    </>
  );
}
