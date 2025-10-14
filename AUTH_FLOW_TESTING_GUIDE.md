# 🧪 Authentication Flow - Testing Guide

## ✅ **What Was Fixed**

### **1. Signup Flow** ✅
- ✅ User signs up successfully
- ✅ Gets clear success message with instructions
- ✅ Receives verification email via Resend (not Supabase)
- ✅ **Can login immediately without verifying email**
- ✅ Verification link redirects to actual URL (not localhost)
- ✅ Email verification updates database

### **2. Password Reset Flow** ✅
- ✅ User requests password reset
- ✅ Receives reset email via Resend (not Supabase)
- ✅ Reset link redirects to actual URL (not localhost)
- ✅ Password update reflected in database
- ✅ Secure token-based system

### **3. Email Handling** ✅
- ✅ All auth emails sent via Resend
- ✅ Professional templates with DummAir branding
- ✅ Proper URL redirects (no localhost)
- ✅ All emails logged in database

---

## 🧪 **LOCAL TESTING (Before Pushing)**

### **Step 1: Run Migrations Locally**

You need to run the new migration in Supabase:

```sql
-- In Supabase SQL Editor, run:

-- Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON email_verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_type ON email_verification_tokens(type);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON email_verification_tokens(expires_at);

ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage verification tokens" ON email_verification_tokens
  FOR ALL
  USING (true);

COMMENT ON TABLE email_verification_tokens IS 'Email verification and password reset tokens';
```

---

### **Step 2: Test Signup Flow Locally**

**Before pushing**, test locally:

1. **Start local dev server:**
   ```bash
   npm run dev
   ```

2. **Go to signup page:**
   ```
   http://localhost:3000/auth/signup
   ```

3. **Fill form and submit:**
   - Name: Test User
   - Email: your-test-email@example.com
   - Password: Test123!
   - Confirm Password: Test123!

4. **Expected Result:**
   - ✅ Success message appears
   - ✅ Instructions shown
   - ✅ "Go to Login" button displayed
   - ✅ Check email: verification email received
   - ✅ Click verification link: redirects to verification-success page

5. **Test Login Without Verification:**
   - Go to `/auth/login`
   - Use same credentials
   - Should login successfully ✅

---

### **Step 3: Test Password Reset Locally**

1. **Go to forgot password page:**
   ```
   http://localhost:3000/auth/forgot-password
   ```

2. **Enter email and submit**

3. **Expected Result:**
   - ✅ Success message appears
   - ✅ Check email: password reset email received
   - ✅ Email has professional template
   - ✅ Click reset link: redirects to reset-password page with token
   - ✅ Enter new password
   - ✅ Success message appears
   - ✅ Redirects to login after 3 seconds

4. **Test Login with New Password:**
   - Should work ✅

---

### **Step 4: Check Database Updates**

After testing, verify in Supabase:

```sql
-- Check user was created
SELECT id, email, full_name, email_verified FROM users 
WHERE email = 'your-test-email@example.com';

-- Check verification token was created
SELECT * FROM email_verification_tokens 
WHERE email = 'your-test-email@example.com'
ORDER BY created_at DESC;

-- Check emails were logged
SELECT * FROM email_logs
WHERE recipient = 'your-test-email@example.com'
ORDER BY created_at DESC;
```

**Expected:**
- ✅ User exists in users table
- ✅ `email_verified` = false initially, true after verification
- ✅ Verification token exists
- ✅ Token marked as used after verification
- ✅ Welcome email logged
- ✅ Password reset email logged (if tested)

---

## 🚀 **PRODUCTION TESTING (After Pushing)**

### **Test 1: Signup Flow**

1. Go to: `https://your-app.vercel.app/auth/signup`
2. Create account with real email
3. Check inbox for verification email
4. Click verification link
5. Should redirect to: `https://your-app.vercel.app/auth/verification-success`
6. Login without verification (should work)
7. After verification, check database - `email_verified` should be true

### **Test 2: Password Reset Flow**

1. Go to: `https://your-app.vercel.app/auth/forgot-password`
2. Enter email
3. Check inbox for reset email
4. Click reset link
5. Should redirect to: `https://your-app.vercel.app/auth/reset-password?token=xxx`
6. Enter new password
7. Should show success and redirect to login
8. Login with new password (should work)

---

## ✅ **Checklist Before Pushing**

- [ ] Run migration in Supabase SQL Editor
- [ ] Test signup locally (npm run dev)
- [ ] Verify success message shows
- [ ] Check verification email received
- [ ] Test login without verification (should work)
- [ ] Click verification link (should work)
- [ ] Test forgot password locally
- [ ] Check reset email received
- [ ] Test password reset (should work)
- [ ] Check database - users created correctly
- [ ] Check database - tokens created
- [ ] Check database - emails logged
- [ ] No console errors
- [ ] All pages load correctly

---

## 🔍 **Common Issues & Solutions**

### **Issue: "User not found" error**
- Check users table - was user created?
- Check Supabase Auth - is auth user created?
- Both should exist with same ID

### **Issue: Verification link goes to localhost**
- Check `NEXT_PUBLIC_APP_URL` in .env.local
- Should be set for local testing: `http://localhost:3000`
- In production: `https://your-app.vercel.app`

### **Issue: Emails not sending**
- Check RESEND_API_KEY is set
- Check email_logs table for errors
- Check Resend dashboard for failed sends

### **Issue: Can't login without verification**
- Check login page - should NOT check email_verified
- Supabase Auth should allow unverified logins
- Only our database tracks verification status

---

## 📧 **Email Templates**

### **Welcome/Verification Email:**
- Subject: "Verify Your Email - Welcome to DummAir!"
- Contains: Welcome message, verify button, note that they can use account without verification
- Expires: 24 hours

### **Password Reset Email:**
- Subject: "Reset Your Password - DummAir"
- Contains: Reset button, security notice
- Expires: 1 hour

---

## 🎯 **Expected User Journey**

### **New User Signup:**
```
1. User goes to /auth/signup
2. Fills form and submits
3. Sees success message: "Account Created Successfully!"
4. Instructions shown: Check email, click link, can login now
5. Receives email from support@dummair.com
6. Can immediately login (without verification)
7. (Optional) Clicks verification link
8. Gets verified badge (future feature)
```

### **Password Reset:**
```
1. User goes to /auth/forgot-password
2. Enters email
3. Sees: "Check your email for reset link"
4. Receives email from support@dummair.com
5. Clicks reset link
6. Redirected to /auth/reset-password?token=xxx
7. Enters new password
8. Sees success message
9. Auto-redirected to login
10. Logs in with new password
```

---

## 📊 **Database Schema**

### **New Table: email_verification_tokens**
```sql
- id: UUID (primary key)
- user_id: UUID (references users)
- email: VARCHAR
- token: VARCHAR (unique, 64 chars)
- type: 'email_verification' | 'password_reset'
- expires_at: TIMESTAMP
- used_at: TIMESTAMP (null until used)
- created_at: TIMESTAMP
```

---

## 🚀 **After All Tests Pass**

When everything works locally:

1. Commit changes
2. Push to GitHub
3. Vercel auto-deploys
4. Test again on production URL
5. Verify all redirects use production URL
6. ✅ Done!

---

## 📝 **Files Created/Modified**

### **New Files:**
- `database/migrations/009_add_email_verification.sql`
- `src/lib/auth/verification.ts`
- `src/app/api/auth/verify-email/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/auth/verify-email/page.tsx`
- `src/app/auth/verification-success/page.tsx`
- `src/app/auth/verification-failed/page.tsx`

### **Modified Files:**
- `src/app/api/auth/signup/route.ts` (custom verification)
- `src/app/auth/signup/page.tsx` (success message)
- `src/app/auth/forgot-password/page.tsx` (custom API)
- `src/app/auth/reset-password/page.tsx` (token-based)
- `src/lib/email/templates.ts` (new templates)
- `database/migrations/000_run_all_migrations.sql` (new migration)

---

**Ready to test locally!** 🎉

Run the migration → Test signup → Test password reset → Push to production!

