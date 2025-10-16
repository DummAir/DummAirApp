# 🎉 20% OFF LAUNCH PROMO - DOCUMENTATION

## Overview
This document tracks the 20% OFF launch promotion that reduces prices across the entire DummAir platform.

**Promo Start Date:** January 2025  
**Status:** ACTIVE ✅  
**Discount:** 20% OFF all bookings

---

## Price Changes

### Original Prices
- **One-way ticket:** $25
- **Round trip ticket:** $45

### Promo Prices (20% OFF)
- **One-way ticket:** $20 (save $5)
- **Round trip ticket:** $36 (save $9)

---

## Files Modified

### 1. **Landing Page (`src/app/page.tsx`)**

#### Promo Banner (Top of Page)
- **Line 21-28:** Yellow gradient banner at top
- **Message:** "🎉 LAUNCH PROMO: Get 20% OFF on ALL bookings!"
- **Responsive:** Shows full message on desktop, shortened on mobile

#### Hero CTA Button
- **Line 75-84:** "Book Now" button
- **Shows:** "20% OFF" badge, strikethrough $25, new price $20

#### Hero Card (Image Overlay)
- **Line 105-122:** Price card on hero image
- **Shows:** Animated "20% OFF" badge, strikethrough $25, new price $20

### 2. **Booking Review Page (`src/components/booking/BookingReview.tsx`)**

#### Price Calculation Functions
- **Line 74-82:** Updated `getBasePrice()` and added `getOriginalPrice()`
  ```typescript
  getBasePrice() {
    return state.flightType === 'one-way' ? 20 : 36; // Promo prices
  }
  
  getOriginalPrice() {
    return state.flightType === 'one-way' ? 25 : 45; // Original prices
  }
  ```

#### Desktop Price Summary
- **Line 375-399:** Desktop checkout sidebar
- **Shows:** 
  - "🎉 20% OFF Launch Promo" badge (animated)
  - Strikethrough original price
  - New discounted price
  - "You save $X!" message

#### Payment Button
- **Line 360, 520:** Shows discounted total price

### 3. **Styles (`src/app/globals.css`)**

#### Gradient Animation
- **Line 51-61:** `@keyframes gradient` animation
- **Line 99-102:** `.animate-gradient` class
- **Purpose:** Animated yellow banner background

### 4. **Payment Gateway (`src/app/api/payment/route.ts`)**
- **No changes needed!** Payment already uses dynamic `amount` from frontend
- Automatically charges the new discounted prices ($20 or $36)

---

## How It Works

### Flow:
1. **User visits homepage** → Sees yellow promo banner and discounted prices
2. **User starts booking** → Selects flight type (one-way or round-trip)
3. **System calculates price** → Uses `getBasePrice()` which returns promo prices
4. **Review page shows savings** → Displays original price (strikethrough) and new price
5. **Payment processed** → Charges the discounted amount ($20 or $36 × travelers)

### Visual Elements:
- 🎉 **Yellow promo banner** at top (animated gradient)
- 🏷️ **"20% OFF" badges** on CTA buttons and checkout
- 💰 **Strikethrough prices** showing original $25 or $45
- ✨ **Savings message** "You save $X!"
- ⚡ **Pulsing animations** on promo badges

---

## How to Remove/Modify Promo

### To End the Promo (Restore Original Prices):

1. **Update `src/components/booking/BookingReview.tsx`:**
   ```typescript
   const getBasePrice = () => {
     return state.flightType === 'one-way' ? 25 : 45; // Restore original prices
   };
   
   // Remove getOriginalPrice() function (no longer needed)
   ```

2. **Update `src/app/page.tsx`:**
   - **Line 21-28:** Remove the yellow promo banner
   - **Line 75-84:** Simplify CTA button:
     ```tsx
     <Link href="/book" className="...">
       Book Now - From $25
     </Link>
     ```
   - **Line 105-122:** Remove "20% OFF" badge and strikethrough

3. **Update Desktop Checkout (`src/components/booking/BookingReview.tsx`):**
   - **Line 383-397:** Remove promo badge, strikethrough, and savings message
   - Restore simple price display

4. **Commit changes:**
   ```bash
   git add -A
   git commit -m "chore: End 20% OFF launch promo - restore original pricing"
   git push origin main
   ```

### To Change Discount Percentage:

Simply update the prices in `getBasePrice()`:
- For **30% OFF:** One-way = $17.50, Round-trip = $31.50
- For **50% OFF:** One-way = $12.50, Round-trip = $22.50

---

## Testing Checklist

- [ ] Homepage shows yellow promo banner
- [ ] Hero CTA shows "20% OFF" badge and $20 price
- [ ] Hero card shows discounted price
- [ ] Booking flow calculates $20 (one-way) or $36 (round-trip)
- [ ] Review page shows strikethrough original price
- [ ] Review page shows "You save $X!" message
- [ ] Payment charges correct discounted amount
- [ ] Multiple travelers: price multiplies correctly
- [ ] Mobile view displays promo banner properly

---

## Analytics to Track

- **Conversion rate** during promo vs. normal pricing
- **Average order value** (AOV)
- **Number of bookings** per day
- **Customer feedback** on pricing
- **Revenue** during promo period

---

## Notes

- **Payment gateway requires NO changes** - it uses dynamic amounts from frontend
- **Database stores actual charged amount** - historical orders show promo prices
- **Emails show charged amount** - customers see $20 or $36 in receipts
- **Refund policy still applies** - 100% refund for non-delivery, etc.

---

## Support

If customers ask about the promo:
- **Valid for:** All bookings (one-way and round-trip)
- **Duration:** Limited time (while promotion lasts)
- **Automatically applied:** No promo code needed
- **Stackable:** No (this is the main discount)

---

**Last Updated:** January 2025  
**Maintained by:** DummAir Development Team

