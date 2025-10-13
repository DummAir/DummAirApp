# 🔧 Troubleshooting Guide - Notifications & Admin Emails

## ✅ What I Just Fixed

### **Issue 1: In-App Notifications Not Working** ✅ FIXED
**Problem:** Notifications API was using client-side authentication in a server API route  
**Solution:** Updated to use proper server-side authentication with session cookies  
**Status:** 🟢 Fixed and deployed

### **Issue 2: Admin Email Not Working** ⚠️ NEEDS YOUR ACTION
**Problem:** Environment variable not set in Vercel  
**Solution:** Follow steps below to configure  
**Status:** 🟡 Requires manual setup

---

## 🚀 Step-by-Step Fix for Admin Emails

### **Step 1: Add Environment Variable in Vercel**

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your **DummAir** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add this variable:

```
Name:  ADMIN_EMAIL
Value: payment@dummair.com
```

6. Select: **Production**, **Preview**, and **Development**
7. Click **Save**

### **Step 2: Redeploy**

After adding the environment variable:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **...** menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

---

## 🧪 Testing Instructions

### **Test 1: Admin Email Notifications**

#### **Create a Test Order:**
1. Go to your website (not logged in)
2. Click "Book Now"
3. Fill in flight details
4. Add passenger information
5. Complete payment (use Stripe test card: `4242 4242 4242 4242`)

#### **Check Admin Email:**
1. Check inbox at **payment@dummair.com**
2. You should see: **"🚨 URGENT: New Paid Order DUM-XXXXXXXX - Action Required"**
3. Email should have:
   - Red urgent badge
   - Order details
   - "Process Order Now" button
   - Action checklist

#### **If Admin Email Doesn't Arrive:**

**Check 1: Environment Variable**
```bash
# In Vercel Dashboard → Settings → Environment Variables
# Verify ADMIN_EMAIL=payment@dummair.com is set
```

**Check 2: Email Logs**
```sql
-- In Supabase SQL Editor, run:
SELECT 
  created_at,
  recipient,
  email_type,
  status,
  error_message
FROM email_logs
WHERE email_type = 'admin_notification'
ORDER BY created_at DESC
LIMIT 5;
```

**Check 3: Resend Account**
- Go to https://resend.com/dashboard
- Check "Emails" tab
- Look for failed emails
- Check your sending limits

**Check 4: Webhook Logs**
- Go to Vercel Dashboard → Deployments → Functions
- Find `/api/webhooks/payment-success`
- Check logs for errors

---

### **Test 2: In-App Notifications**

#### **Create Test Notification:**
1. **Log in** to your account
2. Make an order and complete payment
3. Go to dashboard
4. Check **notification bell** (top right)

#### **Expected Behavior:**
- ✅ Bell should show red badge with number
- ✅ Click bell → dropdown opens
- ✅ See notification: "Payment Confirmed"
- ✅ Click notification → marks as read

#### **When Admin Uploads Ticket:**
1. Admin uploads ticket for your order
2. Notification bell should update
3. New notification: "🎫 Your Ticket Has Been Uploaded!"
4. Click → goes to dashboard to download

#### **If Notifications Don't Show:**

**Check 1: Are Notifications Being Created?**
```sql
-- In Supabase SQL Editor:
SELECT * FROM notifications 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

**Check 2: Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Look for errors when bell icon loads
- Check Network tab for /api/notifications requests

**Check 3: Authentication**
- Make sure you're logged in
- Check cookies exist (DevTools → Application → Cookies)
- Look for `sb-access-token` and `sb-refresh-token`

---

## 📊 Debugging SQL Queries

### **Check Email Logs:**
```sql
-- All emails sent today
SELECT 
  email_type,
  recipient,
  status,
  COUNT(*) as count
FROM email_logs
WHERE created_at >= CURRENT_DATE
GROUP BY email_type, recipient, status
ORDER BY email_type;

-- Failed emails
SELECT 
  created_at,
  email_type,
  recipient,
  error_message
FROM email_logs
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;

-- Admin notifications specifically
SELECT * FROM email_logs
WHERE email_type = 'admin_notification'
ORDER BY created_at DESC
LIMIT 5;
```

### **Check Notifications:**
```sql
-- All notifications
SELECT 
  u.email,
  n.type,
  n.title,
  n.is_read,
  n.created_at
FROM notifications n
JOIN users u ON u.id = n.user_id
ORDER BY n.created_at DESC
LIMIT 20;

-- Unread notifications by user
SELECT 
  u.email,
  COUNT(*) as unread_count
FROM notifications n
JOIN users u ON u.id = n.user_id
WHERE n.is_read = false
GROUP BY u.email;
```

---

## 🔍 Common Issues & Solutions

### **Issue: "Unauthorized" when fetching notifications**
**Cause:** Not logged in or session expired  
**Solution:** 
1. Log out and log back in
2. Clear browser cookies
3. Check if Supabase auth is working

### **Issue: Admin email going to spam**
**Cause:** Domain not verified in Resend  
**Solution:**
1. Go to Resend Dashboard → Domains
2. Verify `dummair.com`
3. Add DNS records (TXT, MX)
4. Wait 15 minutes for verification

### **Issue: No emails sending at all**
**Cause:** Missing or invalid Resend API key  
**Solution:**
1. Check `RESEND_API_KEY` in Vercel
2. Verify key is valid in Resend dashboard
3. Check sending limits (3,000/month on free tier)

### **Issue: Notification bell not showing**
**Cause:** Component not imported or auth issue  
**Solution:**
1. Check browser console for errors
2. Verify user is logged in
3. Check network requests to `/api/notifications`

---

## 📧 Email Flow Summary

### **When Customer Pays:**

| Step | Action | Email Sent? | To Whom |
|------|--------|-------------|---------|
| 1 | Payment confirmed | ✅ Yes | Customer (confirmation) |
| 2 | Payment receipt | ✅ Yes | Customer (receipt) |
| 3 | Admin notified | ✅ Yes | **payment@dummair.com** |
| 4 | In-app notification | 🔔 Yes | Registered users only |

### **When Admin Uploads Ticket:**

| User Type | Email? | In-App? | Details |
|-----------|--------|---------|---------|
| Guest | ❌ No | ❌ No | Waits for admin email |
| Registered | ❌ No | ✅ Yes | Notification bell badge |

### **When Admin Sends Email:**

| Step | Action | Email Sent? | To Whom |
|------|--------|-------------|---------|
| 1 | Admin clicks "Send Email" | ✅ Yes | Customer |
| 2 | Email contains | - | Itinerary + Ticket PDF |

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Environment variable `ADMIN_EMAIL=payment@dummair.com` set in Vercel
- [ ] Redeployed after adding env variable
- [ ] Test order created and payment completed
- [ ] Admin email received at payment@dummair.com
- [ ] Customer receives payment confirmation email
- [ ] Customer receives payment receipt email
- [ ] Logged-in user sees notification bell badge
- [ ] Clicking notification bell shows notifications
- [ ] Admin can upload ticket
- [ ] Registered user sees ticket upload notification
- [ ] Admin can send email with ticket attachment

---

## 📞 Still Having Issues?

### **Check Vercel Logs:**
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# View logs
vercel logs --follow
```

### **Check Database:**
```sql
-- Verify notifications table exists
SELECT * FROM notifications LIMIT 1;

-- Verify email_logs table exists
SELECT * FROM email_logs LIMIT 1;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('notifications', 'email_logs');
```

### **Contact Info:**
If issues persist:
1. Check Vercel function logs
2. Check Supabase logs
3. Check Resend dashboard
4. Review email_logs table in database
5. Check browser console for JavaScript errors

---

## 🎯 Quick Test Script

Run this to test everything at once:

### **Test Admin Email:**
1. Create order → Pay
2. Wait 30 seconds
3. Check payment@dummair.com inbox
4. Should see URGENT email ✅

### **Test In-App Notification:**
1. Login as registered user
2. Create order → Pay
3. Check notification bell (top right)
4. Should see red badge with "1" ✅
5. Click bell → see "Payment Confirmed" ✅

### **Test Ticket Upload:**
1. Admin uploads ticket
2. Registered user: Check bell → New notification ✅
3. Guest user: No notification (correct) ✅

### **Test Send Email:**
1. Admin clicks "Send Email"
2. Customer receives email with PDF ✅

---

## 🚀 System Status

| Feature | Status | Notes |
|---------|--------|-------|
| Payment confirmation emails | 🟢 Working | Automatic |
| Payment receipt emails | 🟢 Working | Automatic |
| Admin notification emails | 🟡 Needs env var | Set ADMIN_EMAIL |
| In-app notifications | 🟢 Fixed | Deployed |
| Ticket upload notifications | 🟢 Working | Registered only |
| Admin send email | 🟢 Working | Manual trigger |
| Payment reminders (cron) | 🟢 Working | Daily at 9 AM UTC |

---

**Your notification system is ready! Just add the environment variable and test.** 🎉

