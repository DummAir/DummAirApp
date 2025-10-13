-- Create passengers table for storing traveler information
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  phone_country_code VARCHAR(10),
  nationality VARCHAR(10),
  
  -- Passenger Order
  passenger_number INTEGER NOT NULL CHECK (passenger_number >= 1),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT valid_passenger_number CHECK (passenger_number >= 1 AND passenger_number <= 10),
  CONSTRAINT unique_passenger_per_order UNIQUE (order_id, passenger_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_passengers_order_id ON passengers(order_id);
CREATE INDEX IF NOT EXISTS idx_passengers_email ON passengers(email);
CREATE INDEX IF NOT EXISTS idx_passengers_created_at ON passengers(created_at DESC);

-- Add comments
COMMENT ON TABLE passengers IS 'Stores passenger/traveler details for each order';
COMMENT ON COLUMN passengers.passenger_number IS 'Position in passenger list (1, 2, 3...)';
COMMENT ON COLUMN passengers.metadata IS 'Additional passenger data as JSON';

-- Enable Row Level Security
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read passengers for their orders
CREATE POLICY "Users can read own passengers" ON passengers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id
      AND (user_id = auth.uid() OR guest_email = (SELECT email FROM users WHERE id = auth.uid()))
    )
  );

-- Service can insert passengers
CREATE POLICY "Service can insert passengers" ON passengers
  FOR INSERT
  WITH CHECK (true);

-- Admins can read all passengers
CREATE POLICY "Admins can read all passengers" ON passengers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

