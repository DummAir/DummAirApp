-- DummAir Database Schema - Complete Setup
-- Run this file in Supabase SQL Editor to create all tables
-- Date: October 9, 2025

-- ============================================================================
-- STEP 1: Create Users Table
-- ============================================================================
\i 001_create_users_table.sql

-- ============================================================================
-- STEP 2: Create Orders Table  
-- ============================================================================
\i 002_create_orders_table.sql

-- ============================================================================
-- STEP 3: Create Passengers Table
-- ============================================================================
\i 003_create_passengers_table.sql

-- ============================================================================
-- STEP 4: Create Payments Table
-- ============================================================================
\i 004_create_payments_table.sql

-- ============================================================================
-- STEP 5: Create Tickets Table
-- ============================================================================
\i 005_create_tickets_table.sql

-- ============================================================================
-- STEP 6: Create Email Logs Table
-- ============================================================================
\i 006_create_email_logs_table.sql

-- ============================================================================
-- STEP 7: Create Saved Travelers Table
-- ============================================================================
\i 007_create_saved_travelers_table.sql

-- ============================================================================
-- STEP 8: Create Notifications Table
-- ============================================================================
\i 008_create_notifications_table.sql

-- ============================================================================
-- STEP 9: Create Admin User (Default)
-- ============================================================================
-- Note: Change the email and password hash as needed
-- Password: Admin@123 (hash this properly in production!)

INSERT INTO users (email, full_name, role, email_verified, password_hash)
VALUES (
  'admin@dummair.com',
  'Admin User',
  'admin',
  true,
  '$2a$10$YourHashedPasswordHere' -- Replace with actual bcrypt hash
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check all indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample test order
/*
INSERT INTO orders (
  order_number, guest_email, status, flight_type,
  flight_from, flight_to, flight_depart_date,
  number_of_travelers, payment_amount
) VALUES (
  'DUM-20251009-TEST',
  'test@example.com',
  'pending_payment',
  'one-way',
  'New York',
  'London',
  '2025-12-25',
  1,
  25.00
);
*/

-- ============================================================================
-- CLEANUP (if needed to start fresh)
-- ============================================================================
/*
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS saved_travelers CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS passengers CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS generate_order_number CASCADE;
DROP FUNCTION IF EXISTS set_order_number CASCADE;
DROP FUNCTION IF EXISTS set_expected_delivery CASCADE;
DROP FUNCTION IF EXISTS update_payment_timestamp CASCADE;
DROP FUNCTION IF EXISTS update_saved_traveler_timestamp CASCADE;
*/

