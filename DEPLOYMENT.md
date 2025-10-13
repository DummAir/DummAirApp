# 🚀 Vercel Deployment Guide for DummAir

## Prerequisites

Before deploying to Vercel, ensure you have:

1. ✅ A [Vercel](https://vercel.com) account
2. ✅ A [Supabase](https://supabase.com) project set up
3. ✅ Stripe and Flutterwave accounts configured
4. ✅ All environment variables ready

---

## 📋 Step-by-Step Deployment

### 1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Import to Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### 3. **Configure Environment Variables**

In Vercel project settings, add these environment variables:

#### **Supabase (Required)**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Stripe (Required)**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **Flutterwave (Required)**
```
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
FLUTTERWAVE_SECRET_KEY=FLWSECK-...
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK...
```

#### **Optional**
```
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. **Deploy**

Click **"Deploy"** and wait for the build to complete (~2-3 minutes)

---

## 🔧 Post-Deployment Setup

### 1. **Update Supabase RLS Policies**

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow public read access for confirmation page
CREATE POLICY "Allow reading orders by ID" ON orders 
  FOR SELECT USING (true);

-- Allow admin access (replace with your admin email)
CREATE POLICY "Admin can read all orders" ON orders 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'abiolayoung229@gmail.com'
    )
  );

CREATE POLICY "Admin can update orders" ON orders 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'abiolayoung229@gmail.com'
    )
  );

-- Allow reading passengers
CREATE POLICY "Allow reading passengers" ON passengers 
  FOR SELECT USING (true);
```

### 2. **Create Supabase Storage Bucket**

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named **`tickets`**
3. Set it as **Public** or configure RLS:

```sql
-- Allow admins to upload
CREATE POLICY "Admin can upload tickets" ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'tickets' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.email = 'abiolayoung229@gmail.com'
    )
  );

-- Allow authenticated users to download their tickets
CREATE POLICY "Users can download tickets" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'tickets');
```

### 3. **Configure Payment Webhooks**

#### **Stripe Webhook**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`
4. Copy webhook secret and add to Vercel env vars

#### **Flutterwave Webhook**
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Add URL: `https://your-app.vercel.app/api/webhooks/payment-success`

---

## ✅ Verification Checklist

After deployment, test these features:

- [ ] Landing page loads
- [ ] User signup/login works
- [ ] Airport search autocomplete works
- [ ] Booking flow completes
- [ ] Stripe payment works
- [ ] Flutterwave payment works
- [ ] Order confirmation page displays
- [ ] User dashboard shows orders
- [ ] Admin can access `/admin` (with authorized email)
- [ ] Admin can mark orders as completed
- [ ] Admin can upload tickets
- [ ] Users can download tickets

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Run `npm run build` locally to test

### 500 Error
- Check Vercel function logs
- Verify Supabase connection
- Check API route error messages

### Payment Not Working
- Verify payment gateway keys (live vs test)
- Check webhook configuration
- Review browser console for errors

### Admin Access Denied
- Verify email matches in RLS policies
- Check user exists in `users` table
- Run signup flow if needed

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase with Vercel](https://supabase.com/docs/guides/platform/vercel)

---

## 🔄 Redeploying

After code changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy! 🎉


