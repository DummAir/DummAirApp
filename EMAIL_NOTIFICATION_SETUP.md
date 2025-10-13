# 📧 Email & Notification System Setup Guide

## Overview

DummAir now has a complete email and notification system that handles:
- ✅ Payment confirmation emails (admin & client)
- ✅ Payment receipts
- ✅ Ticket ready notifications
- ✅ Admin email sending with itinerary attachments
- ✅ In-app notifications for registered users
- ✅ Automated payment reminders

---

## 🎯 Features Implemented

### 1. **Payment & Order Notifications**
- **Client receives**: Payment confirmation + receipt after successful payment
- **Admin receives**: Email notification when new order is placed and paid
- **Registered users get**: In-app notification badge on dashboard

### 2. **Ticket Delivery**
- **Client receives**: Email when ticket is uploaded and ready
- **Registered users get**: In-app notification with download link
- **Guest users**: Direct download link in email

### 3. **Admin Email Functionality**
- Admin can send itinerary emails from the dashboard
- Includes order details, passenger information, and ticket attachment (if available)
- One-click "Send Email" button on each order page

### 4. **Payment Reminders**
- Automated daily reminders for pending payment orders older than 24 hours
- Email reminders with payment link
- In-app notifications for registered users
- Prevents duplicate reminders (one per day)

### 5. **In-App Notifications**
- Real-time notification bell on dashboard
- Badge shows unread count
- Notifications update automatically via Supabase real-time
- Click to mark as read and navigate to relevant page

---

## 🚀 Setup Instructions

### Step 1: Choose Email Provider

We recommend **Resend** for optimal inbox delivery:

#### **Option A: Resend (Recommended)**

1. **Sign up at**: https://resend.com
2. **Get your API key** from Settings → API Keys
3. **Verify your domain**:
   - Add these DNS records to your domain (dummair.com):
   ```
   Type: TXT
   Name: @
   Value: [Resend will provide this]
   
   Type: MX
   Name: @
   Value: [Resend will provide this]
   Priority: 10
   ```

4. **Add environment variables** in Vercel:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=support@dummair.com
   RESEND_FROM_NAME=DummAir Support
   ```

#### **Option B: SendGrid (Alternative)**

If you prefer SendGrid:

1. **Sign up at**: https://sendgrid.com
2. **Get API Key**: Settings → API Keys → Create API Key
3. **Verify sender email**: Sender Authentication → Verify Single Sender
4. **Add environment variables**:
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=support@dummair.com
   SENDGRID_FROM_NAME=DummAir
   ```

5. **Update email service** (`src/lib/email/service.ts`):
   - Replace Resend API calls with SendGrid API
   - SendGrid endpoint: `https://api.sendgrid.com/v3/mail/send`

---

### Step 2: Run Database Migrations

The notification system requires a new table. Run this migration in your Supabase SQL Editor:

```sql
-- Run the notifications table migration
\i database/migrations/008_create_notifications_table.sql
```

Or copy and paste the contents of `database/migrations/008_create_notifications_table.sql` into the Supabase SQL Editor.

Alternatively, run the complete migration script:
```sql
\i database/migrations/000_run_all_migrations.sql
```

---

### Step 3: Environment Variables

Add these to your Vercel project (or `.env.local` for development):

```bash
# ============================================================================
# EMAIL SERVICE (⭐ REQUIRED)
# ============================================================================
# Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=support@dummair.com
RESEND_FROM_NAME=DummAir Support

# Admin email (receives new order notifications)
ADMIN_EMAIL=abiolayoung229@gmail.com

# App URL (for email links and redirects)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# ============================================================================
# CRON JOB SECURITY (⭐ REQUIRED for payment reminders)
# ============================================================================
# Generate a secure random string for cron job authentication
CRON_SECRET=your-secure-random-string-here
```

**Generate CRON_SECRET**:
```bash
# Use this command to generate a secure secret
openssl rand -base64 32
```

---

### Step 4: Configure Vercel Cron Job

The payment reminder system uses Vercel Cron. This is already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/payment-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule**: Runs daily at 9:00 AM UTC

**To change the schedule**, update the cron expression:
- `0 9 * * *` = Daily at 9:00 AM
- `0 */6 * * *` = Every 6 hours
- `0 0,12 * * *` = Twice daily (midnight and noon)

Learn more: https://vercel.com/docs/cron-jobs

---

### Step 5: Test the System

#### **Test Email Sending**

1. **Make a test order** and complete payment
2. **Check your inbox** for:
   - Payment confirmation email
   - Payment receipt
   
3. **Check admin inbox** for new order notification

#### **Test In-App Notifications**

1. **Log in as a registered user**
2. **Make an order and pay**
3. **Check notification bell** on dashboard
4. **You should see** payment confirmation notification

#### **Test Admin Email Sending**

1. **Log in as admin** (abiolayoung229@gmail.com)
2. **Go to any order** in admin dashboard
3. **Click "Send Email"** button
4. **Customer receives** itinerary email with ticket attachment

#### **Test Payment Reminders (Manual)**

Send a test request to trigger the cron job:

```bash
curl -X POST https://your-app.vercel.app/api/cron/payment-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

Or visit in browser (for GET):
```
https://your-app.vercel.app/api/cron/payment-reminders
Authorization: Bearer your-cron-secret
```

---

## 📊 Email Types & Templates

### Email Templates Available

1. **Payment Confirmation** (`getPaymentConfirmationEmail`)
   - Sent to: Client & Admin
   - Trigger: After successful payment
   - Content: Order details, payment amount

2. **Payment Receipt** (`getPaymentReceiptEmail`)
   - Sent to: Client only
   - Trigger: After successful payment
   - Content: Transaction ID, receipt details

3. **Ticket Ready** (`getTicketReadyEmail`)
   - Sent to: Client
   - Trigger: When admin uploads ticket
   - Content: Download link or dashboard link

4. **Itinerary Email** (`getItineraryEmail`)
   - Sent to: Client (admin sends manually)
   - Trigger: Admin clicks "Send Email" button
   - Content: Full itinerary, passenger details, ticket attachment

5. **Payment Reminder** (`getPaymentReminderEmail`)
   - Sent to: Client
   - Trigger: Automated daily for pending orders > 24 hours old
   - Content: Payment link, order summary, support contact

6. **Admin Notification** (`getAdminNotificationEmail`)
   - Sent to: Admin
   - Trigger: New order or payment received
   - Content: Order summary, link to admin dashboard

---

## 🔔 Notification System

### In-App Notifications

**Location**: Dashboard & Tickets page (top-right bell icon)

**Features**:
- Real-time updates via Supabase subscriptions
- Unread count badge
- Click to navigate to relevant page
- Mark as read/mark all as read
- Auto-refresh on new notifications

**Notification Types**:
- `order_created` - New order placed
- `payment_confirmed` - Payment successful
- `ticket_ready` - Ticket available for download
- `ticket_uploaded` - Ticket uploaded by admin
- `payment_reminder` - Payment due reminder
- `order_completed` - Order completed
- `admin_message` - Admin sent a message

### API Endpoints

- `GET /api/notifications` - Fetch user notifications
- `PATCH /api/notifications` - Mark as read
  ```json
  // Mark single notification
  { "notificationId": "uuid" }
  
  // Mark all as read
  { "markAllAsRead": true }
  ```

---

## 🛠️ Customization

### Modify Email Templates

Edit `src/lib/email/templates.ts`:

```typescript
// Example: Customize payment confirmation email
export function getPaymentConfirmationEmail(order: OrderDetails, isAdmin = false): string {
  // Your custom HTML template here
  const content = `
    <h2>Your custom content</h2>
    ...
  `;
  
  return getBaseTemplate(content);
}
```

### Add New Notification Types

1. **Update database enum**:
   ```sql
   ALTER TABLE notifications 
   DROP CONSTRAINT notifications_type_check;
   
   ALTER TABLE notifications 
   ADD CONSTRAINT notifications_type_check 
   CHECK (type IN ('order_created', 'payment_confirmed', 'your_new_type', ...));
   ```

2. **Update TypeScript types** in `src/lib/notifications/service.ts`

3. **Add icon mapping** in `NotificationBell.tsx`:
   ```typescript
   const iconMap: Record<string, string> = {
     your_new_type: '🎉',
     ...
   };
   ```

---

## 🔐 Security Best Practices

1. **Protect Cron Endpoint**:
   - Always use `CRON_SECRET` for authentication
   - Rotate secret periodically
   - Monitor cron job logs in Vercel

2. **Email Rate Limiting**:
   - Resend free tier: 3,000 emails/month
   - SendGrid free tier: 100 emails/day
   - Consider upgrading for production use

3. **Database Security**:
   - Row Level Security (RLS) is enabled
   - Users can only see their own notifications
   - Service role used for admin operations

---

## 📈 Monitoring & Logs

### Email Logs

All email attempts are logged in `email_logs` table:

```sql
SELECT 
  email_type,
  recipient,
  status,
  sent_at,
  error_message
FROM email_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Notification Logs

View user notifications:

```sql
SELECT 
  u.email as user_email,
  n.type,
  n.title,
  n.is_read,
  n.created_at
FROM notifications n
JOIN users u ON u.id = n.user_id
ORDER BY n.created_at DESC
LIMIT 50;
```

### Cron Job Logs

View in Vercel:
1. Go to your project in Vercel
2. Navigate to **Deployments** → **Functions**
3. Find `/api/cron/payment-reminders`
4. View execution logs

---

## ❓ Troubleshooting

### Emails Not Sending

1. **Check API Keys**: Verify `RESEND_API_KEY` is set correctly
2. **Check domain verification**: Ensure domain is verified in Resend
3. **Check email logs**:
   ```sql
   SELECT * FROM email_logs WHERE status = 'failed' ORDER BY created_at DESC;
   ```
4. **Check server logs** in Vercel for error messages

### Notifications Not Showing

1. **Verify migration**: Ensure notifications table exists
2. **Check RLS policies**: User should have permission to read their notifications
3. **Check browser console** for JavaScript errors
4. **Verify Supabase real-time** is enabled for notifications table

### Cron Job Not Running

1. **Check Vercel Cron is enabled** on your plan (requires Pro plan)
2. **Verify cron schedule** in `vercel.json`
3. **Check CRON_SECRET** is set correctly
4. **Test manually** with curl command (see Test section above)

### Attachments Not Working

1. **Ensure ticket_url is accessible** (public URL from Supabase Storage)
2. **Check file size**: Resend has attachment limits (40MB max)
3. **Verify ticket exists** in Supabase Storage before sending

---

## 📝 Summary Checklist

- [ ] Sign up for Resend account
- [ ] Verify domain (support@dummair.com)
- [ ] Add environment variables to Vercel
- [ ] Run database migrations (notifications table)
- [ ] Test payment flow and emails
- [ ] Test admin send email functionality
- [ ] Configure and test cron job
- [ ] Monitor email logs in database
- [ ] Set up monitoring/alerts for failed emails

---

## 🎉 You're All Set!

Your DummAir notification system is now fully configured. Users will receive:
- Instant payment confirmations
- Beautiful itinerary emails  
- Real-time in-app notifications
- Automated payment reminders

For questions or issues, check the logs or contact support.

**Happy Flying! ✈️**

