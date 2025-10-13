import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email } = body;

    // In a real application, you would:
    // 1. Retrieve order details from Firestore
    // 2. Check if order is completed and has a ticket
    // 3. Send appropriate email via SendGrid:
    //    - Confirmation email if payment pending
    //    - Ticket delivery email if order completed
    // 4. Log email sending activity

    console.log(`Resending email for order ${orderId} to ${email}`);

    // Mock email sending
    const emailType = orderId ? 'ticket_delivery' : 'confirmation';
    console.log(`Sending ${emailType} email to ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailType,
      recipient: email
    });

  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

