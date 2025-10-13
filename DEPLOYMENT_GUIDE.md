# 🚀 DummAir Deployment Guide

## Overview
This guide will help you deploy DummAir to Vercel with all required environment variables and configurations.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ Vercel account
- ✅ Supabase project with database setup
- ✅ Stripe account (for payments)
- ✅ Flutterwave account (for payments)
- ✅ SendGrid account (for emails)
- ✅ All API keys and credentials ready

---

## 🔧 Step 1: Environment Variables Setup

### Required Environment Variables

After deploying to Vercel, add these environment variables in your Vercel Dashboard:

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

#### 1. Supabase (Database & Auth)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```
*Get from: Supabase Dashboard → Project Settings → API*

#### 2. Stripe Payment Gateway
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```
*Get from: Stripe Dashboard → Developers → API Keys*

#### 3. Flutterwave Payment Gateway
```
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxx
```
*Get from: Flutterwave Dashboard → Settings → API*

#### 4. Application URL (⚠️ CRITICAL)
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```
**Important Notes:**
- Replace with your **actual Vercel deployment URL**
- Find it in: Vercel Dashboard → Deployments → Your latest deployment
- **DO NOT include a trailing slash**
- This is required for payment redirects

#### 5. Email Service (Optional but Recommended)
```
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=DummAir
ADMIN_EMAIL=admin@yourdomain.com
```
*Get from: SendGrid Dashboard → Settings → API Keys*

#### 6. WhatsApp Support
```
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```
*Your WhatsApp business number for customer support*

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### Option B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## ⚙️ Step 3: Configure Environment Variables

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add each variable:**
   - Click "Add New"
   - Enter Key and Value
   - Select environments: ✅ Production ✅ Preview ✅ Development
   - Click Save

3. **Critical Variables to Set First:**
   - `NEXT_PUBLIC_APP_URL` (prevents payment errors)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - `FLUTTERWAVE_SECRET_KEY`

4. **After adding variables:**
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"

---

## ✅ Step 4: Verify Deployment

### Test the Application

1. **Visit your deployment URL**
2. **Test booking flow:**
   - Create a new booking
   - Fill in passenger details
   - Try payment with Stripe
   - Try payment with Flutterwave
   - Verify confirmation page loads
   - Check email delivery

3. **Test admin dashboard:**
   - Login as admin
   - View orders
   - Check order details
   - Test mark as completed

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment
3. Go to **Functions** or **Logs** tab
4. Look for any errors

---

## 🐛 Common Issues & Solutions

### Issue: "cannot GET /v3/hosted/undefined/confirmation"
**Solution:** 
- Add `NEXT_PUBLIC_APP_URL` environment variable
- Must be your actual Vercel URL (e.g., `https://your-app.vercel.app`)
- No trailing slash
- Redeploy after adding

### Issue: "Stripe expired API key"
**Solution:**
- Update `STRIPE_SECRET_KEY` with current key from Stripe Dashboard
- Redeploy after updating

### Issue: Database connection fails
**Solution:**
- Verify all Supabase variables are correct
- Check `DATABASE_URL` has correct password
- Ensure Supabase project is active

### Issue: Emails not sending
**Solution:**
- Verify `SENDGRID_API_KEY` is valid
- Check SendGrid account is active
- Verify sender email is verified in SendGrid

---

## 🔒 Security Best Practices

1. **Never commit API keys** to Git
   - Use `.env.local` for local development
   - Add to Vercel environment variables for production

2. **Use different keys** for development and production
   - Test keys: `_test_` or `_TEST-`
   - Live keys: `_live_` or `_LIVE-`

3. **Rotate API keys** regularly
   - Update in Vercel dashboard
   - Redeploy after updating

4. **Restrict API key permissions**
   - Stripe: Use restricted keys when possible
   - Supabase: Use service role key only when needed

---

## 📊 Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Application deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Database connected and accessible
- [ ] Payment gateways tested (Stripe & Flutterwave)
- [ ] Email delivery working
- [ ] Admin dashboard accessible
- [ ] WhatsApp support link working
- [ ] Error tracking configured
- [ ] Logs monitoring set up

---

## 🔄 Updating Your Deployment

Whenever you push new code to GitHub:
1. Vercel automatically detects changes
2. Builds and deploys new version
3. Zero downtime deployment
4. Previous version available for rollback

To manually redeploy:
1. Go to Deployments tab
2. Click ⋯ on deployment
3. Click "Redeploy"

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test locally first with `npm run dev`
4. Check the error messages in browser console

---

## 🎉 You're All Set!

Your DummAir application should now be live and fully functional!

**Next Steps:**
- Monitor your deployment
- Set up analytics (optional)
- Configure custom domain (optional)
- Set up monitoring/alerts (optional)

