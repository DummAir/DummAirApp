import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';
import { createServiceClient } from '@/lib/supabase/server';
import { sendAndLogEmail } from '@/lib/email/service';
import { getTicketReadyEmail } from '@/lib/email/templates';
import { createNotification } from '@/lib/notifications/service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: 'Missing file or orderId' },
        { status: 400 }
      );
    }

    console.log('📤 Uploading ticket:', {
      orderId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use service client for storage
    const supabase = createServiceClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `tickets/${orderId}_${timestamp}.pdf`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('tickets')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    console.log('✅ File uploaded:', uploadData.path);

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('tickets')
      .getPublicUrl(fileName);

    console.log('🔗 Public URL:', publicUrl);

    // Update order with ticket URL and mark as completed
    await updateOrderStatus(orderId, 'completed', {
      ticket_url: publicUrl,
    });

    console.log('✅ Order updated with ticket URL');

    // Fetch order details for notifications
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!orderError && order) {
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

      // Send ticket ready email to client
      const clientEmail = order.guest_email;
      const dashboardUrl = order.user_id 
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://dummair.com'}/dashboard`
        : publicUrl;

      if (clientEmail) {
        await sendAndLogEmail(
          {
            to: clientEmail,
            subject: `Your Ticket is Ready - ${order.order_number}`,
            html: getTicketReadyEmail(orderDetails, dashboardUrl),
          },
          {
            orderId: order.id,
            userId: order.user_id,
            emailType: 'ticket_delivery',
            recipient: clientEmail,
            subject: `Your Ticket is Ready - ${order.order_number}`,
          }
        );
      }

      // Create in-app notification for registered users
      if (order.user_id) {
        await createNotification({
          userId: order.user_id,
          orderId: order.id,
          type: 'ticket_ready',
          title: '🎫 Your Ticket is Ready!',
          message: `Your ticket for ${order.flight_from} → ${order.flight_to} is now available for download.`,
          actionUrl: '/dashboard',
        });
      }
    }

    return NextResponse.json({
      success: true,
      ticketUrl: publicUrl,
      message: 'Ticket uploaded and order marked as completed',
    });

  } catch (error: unknown) {
    console.error('❌ Error uploading ticket:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload ticket';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



