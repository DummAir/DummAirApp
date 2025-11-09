/**
 * Email Templates for DummAir
 * Professional HTML email templates optimized for inbox delivery
 */

interface OrderDetails {
  orderNumber: string;
  flightFrom: string;
  flightTo: string;
  departDate: string;
  returnDate?: string;
  numberOfTravelers: number;
  amount: number;
  flightType: string;
}

interface PassengerDetails {
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  phone?: string;
  nationality?: string;
}

/**
 * Base email template with DummAir branding
 */
function getBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DummAir</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2472e0 0%, #1e5bb8 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">DummAir</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Your Trusted Flight Booking Partner</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Need help? Contact our support team
              </p>
              <p style="margin: 0 0 15px 0;">
                <a href="mailto:support@dummair.com" style="color: #2472e0; text-decoration: none; font-weight: 600;">support@dummair.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} DummAir. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 1. Payment Confirmation Email (sent to both admin and client)
 */
export function getPaymentConfirmationEmail(order: OrderDetails, isAdmin = false): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 16px;">
        ✓ Payment Confirmed
      </div>
    </div>
    
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
      ${isAdmin ? 'New Order Received!' : 'Payment Successful!'}
    </h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      ${isAdmin 
        ? `A new order has been placed and payment confirmed. Please process this order.` 
        : `Thank you for your payment! Your order has been confirmed and is being processed.`
      }
    </p>
    
    <!-- Order Details Card -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
      
      <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Order Number:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Flight Type:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0; text-transform: capitalize;">${order.flightType.replace('-', ' ')}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Departure Date:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.departDate}</td>
        </tr>
        ${order.returnDate ? `
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Return Date:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.returnDate}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Travelers:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.numberOfTravelers}</td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="color: #111827; font-weight: 600; padding: 12px 0 0 0;">Total Amount:</td>
          <td style="color: #2472e0; font-weight: 700; text-align: right; padding: 12px 0 0 0; font-size: 18px;">$${order.amount}</td>
        </tr>
      </table>
    </div>
    
    ${!isAdmin ? `
    <div style="background-color: #eff6ff; border-left: 4px solid #2472e0; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>What's Next?</strong><br>
        Your ticket will be processed within 1 hour. You'll receive another email with your flight itinerary once it's ready.
      </p>
    </div>
    ` : `
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Action Required:</strong><br>
        Please log into the admin dashboard to process this order and upload the ticket.
      </p>
    </div>
    `}
  `;
  
  return getBaseTemplate(content);
}

/**
 * 2. Payment Receipt Email
 */
export function getPaymentReceiptEmail(order: OrderDetails, transactionId: string): string {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Payment Receipt</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Thank you for your payment. Here's your receipt for order <strong>${order.orderNumber}</strong>.
    </p>
    
    <!-- Receipt Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Transaction ID:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0; font-family: monospace;">${transactionId}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Order Number:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Date:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Description:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; padding: 8px 0;">Dummy Flight Ticket - ${order.flightFrom} to ${order.flightTo}</td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="color: #111827; font-weight: 600; padding: 12px 0 0 0; font-size: 16px;">Amount Paid:</td>
          <td style="color: #10b981; font-weight: 700; text-align: right; padding: 12px 0 0 0; font-size: 20px;">$${order.amount}</td>
        </tr>
      </table>
    </div>
    
    <p style="color: #6b7280; font-size: 13px; margin: 20px 0 0 0; line-height: 1.6;">
      Please keep this receipt for your records. If you have any questions about this transaction, please contact our support team.
    </p>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 3. Ticket Ready Notification Email
 */
export function getTicketReadyEmail(order: OrderDetails, downloadUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #2472e0; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 16px;">
        🎫 Your Ticket is Ready!
      </div>
    </div>
    
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Your Flight Ticket is Ready to Download</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Great news! Your dummy flight ticket for order <strong>${order.orderNumber}</strong> has been processed and is now available for download.
    </p>
    
    <!-- Order Summary -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Departure:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.departDate}</td>
        </tr>
        ${order.returnDate ? `
        <tr>
          <td style="color: #6b7280;">Return:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.returnDate}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <!-- Download Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #2472e0 0%, #1e5bb8 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Download Your Ticket
      </a>
    </div>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #2472e0; padding: 15px; margin-top: 25px; border-radius: 4px;">
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Important:</strong> You can also download your ticket anytime from your dashboard.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 4. Admin Send Email with Itinerary
 */
export function getItineraryEmail(order: OrderDetails, passengers: PassengerDetails[]): string {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Your Flight Itinerary</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Please find your complete flight itinerary and booking details below.
    </p>
    
    <!-- Flight Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">Flight Information</h3>
      
      <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280;">Booking Reference:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; font-family: monospace;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Flight Type:</td>
          <td style="color: #111827; font-weight: 600; text-align: right; text-transform: capitalize;">${order.flightType.replace('-', ' ')}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Departure Date:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.departDate}</td>
        </tr>
        ${order.returnDate ? `
        <tr>
          <td style="color: #6b7280;">Return Date:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.returnDate}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="color: #6b7280;">Number of Passengers:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.numberOfTravelers}</td>
        </tr>
      </table>
    </div>
    
    <!-- Passenger Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">Passenger Information</h3>
      
      ${passengers.map((passenger, index) => `
        <div style="background-color: white; border-radius: 6px; padding: 15px; margin-bottom: ${index < passengers.length - 1 ? '12px' : '0'};">
          <h4 style="color: #2472e0; margin: 0 0 10px 0; font-size: 16px;">Passenger ${index + 1}</h4>
          <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #6b7280; width: 40%;">Name:</td>
              <td style="color: #111827; font-weight: 600;">${passenger.fullName}</td>
            </tr>
            <tr>
              <td style="color: #6b7280;">Email:</td>
              <td style="color: #111827; font-weight: 600;">${passenger.email}</td>
            </tr>
            <tr>
              <td style="color: #6b7280;">Gender:</td>
              <td style="color: #111827; font-weight: 600; text-transform: capitalize;">${passenger.gender}</td>
            </tr>
            <tr>
              <td style="color: #6b7280;">Date of Birth:</td>
              <td style="color: #111827; font-weight: 600;">${passenger.dateOfBirth}</td>
            </tr>
            ${passenger.phone ? `
            <tr>
              <td style="color: #6b7280;">Phone:</td>
              <td style="color: #111827; font-weight: 600;">${passenger.phone}</td>
            </tr>
            ` : ''}
            ${passenger.nationality ? `
            <tr>
              <td style="color: #6b7280;">Nationality:</td>
              <td style="color: #111827; font-weight: 600;">${passenger.nationality}</td>
            </tr>
            ` : ''}
          </table>
        </div>
      `).join('')}
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
      <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Important Notice:</strong> This is a dummy flight ticket for visa application purposes only. It is not a valid ticket for actual travel.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 5. Payment Reminder Email
 */
export function getPaymentReminderEmail(order: OrderDetails, paymentUrl: string): string {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Payment Reminder</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      You have a pending order that requires payment. Complete your booking to receive your dummy flight ticket.
    </p>
    
    <!-- Order Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
      
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280;">Order Number:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Departure:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.departDate}</td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="color: #111827; font-weight: 600; padding-top: 12px;">Amount Due:</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding-top: 12px; font-size: 18px;">$${order.amount}</td>
        </tr>
      </table>
    </div>
    
    <!-- Payment Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #2472e0 0%, #1e5bb8 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Complete Payment Now
      </a>
    </div>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #2472e0; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Need Help?</strong><br>
        If you're experiencing payment issues, please contact our support team for manual processing.
      </p>
    </div>
    
    <p style="text-align: center; margin: 20px 0 0 0;">
      <a href="mailto:support@dummair.com" style="color: #2472e0; text-decoration: none; font-weight: 600;">Contact Support →</a>
    </p>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 6. Post-Payment Survey Email
 */
export function getPostPaymentSurveyEmail(order: OrderDetails, surveyUrl: string): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 16px;">
        ⭐ We Value Your Feedback
      </div>
    </div>

    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Tell Us About Your Experience</h2>

    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
      Thanks again for choosing DummAir for order <strong>${order.orderNumber}</strong>.
      It only takes a minute to complete our quick survey, and your feedback helps us keep improving.
    </p>

    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; margin-bottom: 25px;">
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Travelers:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.numberOfTravelers}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Amount Paid:</td>
          <td style="color: #10b981; font-weight: 700; text-align: right;">$${order.amount}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Share Your Feedback
      </a>
    </div>

    <p style="color: #6b7280; line-height: 1.6; margin: 0 0 10px 0; font-size: 14px;">
      We read every response and use it to make DummAir better for travelers like you. Thank you for helping us improve!
    </p>
  `;

  return getBaseTemplate(content);
}

/**
 * 6. Email Verification Email
 */
export function getEmailVerificationEmail(verificationUrl: string, userName: string): string {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Welcome to DummAir!</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Hi ${userName},
    </p>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Thank you for signing up! To complete your registration and verify your email address, please click the button below:
    </p>
    
    <!-- Verification Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #2472e0 0%, #1e5bb8 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Verify Email Address
      </a>
    </div>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #2472e0; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Note:</strong> You can start using your account even without verification, but we recommend verifying your email for security and account recovery.
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 13px; margin: 20px 0 0 0; line-height: 1.6;">
      If you didn't create an account, you can safely ignore this email.
    </p>
    
    <p style="color: #6b7280; font-size: 13px; margin: 10px 0 0 0; line-height: 1.6;">
      This verification link will expire in 24 hours.
    </p>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 7. Password Reset Email
 */
export function getPasswordResetEmail(resetUrl: string, userName: string): string {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      Hi ${userName},
    </p>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
      We received a request to reset your password for your DummAir account. Click the button below to create a new password:
    </p>
    
    <!-- Reset Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2472e0 0%, #1e5bb8 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 13px; margin: 20px 0 0 0; line-height: 1.6;">
      This password reset link will expire in 1 hour for security reasons.
    </p>
  `;
  
  return getBaseTemplate(content);
}

/**
 * 8. Admin Notification Email
 */
export function getAdminNotificationEmail(order: OrderDetails & { orderId?: string }, notificationType: 'new_order' | 'payment_received'): string {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #dc2626; color: white; padding: 14px 28px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">
        🚨 URGENT - NEW PAID ORDER
      </div>
    </div>
    
    <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 28px; font-weight: 800;">
      ${notificationType === 'new_order' ? 'Action Required: Process New Order' : 'Payment Confirmed - Process Order'}
    </h2>
    
    <p style="color: #111827; line-height: 1.6; margin-bottom: 15px; font-size: 17px; font-weight: 600;">
      ${notificationType === 'new_order' 
        ? '⏰ A customer has PAID for a new order. Please process within 1 hour to maintain swift service!' 
        : '⏰ Payment confirmed. Process this order immediately!'}
    </p>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 25px; border-radius: 4px;">
      <p style="color: #92400e; margin: 0; font-size: 15px; line-height: 1.6; font-weight: 600;">
        ⚡ <strong>Swift Processing Required:</strong> Upload ticket and send email to customer within 1 hour for excellent service!
      </p>
    </div>
    
    <!-- Order Details -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
      <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
        <tr>
          <td style="color: #6b7280;">Order Number:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Route:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.flightFrom} → ${order.flightTo}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Departure:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.departDate}</td>
        </tr>
        <tr>
          <td style="color: #6b7280;">Travelers:</td>
          <td style="color: #111827; font-weight: 600; text-align: right;">${order.numberOfTravelers}</td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="color: #111827; font-weight: 600; padding-top: 12px;">Amount:</td>
          <td style="color: #10b981; font-weight: 700; text-align: right; padding-top: 12px; font-size: 18px;">$${order.amount}</td>
        </tr>
      </table>
    </div>
    
    <!-- Action Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://dummair.com'}/admin/orders/${order.orderId || order.orderNumber}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">
        🚀 Process Order Now
      </a>
    </div>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #2472e0; padding: 15px; margin-top: 25px; border-radius: 4px;">
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        <strong>Quick Actions:</strong><br>
        1. Upload ticket PDF<br>
        2. Click "Send Email" to deliver to customer<br>
        3. Mark as completed
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
}

