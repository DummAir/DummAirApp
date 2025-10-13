'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft, Plane, MapPin, Calendar, Users } from 'lucide-react';
import { flightDetailsSchema, FlightDetailsFormData } from '@/lib/validation';
import Image from 'next/image';
import AirportAutocomplete from './AirportAutocomplete';

export default function FlightDetailsForm() {
  const { state, dispatch } = useBooking();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm<FlightDetailsFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(flightDetailsSchema) as any,
    mode: 'onChange',
    defaultValues: {
      from: '',
      to: '',
      departDate: '',
      returnDate: '',
      airlinePref: '',
      travelClass: '',
      numberOfTravelers: 1,
    }
  });


  const onSubmit = (data: FlightDetailsFormData) => {
    dispatch({
      type: 'SET_FLIGHT_DETAILS',
      payload: {
        from: data.from,
        to: data.to,
        departDate: data.departDate,
        returnDate: state.flightType === 'return' ? data.returnDate : undefined,
        airlinePref: data.airlinePref || undefined,
        travelClass: data.travelClass || undefined,
        numberOfTravelers: data.numberOfTravelers,
      }
    });
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-[#f8f9fa] lg:to-[#e9ecef]">
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8 lg:py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Left Column - Form (Mobile: Full Width, Desktop: Left Half) */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center bg-white p-4 pb-2 justify-between lg:bg-gradient-to-r lg:from-[#2472e0] lg:to-[#1e5bb8] lg:text-white lg:p-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[#111417] lg:text-white flex size-12 shrink-0 items-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#111417] lg:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                  Book a Flight
                </h2>
              </div>

              {/* Progress Indicator */}
              <div className="flex w-full flex-row items-center justify-center gap-3 py-5 lg:bg-white">
                <div className="h-2 w-2 rounded-full bg-[#111417] lg:bg-[#2472e0]"></div>
                <div className="h-2 w-2 rounded-full bg-[#111417] lg:bg-[#2472e0]"></div>
                <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
                <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
              </div>

              {/* Form Content */}
              <div className="lg:p-8 lg:space-y-6">
                {/* Departure City */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => (
                      <AirportAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Departure city or airport"
                        label="Departure City / Airport"
                        error={errors.from?.message}
                        icon="map"
                      />
                    )}
                  />
                </div>

                {/* Destination City */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <Controller
                    name="to"
                    control={control}
                    render={({ field }) => (
                      <AirportAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Destination city or airport"
                        label="Destination City / Airport"
                        error={errors.to?.message}
                        icon="plane"
                      />
                    )}
                  />
                </div>

                {/* Number of Travelers */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2 flex items-center gap-2">
                      <Users size={16} className="text-[#2472e0]" />
                      Number of Travelers
                    </p>
                    <select
                      {...register('numberOfTravelers', { valueAsNumber: true })}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 p-4 text-base font-normal leading-normal transition-all ${
                        errors.numberOfTravelers ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    >
                      <option value={1}>1 Traveler</option>
                      <option value={2}>2 Travelers</option>
                      <option value={3}>3 Travelers</option>
                      <option value={4}>4 Travelers</option>
                      <option value={5}>5 Travelers</option>
                      <option value={6}>6 Travelers</option>
                      <option value={7}>7 Travelers</option>
                      <option value={8}>8 Travelers</option>
                      <option value={9}>9 Travelers</option>
                      <option value={10}>10 Travelers</option>
                    </select>
                    {errors.numberOfTravelers && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.numberOfTravelers.message}</p>
                    )}
                    <p className="hidden lg:block text-[#647287] text-xs mt-1">
                      Select total number of people traveling
                    </p>
                  </label>
                </div>

                {/* Departure Date */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-[#2472e0]" />
                      Departure Date
                    </p>
                    <input
                      type="date"
                      placeholder="Departure date"
                      {...register('departDate')}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                        errors.departDate ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    />
                    {errors.departDate && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.departDate.message}</p>
                    )}
                  </label>
                </div>

                {/* Return Date (Conditional) */}
                {state.flightType === 'return' && (
                  <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-[#2472e0]" />
                        Return Date
                      </p>
                      <input
                        type="date"
                        placeholder="Return date"
                        {...register('returnDate')}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                          errors.returnDate ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                        }`}
                      />
                      {errors.returnDate && (
                        <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.returnDate.message}</p>
                      )}
                    </label>
                  </div>
                )}

                {/* Preferred Airline - Changed to Text Input */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2 flex items-center gap-2">
                      <Plane size={16} className="text-[#2472e0]" />
                      Preferred Airline <span className="text-[#647287] font-normal text-xs">(Optional)</span>
                    </p>
                    <input
                      type="text"
                      placeholder="e.g., Delta, United, Emirates (optional)"
                      {...register('airlinePref')}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5] h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all"
                    />
                    <p className="hidden lg:block text-[#647287] text-xs mt-1">
                      Type your preferred airline for this route
                    </p>
                  </label>
                </div>

                {/* Travel Class */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="hidden lg:block text-[#111417] text-sm font-semibold mb-2">
                      Travel Class <span className="text-[#647287] font-normal text-xs">(Optional)</span>
                    </p>
                    <select
                      {...register('travelClass')}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5] h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all"
                    >
                      <option value="">Class (optional)</option>
                      <option value="economy">Economy</option>
                      <option value="premium-economy">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="lg:p-8 lg:pt-0">
              <div className="flex px-4 lg:px-0 py-3">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`flex min-w-[84px] max-w-[480px] lg:max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 lg:h-14 px-5 flex-1 text-white text-base font-bold leading-normal tracking-[0.015em] ${
                    isValid 
                      ? 'bg-[#2472e0] hover:bg-[#1e5bb8] transition-all hover:shadow-lg hover:scale-[1.02]' 
                      : 'bg-[#dce0e5] cursor-not-allowed'
                  }`}
                >
                  <span className="truncate">Continue to Passenger Details</span>
                </button>
              </div>
              <div className="h-5 bg-white lg:hidden"></div>
            </div>
          </form>

          {/* Right Column - Interactive Image (Desktop Only) */}
          <div className="hidden lg:block lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Image Section */}
              <div className="relative h-80 overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop&q=80"
                  alt="Flight Booking"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Your Journey Starts Here</h3>
                  <p className="text-white/90">Fill in your flight details to get started</p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <Plane size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Fast Processing</h4>
                    <p className="text-sm text-[#647287]">Your dummy ticket will be ready within 1 hour after payment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Any Route</h4>
                    <p className="text-sm text-[#647287]">We support all major airports and airlines worldwide</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Flexible Dates</h4>
                    <p className="text-sm text-[#647287]">Choose any departure and return dates for your itinerary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
