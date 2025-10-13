-- Create saved_travelers table for registered users to save frequent travelers
CREATE TABLE IF NOT EXISTS saved_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Traveler Information
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  nationality VARCHAR(10),
  passport_number VARCHAR(50),
  
  -- Settings
  is_default BOOLEAN DEFAULT false,
  nickname VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_travelers_user_id ON saved_travelers(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_travelers_is_default ON saved_travelers(is_default);

-- Add comments
COMMENT ON TABLE saved_travelers IS 'Stores frequently used traveler profiles for quick booking';
COMMENT ON COLUMN saved_travelers.is_default IS 'Primary traveler (usually the account holder)';
COMMENT ON COLUMN saved_travelers.nickname IS 'User-friendly label (e.g., "Mom", "Brother")';

-- Enable Row Level Security
ALTER TABLE saved_travelers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can manage their own saved travelers
CREATE POLICY "Users can read own saved travelers" ON saved_travelers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own saved travelers" ON saved_travelers
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own saved travelers" ON saved_travelers
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own saved travelers" ON saved_travelers
  FOR DELETE
  USING (user_id = auth.uid());

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_saved_traveler_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saved_traveler_timestamp
  BEFORE UPDATE ON saved_travelers
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_traveler_timestamp();

