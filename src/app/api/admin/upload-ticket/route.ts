import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';
import { createServiceClient } from '@/lib/supabase/server';
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
      // Only send IN-APP notifications to REGISTERED users (no emails to save credits)
      // Both guest and registered users will receive ONE email when admin clicks "Send Email"
      if (order.user_id) {
        // Create in-app notification for registered users (NO EMAIL)
        await createNotification({
          userId: order.user_id,
          orderId: order.id,
          type: 'ticket_uploaded',
          title: '🎫 Your Ticket Has Been Uploaded!',
          message: `Your ticket for ${order.flight_from} → ${order.flight_to} is ready. Click here to download from your dashboard.`,
          actionUrl: '/dashboard',
        });

        console.log('✅ Registered user: In-app notification created (no email sent to save credits)');
      } else {
        console.log('ℹ️ Guest order: Will receive ticket via admin\'s "Send Email" button');
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



