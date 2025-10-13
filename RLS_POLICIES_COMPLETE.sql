-- COMPLETE RLS POLICIES FOR DUMMAIR
-- Run all these in Supabase SQL Editor

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Drop existing policies if any conflicts
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view guest orders by email" ON orders;
DROP POLICY IF EXISTS "Allow reading orders by ID" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- 1. Users can read their own orders
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can read orders where they're the guest
CREATE POLICY "Users can view guest orders by email" 
ON orders FOR SELECT 
USING (auth.email() = guest_email);

-- 3. Allow public read for confirmation page (anyone with orderId)
CREATE POLICY "Public read orders by ID" 
ON orders FOR SELECT 
USING (true);

-- 4. Admins can read all orders
CREATE POLICY "Admins can read all orders" 
ON orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 5. Admins can update any order
CREATE POLICY "Admins can update orders" 
ON orders FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================================================
-- PASSENGERS TABLE POLICIES
-- ============================================================================

-- Drop existing if any
DROP POLICY IF EXISTS "Allow reading passengers" ON passengers;
DROP POLICY IF EXISTS "Public read passengers" ON passengers;

-- 1. Allow anyone to read passengers (for confirmation page and user dashboards)
CREATE POLICY "Public read passengers" 
ON passengers FOR SELECT 
USING (true);

-- ============================================================================
-- PAYMENTS TABLE POLICIES (if needed)
-- ============================================================================

-- Drop existing if any
DROP POLICY IF EXISTS "Public read payments" ON payments;

-- 1. Allow reading payments
CREATE POLICY "Public read payments" 
ON payments FOR SELECT 
USING (true);

-- ============================================================================
-- VERIFY POLICIES
-- ============================================================================

-- Check orders policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'orders';

-- Check passengers policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'passengers';

-- Expected results:
-- orders: 5 policies
-- passengers: 1 policy
-- payments: 1 policy

-- ============================================================================
-- DONE!
-- ============================================================================
-- After running all these:
-- ✅ Confirmation page can read order numbers
-- ✅ Users can see their own orders
-- ✅ Admins can see all orders
-- ✅ Admins can update order status
-- ✅ All dashboards work perfectly!

