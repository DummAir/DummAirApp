import { createServiceClient } from '../supabase/server';

export interface CreateOrderData {
  flightType: 'one-way' | 'return';
  flightDetails: {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    airlinePref?: string;
    travelClass?: string;
    numberOfTravelers: number;
  };
  passengers: Array<{
    name: string;
    gender: string;
    dob: string;
    email: string;
    phone?: string;
    phoneCountryCode?: string;
    nationality?: string;
  }>;
  userId?: string;
  guestEmail?: string;
  paymentProvider?: string;
  paymentAmount?: number;
}

export async function createOrder(data: CreateOrderData) {
  const supabase = createServiceClient();

  try {
    console.log('📝 Creating order with data:', {
      userId: data.userId,
      userIdType: typeof data.userId,
      isUserIdNull: data.userId === null,
      guestEmail: data.guestEmail,
      flightType: data.flightType,
      numberOfTravelers: data.flightDetails.numberOfTravelers,
    });
    
    const insertData = {
      user_id: data.userId || null,
      guest_email: data.guestEmail || data.passengers[0]?.email,
      status: 'pending_payment',
      flight_type: data.flightType,
      flight_from: data.flightDetails.from,
      flight_to: data.flightDetails.to,
      flight_depart_date: data.flightDetails.departDate,
      flight_return_date: data.flightDetails.returnDate || null,
      flight_airline_pref: data.flightDetails.airlinePref || null,
      flight_travel_class: data.flightDetails.travelClass || null,
      number_of_travelers: data.flightDetails.numberOfTravelers,
      payment_provider: data.paymentProvider || null,
      payment_amount: data.paymentAmount || null,
      payment_currency: 'USD',
    };
    
    console.log('📤 Inserting into database:', {
      user_id: insertData.user_id,
      guest_email: insertData.guest_email,
    });
    
    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(insertData)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Error creating order:', orderError);
      throw new Error(orderError.message);
    }

    console.log('✅ Order created in database:', {
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      guestEmail: order.guest_email,
    });

    // Create passenger records
    const passengersData = data.passengers.map((passenger, index) => ({
      order_id: order.id,
      full_name: passenger.name,
      gender: passenger.gender,
      date_of_birth: passenger.dob,
      email: passenger.email,
      phone: passenger.phone || null,
      phone_country_code: passenger.phoneCountryCode || null,
      nationality: passenger.nationality || null,
      passenger_number: index + 1,
    }));

    const { error: passengersError } = await supabase
      .from('passengers')
      .insert(passengersData);

    if (passengersError) {
      console.error('Error creating passengers:', passengersError);
      // Rollback order if passengers fail
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error(passengersError.message);
    }

    console.log('Passengers created:', passengersData.length);

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      status: order.status,
    };
  } catch (error) {
    console.error('Database error in createOrder:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  const supabase = createServiceClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      passengers (*)
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error(error.message);
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: string, additionalData?: Record<string, unknown>) {
  const supabase = createServiceClient();

  const updateData: Record<string, unknown> = { status };

  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString();
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  if (additionalData) {
    Object.assign(updateData, additionalData);
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.message);
  }

  return data;
}

