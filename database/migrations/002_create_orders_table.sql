-- Create orders table for storing flight bookings
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_email VARCHAR(255),
  
  status VARCHAR(50) DEFAULT 'pending_payment' CHECK (
    status IN ('pending_payment', 'paid', 'processing', 'completed', 'failed', 'cancelled')
  ),
  
  -- Flight Information
  flight_type VARCHAR(20) NOT NULL CHECK (flight_type IN ('one-way', 'return')),
  flight_from VARCHAR(255) NOT NULL,
  flight_to VARCHAR(255) NOT NULL,
  flight_depart_date DATE NOT NULL,
  flight_return_date DATE,
  flight_airline_pref VARCHAR(255),
  flight_travel_class VARCHAR(50),
  number_of_travelers INTEGER DEFAULT 1 CHECK (number_of_travelers >= 1 AND number_of_travelers <= 10),
  
  -- Payment Information
  payment_provider VARCHAR(50) CHECK (payment_provider IN ('stripe', 'paystack', 'flutterwave')),
  payment_reference VARCHAR(255),
  payment_amount DECIMAL(10, 2),
  payment_currency VARCHAR(10) DEFAULT 'USD',
  
  -- Ticket Information
  ticket_url TEXT,
  admin_notes TEXT,
  admin_assigned BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expected_delivery_by TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT valid_guest_or_user CHECK (
    user_id IS NOT NULL OR guest_email IS NOT NULL
  ),
  CONSTRAINT valid_return_date CHECK (
    flight_type = 'one-way' OR flight_return_date IS NOT NULL
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_provider ON orders(payment_provider);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at DESC);

-- Add comments
COMMENT ON TABLE orders IS 'Stores all flight ticket booking orders';
COMMENT ON COLUMN orders.user_id IS 'Reference to registered user (NULL for guest checkout)';
COMMENT ON COLUMN orders.guest_email IS 'Email for guest checkout orders';
COMMENT ON COLUMN orders.expected_delivery_by IS 'When ticket should be delivered (created_at + 1 hour)';

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own orders (both registered and guest)
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    (guest_email IS NOT NULL AND guest_email = (SELECT email FROM users WHERE id = auth.uid()))
  );

-- Service role can insert orders (for API)
CREATE POLICY "Service can insert orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Admins can read all orders
CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  date_str VARCHAR(8);
  random_num VARCHAR(4);
  new_order_number VARCHAR(50);
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  random_num := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  new_order_number := 'DUM-' || date_str || '-' || random_num;
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create function to set expected delivery time
CREATE OR REPLACE FUNCTION set_expected_delivery()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expected_delivery_by IS NULL THEN
    NEW.expected_delivery_by := NEW.created_at + INTERVAL '1 hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_expected_delivery
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_expected_delivery();

