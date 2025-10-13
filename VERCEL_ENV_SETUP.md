# Vercel Environment Variables Setup

## ⚠️ IMPORTANT: Required Environment Variables for Vercel Deployment

Before deploying to Vercel, you MUST add these environment variables to your Vercel project:

### How to Add Environment Variables on Vercel:
1. Go to: https://vercel.com/dashboard
2. Select your project (DummAir)
3. Go to: **Settings** → **Environment Variables**
4. Add each variable below

---

## 🔑 Required Environment Variables

### 1. Supabase (Database & Auth)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 2. Stripe Payment Gateway
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
```
*Get these from your Stripe Dashboard → Developers → API Keys*

### 3. Flutterwave Payment Gateway
```
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key_here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key_here
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST_your_encryption_key
```
*Get these from your Flutterwave Dashboard → Settings → API*

### 4. Application URL ⭐ CRITICAL FOR PAYMENT REDIRECTS
```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```
**⚠️ IMPORTANT:** 
- Replace `https://your-vercel-domain.vercel.app` with your **ACTUAL Vercel deployment URL**
- Find your URL in Vercel Dashboard → Deployments → Your latest deployment
- Example: `https://dumm-air.vercel.app` or `https://your-custom-domain.com`
- **DO NOT include a trailing slash**
- This is REQUIRED for Flutterwave payment redirects to work correctly
- Without this, you'll get "cannot GET /v3/hosted/undefined/confirmation" error

### 5. Optional (Email - if you want email notifications)
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@dummair.com
ADMIN_EMAIL=abiolayoung229@gmail.com
```

---

## ✅ After Adding All Variables

1. **Redeploy** your project on Vercel
2. All payment gateways should work correctly
3. Database connections will be established

---

## 🚨 Common Errors

### "cannot GET /v3/hosted/undefined/confirmation" (Flutterwave)
- This means `NEXT_PUBLIC_APP_URL` is NOT set or is undefined
- Go to Vercel Dashboard → Settings → Environment Variables
- Add `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL
- Example: `https://dumm-air.vercel.app` (no trailing slash)
- **Important:** After adding this variable, you MUST redeploy your app

### "STRIPE_SECRET_KEY is not set"
- Make sure you added `STRIPE_SECRET_KEY` to Vercel environment variables
- Check that there are no extra spaces or quotes

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase dashboard for correct credentials

---

## 📝 Notes

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables (like `STRIPE_SECRET_KEY`) are server-side only
- After updating environment variables, you MUST redeploy for changes to take effect

