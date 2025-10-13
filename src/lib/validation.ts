import * as yup from 'yup';

// Flight Details Validation Schema
export const flightDetailsSchema = yup.object({
  from: yup.string()
    .required('Departure city is required')
    .min(2, 'Departure city must be at least 2 characters'),
  to: yup.string()
    .required('Destination city is required')
    .min(2, 'Destination city must be at least 2 characters')
    .test('different-cities', 'Departure and destination must be different', function(value) {
      return value !== this.parent.from;
    }),
  departDate: yup.string()
    .required('Departure date is required')
    .test('is-future', 'Departure date must be in the future', function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  returnDate: yup.string().optional(),
  airlinePref: yup.string().notRequired(),
  travelClass: yup.string().notRequired(),
  numberOfTravelers: yup.number()
    .required('Number of travelers is required')
    .min(1, 'At least 1 traveler required')
    .max(10, 'Maximum 10 travelers allowed'),
});

// Passenger Details Validation Schema
export const passengerDetailsSchema = yup.object({
  name: yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  dob: yup.string()
    .required('Date of birth is required')
    .test('is-past', 'Date of birth cannot be in the future', function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      return birthDate <= today;
    })
    .test('age', 'You must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup.string()
    .notRequired()
    .matches(/^[\d\s\-\+\(\)]{7,20}$/, 'Please enter a valid phone number'),
  phoneCountryCode: yup.string().notRequired(),
  nationality: yup.string().notRequired(),
});

// Booking Form Types
export type FlightDetailsFormData = yup.InferType<typeof flightDetailsSchema>;
export type PassengerDetailsFormData = yup.InferType<typeof passengerDetailsSchema>;

// Validation helper functions
export const validateFlightDetails = async (data: unknown) => {
  try {
    await flightDetailsSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

export const validatePassengerDetails = async (data: unknown) => {
  try {
    await passengerDetailsSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};
