-- Create tickets table for storing uploaded ticket PDFs
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- File Information
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  file_type VARCHAR(50) DEFAULT 'application/pdf',
  
  -- Upload Information
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Delivery Information
  sent_to_customer BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  
  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Ensure one ticket per order
  UNIQUE(order_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_uploaded_by ON tickets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_tickets_uploaded_at ON tickets(uploaded_at DESC);

-- Add comments
COMMENT ON TABLE tickets IS 'Stores uploaded dummy flight ticket PDFs';
COMMENT ON COLUMN tickets.file_url IS 'Supabase Storage URL for the ticket PDF';
COMMENT ON COLUMN tickets.sent_to_customer IS 'Whether ticket has been emailed to customer';

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read tickets for their orders
CREATE POLICY "Users can read own tickets" ON tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id
      AND (user_id = auth.uid() OR guest_email = (SELECT email FROM users WHERE id = auth.uid()))
    )
  );

-- Admins can manage all tickets
CREATE POLICY "Admins can manage tickets" ON tickets
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert tickets
CREATE POLICY "Service can insert tickets" ON tickets
  FOR INSERT
  WITH CHECK (true);

