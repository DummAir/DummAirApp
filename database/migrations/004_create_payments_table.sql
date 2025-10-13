-- Create payments table for tracking all payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Payment Provider Info
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('stripe', 'paystack', 'flutterwave')),
  transaction_id VARCHAR(255),
  reference VARCHAR(255) UNIQUE NOT NULL,
  
  -- Amount Info
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')
  ),
  
  -- Payment Method Details
  payment_method VARCHAR(50),
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  card_country VARCHAR(10),
  
  -- Error Handling
  error_message TEXT,
  error_code VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- Add comments
COMMENT ON TABLE payments IS 'Tracks all payment transactions across all providers';
COMMENT ON COLUMN payments.reference IS 'Unique payment reference from provider';
COMMENT ON COLUMN payments.metadata IS 'Provider-specific data as JSON';

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read payments for their orders
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id
      AND (user_id = auth.uid() OR guest_email = (SELECT email FROM users WHERE id = auth.uid()))
    )
  );

-- Service can insert/update payments (for webhooks)
CREATE POLICY "Service can manage payments" ON payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Admins can read all payments
CREATE POLICY "Admins can read all payments" ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update payment timestamp
CREATE OR REPLACE FUNCTION update_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' THEN
    NEW.completed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_timestamp
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_timestamp();

