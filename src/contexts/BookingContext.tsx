'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FlightDetails {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  airlinePref?: string;
  travelClass?: string;
  numberOfTravelers: number;
}

export interface PassengerDetails {
  name: string;
  gender: string;
  dob: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  nationality?: string;
}

export interface BookingState {
  step: number;
  flightType: 'one-way' | 'return' | null;
  flightDetails: FlightDetails | null;
  passengerDetails: PassengerDetails[];
  selectedPaymentProvider: string | null;
  checkoutType: 'guest' | 'login' | null;
  orderId: string | null;
  orderNumber: string | null;
}

type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_FLIGHT_TYPE'; payload: 'one-way' | 'return' }
  | { type: 'SET_FLIGHT_DETAILS'; payload: FlightDetails }
  | { type: 'SET_PASSENGER_DETAILS'; payload: PassengerDetails[] }
  | { type: 'SET_PAYMENT_PROVIDER'; payload: string }
  | { type: 'SET_CHECKOUT_TYPE'; payload: 'guest' | 'login' }
  | { type: 'SET_ORDER_INFO'; payload: { orderId: string; orderNumber: string } }
  | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
  step: 1,
  flightType: null,
  flightDetails: null,
  passengerDetails: [],
  selectedPaymentProvider: null,
  checkoutType: null,
  orderId: null,
  orderNumber: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_FLIGHT_TYPE':
      return { ...state, flightType: action.payload };
    case 'SET_FLIGHT_DETAILS':
      return { ...state, flightDetails: action.payload };
    case 'SET_PASSENGER_DETAILS':
      return { ...state, passengerDetails: action.payload };
    case 'SET_PAYMENT_PROVIDER':
      return { ...state, selectedPaymentProvider: action.payload };
    case 'SET_CHECKOUT_TYPE':
      return { ...state, checkoutType: action.payload };
    case 'SET_ORDER_INFO':
      return { ...state, orderId: action.payload.orderId, orderNumber: action.payload.orderNumber };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

