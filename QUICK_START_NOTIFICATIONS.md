# 🚀 Quick Start - Email & Notification System

## ⚡ 5-Minute Setup

### 1. Sign Up for Resend (2 minutes)
```
1. Go to: https://resend.com/signup
2. Click "Get API Key"
3. Copy your API key: re_xxxxxxxxxxxxx
```

### 2. Add to Vercel (1 minute)
```bash
# Go to: Vercel → Settings → Environment Variables
# Add these 4 variables:

RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=support@dummair.com
ADMIN_EMAIL=abiolayoung229@gmail.com
CRON_SECRET=<generate with: openssl rand -base64 32>
```

### 3. Run Database Migration (1 minute)
```sql
-- In Supabase SQL Editor, run:
\i database/migrations/008_create_notifications_table.sql
```

### 4. Verify Domain (1 minute setup, 15 min wait)
```
1. In Resend: Domains → Add Domain → dummair.com
2. Add DNS records (they'll show you what to add)
3. Wait for verification (~15 minutes)
```

### 5. Deploy & Test! ✅
```
1. Redeploy on Vercel
2. Make a test order
3. Check your email!
```

---

## 📧 What Gets Sent Automatically

### On Payment Success:
- ✅ Client gets: Payment confirmation + Receipt
- ✅ Admin gets: New order notification  
- ✅ User sees: In-app notification badge

### On Ticket Upload:
- ✅ Client gets: "Your ticket is ready!" email
- ✅ User sees: In-app notification with download link

### Daily at 9 AM UTC:
- ✅ Pending orders > 24hrs get: Payment reminder email

### On Admin "Send Email" Click:
- ✅ Client gets: Full itinerary + ticket PDF attachment

---

## 🔔 Notification Bell

**Shows up on:**
- Dashboard (top-right)
- Tickets page (top-right)

**Features:**
- Red badge with unread count
- Real-time updates
- Click to mark as read
- Navigate to relevant pages

---

## 🎯 Testing Checklist

```bash
# 1. Test Payment Flow
□ Make order → Complete payment
□ Check email: Payment confirmation ✓
□ Check email: Payment receipt ✓
□ Check admin email: New order notification ✓

# 2. Test Ticket Upload
□ Admin uploads ticket
□ Check email: Ticket ready ✓
□ Check dashboard: Notification badge ✓

# 3. Test Admin Email
□ Go to admin → Order details
□ Click "Send Email" button
□ Check email: Itinerary with attachment ✓

# 4. Test Payment Reminder (Manual)
□ Create order but don't pay
□ Wait 24 hours OR trigger manually:
   curl -X POST https://your-app.vercel.app/api/cron/payment-reminders \
     -H "Authorization: Bearer your-cron-secret"
□ Check email: Payment reminder ✓
```

---

## 🛠️ Environment Variables Needed

```bash
# Email (Required)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=support@dummair.com
RESEND_FROM_NAME=DummAir Support

# App Settings (Required)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ADMIN_EMAIL=abiolayoung229@gmail.com

# Cron Security (Required)
CRON_SECRET=<your-secure-random-string>
```

Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

---

## 📁 Key Files

### Email Service
- `src/lib/email/service.ts` - Email sending logic
- `src/lib/email/templates.ts` - All email templates

### Notifications
- `src/lib/notifications/service.ts` - Notification management
- `src/components/NotificationBell.tsx` - Notification UI

### API Routes
- `/api/notifications` - Get/update notifications
- `/api/admin/send-email` - Admin send email
- `/api/cron/payment-reminders` - Payment reminders

---

## 🎨 Email Templates Available

1. **Payment Confirmation** - After payment success
2. **Payment Receipt** - Transaction receipt
3. **Ticket Ready** - Ticket download link
4. **Itinerary Email** - Full booking details + PDF
5. **Payment Reminder** - Pending payment reminder
6. **Admin Notification** - New order alert

All templates are:
- ✅ Mobile responsive
- ✅ Professional design
- ✅ Inbox optimized
- ✅ DummAir branded

---

## 🔍 Quick Troubleshooting

### Emails Not Sending?
```bash
# Check 1: Verify API key is set
vercel env ls | grep RESEND

# Check 2: View email logs
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;

# Check 3: Check Vercel logs
vercel logs
```

### Notifications Not Showing?
```bash
# Check 1: Table exists?
SELECT * FROM notifications LIMIT 1;

# Check 2: Browser console
# Open DevTools → Console → Look for errors
```

### Cron Not Running?
```bash
# Check 1: Vercel has Pro plan? (Required for cron)
# Check 2: Test manually
curl -X POST https://your-app.vercel.app/api/cron/payment-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 📊 Monitoring

### View Email Status
```sql
SELECT 
  email_type,
  status,
  COUNT(*) as count
FROM email_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY email_type, status;
```

### View Recent Notifications
```sql
SELECT 
  type,
  title,
  is_read,
  created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🎉 You're Done!

Your notification system is now:
- ✅ Sending professional emails
- ✅ Showing real-time notifications
- ✅ Running automated reminders
- ✅ Fully integrated with admin dashboard

**For detailed setup:** See [EMAIL_NOTIFICATION_SETUP.md](./EMAIL_NOTIFICATION_SETUP.md)  
**For complete overview:** See [NOTIFICATION_SYSTEM_SUMMARY.md](./NOTIFICATION_SYSTEM_SUMMARY.md)

---

## 📞 Need Help?

1. Check logs: `vercel logs --follow`
2. Check database: Email logs & notification tables
3. Review: EMAIL_NOTIFICATION_SETUP.md

**Happy emailing! 📧✨**

