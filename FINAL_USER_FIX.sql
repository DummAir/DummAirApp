-- FINAL FIX FOR USER ID MISMATCH
-- Run these commands in Supabase SQL Editor

-- Step 1: Delete the old user record (this won't delete your Auth account!)
DELETE FROM users WHERE email = 'abiolayoung229@gmail.com';

-- Step 2: Insert user with the CORRECT Supabase Auth ID
INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
VALUES (
  '7f8b7372-584a-4776-813f-300955ab5d84',
  'abiolayoung229@gmail.com',
  '',
  'user',
  NOW(),
  NOW()
);

-- Step 3: Verify it worked
SELECT id, email, role FROM users WHERE email = 'abiolayoung229@gmail.com';
-- Should show id: 7f8b7372-584a-4776-813f-300955ab5d84

-- Done! Now booking will work perfectly!



