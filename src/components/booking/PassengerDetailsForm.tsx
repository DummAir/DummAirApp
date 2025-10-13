'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBooking, PassengerDetails } from '@/contexts/BookingContext';
import { ArrowLeft, User, Mail, Phone, Globe, Calendar, Shield } from 'lucide-react';
import { passengerDetailsSchema, PassengerDetailsFormData } from '@/lib/validation';
import { countries } from '@/lib/countries';
import Image from 'next/image';

export default function PassengerDetailsForm() {
  const { state, dispatch } = useBooking();
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [passengersData, setPassengersData] = useState<PassengerDetailsFormData[]>([]);
  
  const numberOfTravelers = state.flightDetails?.numberOfTravelers || 1;
  const isLastPassenger = currentPassengerIndex === numberOfTravelers - 1;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<PassengerDetailsFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(passengerDetailsSchema) as any,
    mode: 'onChange',
    defaultValues: passengersData[currentPassengerIndex] || {
      name: '',
      gender: '',
      dob: '',
      email: '',
      phone: '',
      phoneCountryCode: '+1',
      nationality: '',
    }
  });

  const selectedPhoneCode = watch('phoneCountryCode');

  const onSubmit = (data: PassengerDetailsFormData): void => {
    // Save current passenger data
    const updatedPassengers = [...passengersData];
    updatedPassengers[currentPassengerIndex] = data;
    setPassengersData(updatedPassengers);

    if (isLastPassenger) {
      // All passengers filled, proceed to next step
      const normalizedPassengers: PassengerDetails[] = updatedPassengers.map(p => ({
        name: p.name,
        gender: p.gender,
        dob: p.dob,
        email: p.email,
        phone: p.phone || undefined,
        phoneCountryCode: p.phoneCountryCode || undefined,
        nationality: p.nationality || undefined,
      }));
      
      dispatch({
        type: 'SET_PASSENGER_DETAILS',
        payload: normalizedPassengers
      });
      dispatch({ type: 'SET_STEP', payload: 4 });
    } else {
      // Move to next passenger
      setCurrentPassengerIndex(currentPassengerIndex + 1);
      // Reset form with next passenger data or empty
      reset(updatedPassengers[currentPassengerIndex + 1] || {
        name: '',
        gender: '',
        dob: '',
        email: '',
        phone: '',
        phoneCountryCode: '+1',
        nationality: '',
      });
    }
  };

  const handleBack = () => {
    if (currentPassengerIndex > 0) {
      // Go to previous passenger
      setCurrentPassengerIndex(currentPassengerIndex - 1);
      reset(passengersData[currentPassengerIndex - 1] || {
        name: '',
        gender: '',
        dob: '',
        email: '',
        phone: '',
        phoneCountryCode: '+1',
        nationality: '',
      });
    } else {
      // Go back to flight details
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
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
                  Passenger {currentPassengerIndex + 1} of {numberOfTravelers}
                </h2>
              </div>

              {/* Progress Indicator */}
              <div className="flex w-full flex-row items-center justify-center gap-3 py-5 lg:bg-white">
                <div className="h-2 w-2 rounded-full bg-[#111417] lg:bg-[#2472e0]"></div>
                <div className="h-2 w-2 rounded-full bg-[#111417] lg:bg-[#2472e0]"></div>
                <div className="h-2 w-2 rounded-full bg-[#111417] lg:bg-[#2472e0]"></div>
                <div className="h-2 w-2 rounded-full bg-[#dce0e5]"></div>
              </div>

              {/* Passenger Counter */}
              {numberOfTravelers > 1 && (
                <div className="px-4 lg:px-8 pb-4">
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: numberOfTravelers }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 max-w-[60px] rounded-full transition-all ${
                          i === currentPassengerIndex
                            ? 'bg-[#2472e0]'
                            : i < currentPassengerIndex
                            ? 'bg-green-500'
                            : 'bg-[#dce0e5]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-[#647287] mt-2">
                    {currentPassengerIndex + 1} of {numberOfTravelers} passengers
                  </p>
                </div>
              )}

              {/* Form Content */}
              <div className="lg:p-8 lg:space-y-6">
                {/* Full Name */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <User size={16} className="hidden lg:block text-[#2472e0]" />
                      Full Name
                    </p>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      {...register('name')}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                        errors.name ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.name.message}</p>
                    )}
                  </label>
                </div>

                {/* Gender */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <User size={16} className="hidden lg:block text-[#2472e0]" />
                      Gender
                    </p>
                    <select
                      {...register('gender')}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                        errors.gender ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.gender.message}</p>
                    )}
                  </label>
                </div>

                {/* Date of Birth */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <Calendar size={16} className="hidden lg:block text-[#2472e0]" />
                      Date of Birth
                    </p>
                    <input
                      type="date"
                      placeholder="DD/MM/YYYY"
                      {...register('dob')}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                        errors.dob ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.dob.message}</p>
                    )}
                    <p className="hidden lg:block text-[#647287] text-xs mt-1">
                      Must be 18 years or older
                    </p>
                  </label>
                </div>

                {/* Email Address */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <Mail size={16} className="hidden lg:block text-[#2472e0]" />
                      Email Address
                    </p>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      {...register('email')}
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                        errors.email ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.email.message}</p>
                    )}
                    <p className="hidden lg:block text-[#647287] text-xs mt-1">
                      Ticket will be sent to this email
                    </p>
                  </label>
                </div>

                {/* Phone Number with Country Code */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <Phone size={16} className="hidden lg:block text-[#2472e0]" />
                      Phone Number
                    </p>
                    <div className="flex gap-2">
                      {/* Country Code Selector */}
                      <select
                        {...register('phoneCountryCode')}
                        className="form-input flex w-[140px] resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5] h-14 p-3 text-sm font-normal leading-normal transition-all"
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.phoneCode}>
                            {country.phoneCode} {country.code}
                          </option>
                        ))}
                      </select>
                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        {...register('phone')}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all ${
                          errors.phone ? 'bg-red-50 border border-red-200' : 'bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5]'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 px-4 lg:px-0">{errors.phone.message}</p>
                    )}
                    <p className="hidden lg:block text-[#647287] text-xs mt-1">
                      {selectedPhoneCode && `Format: ${selectedPhoneCode} XXX XXX XXXX`}
                    </p>
                  </label>
                </div>

                {/* Nationality */}
                <div className="flex max-w-[480px] lg:max-w-none flex-wrap items-end gap-4 px-4 lg:px-0 py-3 lg:py-0">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base lg:text-sm font-medium lg:font-semibold leading-normal pb-2 flex items-center gap-2">
                      <Globe size={16} className="hidden lg:block text-[#2472e0]" />
                      Nationality <span className="text-[#647287] font-normal text-xs">(Optional)</span>
                    </p>
                    <select
                      {...register('nationality')}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-2 focus:ring-[#2472e0] border-none bg-[#f0f2f4] lg:bg-white lg:border lg:border-[#dce0e5] h-14 placeholder:text-[#647287] p-4 text-base font-normal leading-normal transition-all"
                    >
                      <option value="">Select nationality</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
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
                  <span className="truncate">
                    {isLastPassenger ? 'Continue to Review' : `Next Passenger (${currentPassengerIndex + 2}/${numberOfTravelers})`}
                  </span>
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
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop&q=80"
                  alt="Passenger Information"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Passenger {currentPassengerIndex + 1} Details</h3>
                  <p className="text-white/90">Provide accurate information for each traveler</p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Secure & Private</h4>
                    <p className="text-sm text-[#647287]">All passenger information is encrypted and protected</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Email Delivery</h4>
                    <p className="text-sm text-[#647287]">Tickets sent to each passenger&apos;s email within 1 hour</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#f0f2f4] to-white rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[#2472e0] flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#111417] mb-1">Match Passport</h4>
                    <p className="text-sm text-[#647287]">Names must exactly match passports for visa applications</p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-[#2472e0] rounded">
                  <p className="text-sm text-[#111417] font-medium mb-1">💡 Group Booking Tip</p>
                  <p className="text-xs text-[#647287]">
                    {numberOfTravelers > 1 
                      ? `You're booking for ${numberOfTravelers} travelers. Fill details for each passenger carefully.`
                      : 'Make sure all details are accurate and match official documents.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
