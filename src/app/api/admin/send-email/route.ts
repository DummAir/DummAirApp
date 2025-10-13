import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendAndLogEmail } from '@/lib/email/service';
import { getItineraryEmail } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      );
    }

    console.log('📧 Admin: Sending email for order:', orderId);

    // Fetch order details
    const supabase = await createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Failed to fetch order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch passengers
    const { data: passengers, error: passengersError } = await supabase
      .from('passengers')
      .select('*')
      .eq('order_id', orderId)
      .order('passenger_number', { ascending: true });

    if (passengersError || !passengers || passengers.length === 0) {
      console.error('❌ Failed to fetch passengers:', passengersError);
      return NextResponse.json(
        { error: 'Passengers not found' },
        { status: 404 }
      );
    }

    // Prepare order details
    const orderDetails = {
      orderNumber: order.order_number,
      flightFrom: order.flight_from,
      flightTo: order.flight_to,
      departDate: new Date(order.flight_depart_date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      returnDate: order.flight_return_date 
        ? new Date(order.flight_return_date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          })
        : undefined,
      numberOfTravelers: order.number_of_travelers,
      amount: order.payment_amount,
      flightType: order.flight_type,
    };

    // Prepare passenger details
    const passengerDetails = passengers.map(p => ({
      fullName: p.full_name,
      email: p.email,
      gender: p.gender,
      dateOfBirth: new Date(p.date_of_birth).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      phone: p.phone,
      nationality: p.nationality,
    }));

    // Prepare email payload
    const emailPayload: {
      to: string;
      subject: string;
      html: string;
      attachments?: Array<{
        filename: string;
        content: Buffer | string;
        contentType?: string;
      }>;
    } = {
      to: order.guest_email,
      subject: `Flight Itinerary - ${order.order_number}`,
      html: getItineraryEmail(orderDetails, passengerDetails),
    };

    // If ticket is available, attach it
    if (order.ticket_url) {
      try {
        // Download the ticket from Supabase storage
        const ticketResponse = await fetch(order.ticket_url);
        if (ticketResponse.ok) {
          const ticketBuffer = Buffer.from(await ticketResponse.arrayBuffer());
          emailPayload.attachments = [
            {
              filename: `Ticket_${order.order_number}.pdf`,
              content: ticketBuffer,
              contentType: 'application/pdf',
            },
          ];
          console.log('✅ Ticket attached to email');
        }
      } catch (error) {
        console.error('⚠️ Failed to attach ticket, continuing without it:', error);
      }
    }

    // Send email
    const result = await sendAndLogEmail(
      emailPayload,
      {
        orderId: order.id,
        userId: order.user_id,
        emailType: 'order_update',
        recipient: order.guest_email,
        subject: `Flight Itinerary - ${order.order_number}`,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      recipient: order.guest_email,
    });

  } catch (error: unknown) {
    console.error('❌ Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

