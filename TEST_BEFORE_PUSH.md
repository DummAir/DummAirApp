# ⚠️ TEST BEFORE PUSHING - Critical Steps

## 🚨 **IMPORTANT: Test Locally First!**

Don't push yet! Follow these steps to test everything works:

---

## 📋 **Step 1: Run Database Migration (REQUIRED)**

**Open Supabase SQL Editor** and run this:

```sql
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

✅ **Verify migration succeeded** - should say "Success"

---

## 🧪 **Step 2: Test Signup Flow Locally**

### **Start Dev Server:**
```bash
npm run dev
```

### **Test Signup:**

1. Go to: `http://localhost:3000/auth/signup`
2. Fill in:
   - Name: Test User
   - Email: **YOUR REAL EMAIL** (to receive verification)
   - Password: Test123!
   - Confirm: Test123!
3. Click "Create Account"

**Expected:**
- ✅ Success screen appears
- ✅ Message: "Account Created Successfully!"
- ✅ Instructions shown
- ✅ "Go to Login" button visible

**Check Email:**
- ✅ Received "Verify Your Email - Welcome to DummAir!"
- ✅ Email has verify button
- ✅ Click verify button
- ✅ Redirects to: `http://localhost:3000/auth/verification-success`
- ✅ Shows success message

**Test Login Without Verification:**
- Go to `/auth/login`
- Use same credentials (before clicking verify link)
- ✅ Should login successfully!

**Check Database:**
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
-- email_verified should be false initially

SELECT * FROM email_verification_tokens 
WHERE email = 'your-email@example.com';
-- Should see token entry

SELECT * FROM email_logs
WHERE recipient = 'your-email@example.com';
-- Should see welcome email logged
```

---

## 🧪 **Step 3: Test Password Reset Locally**

### **Test Forgot Password:**

1. Go to: `http://localhost:3000/auth/forgot-password`
2. Enter email: your-email@example.com
3. Click "Send Reset Link"

**Expected:**
- ✅ Success message: "Check your email"
- ✅ Email received: "Reset Your Password - DummAir"
- ✅ Email has professional template
- ✅ Click "Reset Password" button
- ✅ Redirects to: `http://localhost:3000/auth/reset-password?token=xxx`

### **Test Password Reset:**

1. On reset password page
2. Enter new password twice
3. Click "Reset Password"

**Expected:**
- ✅ Success message appears
- ✅ "Password Reset Successful!"
- ✅ Auto-redirects to login after 3 seconds

### **Test Login with New Password:**

1. Go to `/auth/login`
2. Use email and NEW password
3. ✅ Should login successfully!

**Check Database:**
```sql
SELECT * FROM email_verification_tokens 
WHERE email = 'your-email@example.com' AND type = 'password_reset';
-- Should see password reset token
-- used_at should not be null after reset

SELECT * FROM email_logs
WHERE email_type = 'password_reset'
ORDER BY created_at DESC LIMIT 5;
-- Should see password reset email logged
```

---

## ❌ **IF ANY TEST FAILS, DON'T PUSH!**

If something doesn't work:
1. Check console for errors
2. Check Supabase logs
3. Check email_logs table for errors
4. Tell me what failed - I'll fix it!

---

## ✅ **ONLY PUSH IF ALL TESTS PASS**

When everything works locally:

```bash
git add -A
git commit -m "feat: Complete auth flow overhaul with custom email verification

- Replace Supabase email confirmation with Resend
- Allow login without email verification
- Add custom email verification system with tokens
- Add custom password reset with Resend
- Fix all redirects to use actual URL (not localhost)
- Add verification success/failed pages
- Add email verification templates
- Update database with verification tokens table
- All auth emails now via Resend with professional templates"

git push origin main
```

---

## 🎯 **Success Criteria**

All these must work before pushing:

### **Signup:**
- [ ] User can create account
- [ ] Success message shows
- [ ] Verification email received
- [ ] Email has correct template
- [ ] Verification link uses localhost (in dev)
- [ ] Clicking link verifies email
- [ ] **User can login WITHOUT verification**
- [ ] Database updated correctly

### **Password Reset:**
- [ ] User can request reset
- [ ] Reset email received
- [ ] Email has correct template  
- [ ] Reset link uses localhost (in dev)
- [ ] Password can be reset
- [ ] Login with new password works
- [ ] Database updated correctly

### **Database:**
- [ ] email_verification_tokens table exists
- [ ] Tokens created for both types
- [ ] Tokens marked as used after use
- [ ] email_logs has welcome emails
- [ ] email_logs has password reset emails
- [ ] users table updated correctly

---

## 📞 **After Testing:**

**If all tests pass:**
✅ Push to production
✅ Test again on production URL
✅ Verify redirects use production URL

**If any test fails:**
❌ DON'T PUSH
❌ Tell me what failed
❌ I'll fix it before pushing

---

## ⚡ **Quick Test Commands**

```sql
-- Check new table exists
SELECT * FROM email_verification_tokens LIMIT 1;

-- Check recent signups
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

-- Check welcome emails
SELECT * FROM email_logs 
WHERE email_type = 'welcome' 
ORDER BY created_at DESC LIMIT 5;

-- Check password reset emails
SELECT * FROM email_logs 
WHERE email_type = 'password_reset'
ORDER BY created_at DESC LIMIT 5;
```

---

**Test thoroughly before pushing!** This affects all user authentication. 🎯

