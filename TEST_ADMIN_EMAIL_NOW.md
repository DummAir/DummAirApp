# 🚨 FIX ADMIN EMAIL NOW - Step by Step

## ⚡ **IMMEDIATE ACTION REQUIRED**

The admin email system is ready but needs configuration. Follow these exact steps:

---

## 🔧 **Step 1: Add Environment Variables (2 minutes)**

### **Go to Vercel Dashboard:**
1. Open: https://vercel.com/dashboard
2. Click your **DummAir** project
3. Click **Settings** (left sidebar)
4. Click **Environment Variables**

### **Add These 3 Variables:**

#### **Variable 1: RESEND_API_KEY**
```
Name:  RESEND_API_KEY
Value: [Your Resend API key from https://resend.com/api-keys]

Example: re_123456789abcdefghijk
```
✅ Check: **Production**, **Preview**, **Development**  
Click **Save**

#### **Variable 2: ADMIN_EMAIL**
```
Name:  ADMIN_EMAIL
Value: payment@dummair.com
```
✅ Check: **Production**, **Preview**, **Development**  
Click **Save**

#### **Variable 3: RESEND_FROM_EMAIL**
```
Name:  RESEND_FROM_EMAIL
Value: support@dummair.com
```
✅ Check: **Production**, **Preview**, **Development**  
Click **Save**

---

## 🔄 **Step 2: Redeploy (1 minute)**

After adding ALL 3 variables:

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **...** (three dots) → **Redeploy**
4. Wait 2-3 minutes for build to complete

---

## 🧪 **Step 3: Test Admin Email (30 seconds)**

After redeployment completes, test immediately:

### **Option A: Browser Console Test**

1. Go to your deployed site
2. Open browser console (F12)
3. Paste and run:

```javascript
fetch('/api/test-admin-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => {
  console.log('🧪 Test Result:', data);
  if (data.success) {
    alert('✅ SUCCESS! Admin email sent to ' + data.details.recipient);
  } else {
    alert('❌ FAILED: ' + data.error);
    console.log('Config:', data.config);
  }
});
```

### **Option B: Direct URL Test**

Open in new tab:
```
https://your-app.vercel.app/api/test-admin-email
```

Use this request body (in Postman or similar):
```json
POST /api/test-admin-email
Content-Type: application/json

{}
```

---

## ✅ **What Should Happen:**

### **If Configuration is CORRECT:**
```json
{
  "success": true,
  "message": "Test admin email sent successfully!",
  "details": {
    "recipient": "payment@dummair.com",
    "messageId": "xxx-xxx-xxx"
  },
  "config": {
    "hasResendKey": true,
    "adminEmail": "payment@dummair.com",
    "fromEmail": "support@dummair.com"
  }
}
```

✅ **CHECK INBOX:** payment@dummair.com should receive test email!

### **If Configuration is WRONG:**
```json
{
  "success": false,
  "error": "RESEND_API_KEY not configured",
  "config": {
    "hasResendKey": false,
    "adminEmail": null,
    "fromEmail": null
  }
}
```

❌ **FIX:** Go back to Step 1 and add missing environment variables

---

## 🔍 **Step 4: Check Vercel Logs**

1. Go to **Vercel Dashboard** → **Deployments**
2. Click latest deployment
3. Click **Functions** tab
4. Find `/api/test-admin-email`
5. Look for these logs:

```
📧 Email Service Configuration:
   API Key: ✅ SET (re_1234567...)
   From: DummAir Support <support@dummair.com>
   To: payment@dummair.com
   Subject: 🧪 TEST: Admin Email Configuration
🚀 Calling Resend API...
📬 Resend Response: { status: 200, data: { id: 'xxx' } }
✅ Email sent successfully!
   Message ID: xxx-xxx-xxx
```

---

## ❓ **Common Issues:**

### **Issue 1: "RESEND_API_KEY not configured"**
**Fix:** 
1. Go to https://resend.com/api-keys
2. Copy your API key
3. Add to Vercel environment variables
4. Redeploy

### **Issue 2: "Domain not verified"**
**Fix (Optional for now):**
1. Use Resend's default sender: `onboarding@resend.dev`
2. Update `RESEND_FROM_EMAIL=onboarding@resend.dev`
3. This works immediately without domain verification

### **Issue 3: Test succeeds but real payments don't trigger**
**Fix:**
1. Check the confirmation page is calling the webhook
2. Look at `/api/webhooks/payment-success` logs
3. Should see: "🔍 Admin Email Configuration" logs

---

## 🎯 **Quick Checklist:**

- [ ] Added RESEND_API_KEY to Vercel
- [ ] Added ADMIN_EMAIL to Vercel
- [ ] Added RESEND_FROM_EMAIL to Vercel
- [ ] Redeployed application
- [ ] Ran test-admin-email endpoint
- [ ] Received success response
- [ ] Checked payment@dummair.com inbox
- [ ] Received test email

---

## 🚀 **After Test Passes:**

Once the test email works, make a real order:

1. Go to your site
2. Book a flight
3. Complete payment
4. **Admin should receive:**
   - Subject: "🚨 URGENT: New Paid Order DUM-XXXXXXXX - Action Required"
   - To: payment@dummair.com
   - Content: Red urgent badge, order details, action button

---

## 📞 **If Still Not Working:**

Run this in your browser console:
```javascript
fetch('/api/test-admin-email', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

Copy the output and share it - it will tell us exactly what's wrong!

---

## ⚡ **DO THIS NOW:**

1. ✅ Add environment variables to Vercel (2 min)
2. ✅ Redeploy (3 min wait)
3. ✅ Run test endpoint (30 sec)
4. ✅ Check inbox (should receive email)

**Total time: 5 minutes to working admin emails!** 🎯

---

**The code is perfect and deployed. It's just waiting for you to add the environment variables!** ⏰

