-- RESTRICT ADMIN ACCESS TO SPECIFIC EMAIL ONLY
-- Run this in Supabase SQL Editor

-- ============================================================================
-- REMOVE ROLE-BASED ADMIN POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- ============================================================================
-- ADD EMAIL-SPECIFIC ADMIN POLICIES
-- ============================================================================

-- 1. Only your email can read all orders
CREATE POLICY "Specific admin can read all orders"
ON orders FOR SELECT
USING (
  auth.email() = 'abiolayoung229@gmail.com'
);

-- 2. Only your email can update orders
CREATE POLICY "Specific admin can update orders"
ON orders FOR UPDATE
USING (
  auth.email() = 'abiolayoung229@gmail.com'
);

-- ============================================================================
-- VERIFY POLICIES
-- ============================================================================

SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'orders' 
AND policyname LIKE '%admin%';

-- Should show:
-- "Specific admin can read all orders"
-- "Specific admin can update orders"

-- ============================================================================
-- TEST ACCESS
-- ============================================================================

-- Login with abiolayoung229@gmail.com → Can access /admin ✅
-- Login with any other email → Redirected to /dashboard ✅

-- ============================================================================
-- DONE!
-- ============================================================================
-- Now only YOU have admin access!

