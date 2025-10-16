'use client';

import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft, CreditCard, Plane, Users, User, CheckCircle, Lock, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { countries } from '@/lib/countries';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function BookingReview() {
  const { state, dispatch } = useBooking();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [checkoutType, setCheckoutType] = useState<'guest' | 'login' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthentication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);
      setUserEmail(user.email || '');
      setCheckoutType('login'); // Auto-set for authenticated users
    }
  };

  const handleCheckoutTypeSelect = (type: 'guest' | 'login') => {
    if (type === 'login' && !isAuthenticated) {
      // Save current booking state and redirect to login
      // After login, user will be redirected back to continue booking
      router.push('/auth/login?redirect=book&step=4');
    } else {
      setCheckoutType(type);
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const handleEdit = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const handlePayment = () => {
    if (selectedPaymentMethod && checkoutType) {
      // Save payment provider and checkout type to context
      dispatch({ type: 'SET_PAYMENT_PROVIDER', payload: selectedPaymentMethod });
      dispatch({ type: 'SET_CHECKOUT_TYPE', payload: checkoutType });
      // Navigate to payment page
      dispatch({ type: 'SET_STEP', payload: 5 });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFlightTypeDisplay = () => {
    return state.flightType === 'one-way' ? 'One Way' : 'Round Trip';
  };

  const getBasePrice = () => {
    // Original prices: One-way $25, Round trip $45
    // 20% OFF Launch Promo: One-way $20, Round trip $36
    return state.flightType === 'one-way' ? 20 : 36;
  };

  const getOriginalPrice = () => {
    return state.flightType === 'one-way' ? 25 : 45;
  };

  const getTotalPrice = () => {
    const numberOfTravelers = state.flightDetails?.numberOfTravelers || 1;
    const basePrice = getBasePrice();
    const totalPrice = basePrice * numberOfTravelers;
    return totalPrice;
  };

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country?.name || code;
  };

  const paymentMethods = [
    { id: 'stripe', name: 'Stripe', description: 'Credit/Debit Card (Global)', icon: CreditCard },
    { id: 'flutterwave', name: 'Flutterwave', description: 'Multiple Payment Options', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-[#f8f9fa] lg:to-[#e9ecef]">
      <div className="lg:max-w-7xl lg:mx-auto lg:px-8 lg:py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Left Column - Review Details (Mobile: Full Width, Desktop: 3 columns) */}
          <div className="lg:col-span-3 bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden">
            {/* Header */}
            <div className="flex items-center bg-white p-4 pb-2 justify-between lg:bg-gradient-to-r lg:from-[#2472e0] lg:to-[#1e5bb8] lg:text-white lg:p-6">
              <button
                onClick={handleBack}
                className="text-[#111417] lg:text-white flex size-12 shrink-0 items-center hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-[#111417] lg:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                Review & Checkout
              </h2>
            </div>

            {/* Progress Indicator */}
            <div className="flex w-full flex-row items-center justify-center gap-3 py-5 lg:bg-white">
              <div className="h-2 w-2 rounded-full bg-[#2472e0]"></div>
              <div className="h-2 w-2 rounded-full bg-[#2472e0]"></div>
              <div className="h-2 w-2 rounded-full bg-[#2472e0]"></div>
              <div className="h-2 w-2 rounded-full bg-[#2472e0]"></div>
            </div>

            {/* Content */}
            <div className="lg:p-8 lg:space-y-6">
              {/* Flight Details Card */}
              <div className="px-4 lg:px-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#111417] text-lg font-bold flex items-center gap-2">
                    <Plane size={20} className="text-[#2472e0]" />
                    Flight Details
                  </h3>
                  <button
                    onClick={() => handleEdit(2)}
                    className="text-[#2472e0] text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="bg-gradient-to-r from-[#f0f2f4] to-white rounded-xl p-4 space-y-3 border border-[#dce0e5]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm">Route</span>
                    <span className="text-[#111417] font-semibold">
                      {state.flightDetails?.from} → {state.flightDetails?.to}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm">Type</span>
                    <span className="text-[#111417] font-semibold">{getFlightTypeDisplay()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm">Dates</span>
                    <span className="text-[#111417] font-semibold">
                      {state.flightDetails?.departDate && formatDate(state.flightDetails.departDate)}
                      {state.flightDetails?.returnDate && ` - ${formatDate(state.flightDetails.returnDate)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm">Class</span>
                    <span className="text-[#111417] font-semibold capitalize">
                      {state.flightDetails?.travelClass || 'Economy'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#647287] text-sm">Travelers</span>
                    <span className="text-[#111417] font-semibold">
                      {state.flightDetails?.numberOfTravelers || 1} {(state.flightDetails?.numberOfTravelers || 1) === 1 ? 'Person' : 'People'}
                    </span>
                  </div>
                  {state.flightDetails?.airlinePref && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#647287] text-sm">Airline Preference</span>
                      <span className="text-[#111417] font-semibold">{state.flightDetails.airlinePref}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Passengers Details Card */}
              <div className="px-4 lg:px-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#111417] text-lg font-bold flex items-center gap-2">
                    <Users size={20} className="text-[#2472e0]" />
                    Passenger Details
                  </h3>
                  <button
                    onClick={() => handleEdit(3)}
                    className="text-[#2472e0] text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-3">
                  {state.passengerDetails.map((passenger, index) => (
                    <div key={index} className="bg-gradient-to-r from-[#f0f2f4] to-white rounded-xl p-4 border border-[#dce0e5]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#2472e0] flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-[#111417] font-bold">{passenger.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-[#647287]">Gender:</span>
                          <span className="text-[#111417] ml-1 capitalize">{passenger.gender}</span>
                        </div>
                        <div>
                          <span className="text-[#647287]">DOB:</span>
                          <span className="text-[#111417] ml-1">{formatDate(passenger.dob)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#647287]">Email:</span>
                          <span className="text-[#111417] ml-1">{passenger.email}</span>
                        </div>
                        {passenger.phone && (
                          <div className="col-span-2">
                            <span className="text-[#647287]">Phone:</span>
                            <span className="text-[#111417] ml-1">
                              {passenger.phoneCountryCode || ''} {passenger.phone}
                            </span>
                          </div>
                        )}
                        {passenger.nationality && (
                          <div className="col-span-2">
                            <span className="text-[#647287]">Nationality:</span>
                            <span className="text-[#111417] ml-1">{getCountryName(passenger.nationality)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="px-4 lg:px-0">
                <h3 className="text-[#111417] text-lg font-bold mb-3 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#2472e0]" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedPaymentMethod === method.id
                            ? 'bg-blue-50 border-[#2472e0]'
                            : 'bg-white border-[#dce0e5] hover:border-[#2472e0]'
                        }`}
                      >
                        <div className={`flex items-center justify-center rounded-lg shrink-0 size-12 ${
                          selectedPaymentMethod === method.id ? 'bg-[#2472e0] text-white' : 'bg-[#f0f2f4] text-[#111417]'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#111417] font-semibold">{method.name}</p>
                          <p className="text-[#647287] text-sm">{method.description}</p>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <CheckCircle size={24} className="text-[#2472e0]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkout Options - Mobile (Only for non-authenticated users) */}
              {!isAuthenticated && (
                <div className="px-4 lg:hidden mt-6">
                  <h3 className="text-[#111417] text-lg font-bold mb-3 flex items-center gap-2">
                    <User size={20} className="text-[#2472e0]" />
                    Checkout As
                  </h3>
                  <div className="space-y-3">
                    {/* Guest Checkout */}
                    <div
                      onClick={() => handleCheckoutTypeSelect('guest')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutType === 'guest'
                          ? 'bg-blue-50 border-[#2472e0]'
                          : 'bg-white border-[#dce0e5] hover:border-[#2472e0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          checkoutType === 'guest' ? 'bg-[#2472e0] text-white' : 'bg-[#f0f2f4] text-[#111417]'
                        }`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-[#111417]">Guest Checkout</h5>
                          <p className="text-[#647287] text-sm">Quick checkout without account</p>
                        </div>
                        {checkoutType === 'guest' && (
                          <CheckCircle size={20} className="text-[#2472e0]" />
                        )}
                      </div>
                    </div>

                    {/* Login/Signup */}
                    <div
                      onClick={() => handleCheckoutTypeSelect('login')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutType === 'login'
                          ? 'bg-blue-50 border-[#2472e0]'
                          : 'bg-white border-[#dce0e5] hover:border-[#2472e0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          checkoutType === 'login' ? 'bg-[#2472e0] text-white' : 'bg-[#f0f2f4] text-[#111417]'
                        }`}>
                          <Lock size={20} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-[#111417]">Login / Sign Up</h5>
                          <p className="text-[#647287] text-sm">Track bookings & get offers</p>
                        </div>
                        {checkoutType === 'login' && (
                          <CheckCircle size={20} className="text-[#2472e0]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Authenticated User Info - Mobile */}
              {isAuthenticated && (
                <div className="px-4 lg:hidden mt-6">
                  <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-[#111417]">Logged In</h5>
                        <p className="text-[#647287] text-sm">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom Buttons */}
            <div className="lg:hidden px-4 py-4 border-t border-[#dce0e5]">
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || !checkoutType}
                className={`w-full h-12 rounded-lg text-white font-bold transition-all ${
                  selectedPaymentMethod && checkoutType
                    ? 'bg-[#2472e0] hover:bg-[#1e5bb8]'
                    : 'bg-[#dce0e5] cursor-not-allowed'
                }`}
              >
                Continue to Payment • ${getTotalPrice()}
              </button>
            </div>
          </div>

          {/* Right Column - Checkout Options (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Price Summary */}
              <div className="relative h-48 overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=400&fit=crop&q=80"
                  alt="Checkout"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-[#ffc107] text-[#111417] font-bold px-4 py-2 rounded-full text-sm shadow-lg animate-pulse">
                  🎉 20% OFF Launch Promo
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-white/80 text-sm mb-1">Total Amount</p>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-2xl line-through text-white/50">${getOriginalPrice() * (state.flightDetails?.numberOfTravelers || 1)}</span>
                    <h3 className="text-4xl font-bold">${getTotalPrice()}</h3>
                  </div>
                  <p className="text-white/70 text-sm">
                    {state.flightDetails?.numberOfTravelers || 1} × ${getBasePrice()} per ticket
                  </p>
                  <p className="text-[#ffc107] text-xs font-semibold mt-2">
                    You save ${(getOriginalPrice() - getBasePrice()) * (state.flightDetails?.numberOfTravelers || 1)}!
                  </p>
                </div>
              </div>

              {/* Checkout Options or Authenticated User Info */}
              <div className="p-6 space-y-4">
                {!isAuthenticated ? (
                  <>
                    <h4 className="text-[#111417] font-bold text-lg mb-4">Choose Checkout Option</h4>

                    {/* Guest Checkout */}
                    <div
                      onClick={() => handleCheckoutTypeSelect('guest')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutType === 'guest'
                          ? 'bg-blue-50 border-[#2472e0]'
                          : 'bg-white border-[#dce0e5] hover:border-[#2472e0]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          checkoutType === 'guest' ? 'bg-[#2472e0] text-white' : 'bg-[#f0f2f4] text-[#111417]'
                        }`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-[#111417]">Guest Checkout</h5>
                            {checkoutType === 'guest' && <CheckCircle size={20} className="text-[#2472e0]" />}
                          </div>
                          <p className="text-sm text-[#647287]">Quick checkout without creating an account</p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              Faster checkout process
                            </li>
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              No registration required
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Login/Signup */}
                    <div
                      onClick={() => handleCheckoutTypeSelect('login')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutType === 'login'
                          ? 'bg-blue-50 border-[#2472e0]'
                          : 'bg-white border-[#dce0e5] hover:border-[#2472e0]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          checkoutType === 'login' ? 'bg-[#2472e0] text-white' : 'bg-[#f0f2f4] text-[#111417]'
                        }`}>
                          <UserPlus size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-[#111417]">Login / Sign Up</h5>
                            {checkoutType === 'login' && <CheckCircle size={20} className="text-[#2472e0]" />}
                          </div>
                          <p className="text-sm text-[#647287]">Create account or login for extra benefits</p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              Track all your bookings
                            </li>
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              Save passenger details
                            </li>
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              Exclusive offers & discounts
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-[#111417] font-bold text-lg mb-4">Account</h4>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={28} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-[#111417] mb-1">Logged In</h5>
                          <p className="text-sm text-[#647287] mb-3">{userEmail}</p>
                          <ul className="space-y-2">
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-600" />
                              Order will be saved to your account
                            </li>
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-600" />
                              View all orders in your dashboard
                            </li>
                            <li className="text-xs text-[#647287] flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-600" />
                              Track booking status in real-time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Security Note */}
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <div className="flex items-start gap-3">
                    <Lock size={16} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Secure Payment</p>
                      <p className="text-xs text-green-700 mt-1">
                        Your payment is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || !checkoutType}
                  className={`w-full h-14 rounded-lg text-white font-bold text-lg transition-all mt-6 ${
                    selectedPaymentMethod && checkoutType
                      ? 'bg-[#2472e0] hover:bg-[#1e5bb8] hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-[#dce0e5] cursor-not-allowed'
                  }`}
                >
                  Continue to Payment • ${getTotalPrice()}
                </button>

                {/* Delivery Info */}
                <div className="text-center pt-4 border-t border-[#dce0e5]">
                  <p className="text-xs text-[#647287]">
                    ⚡ Your dummy ticket will be delivered via email within <strong>1 hour</strong>
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
