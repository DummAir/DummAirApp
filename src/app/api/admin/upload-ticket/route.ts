import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orders';
import { createServiceClient } from '@/lib/supabase/server';

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



