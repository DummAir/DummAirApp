-- Create email_logs table for tracking all email communications
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Email Details
  email_type VARCHAR(50) NOT NULL CHECK (
    email_type IN (
      'payment_confirmation',
      'ticket_delivery',
      'admin_notification',
      'password_reset',
      'welcome',
      'order_update',
      'payment_reminder',
      'receipt'
    )
  ),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  
  -- Sending Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')
  ),
  
  -- Provider Info
  provider VARCHAR(50) DEFAULT 'sendgrid',
  provider_message_id VARCHAR(255),
  error_message TEXT,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);

-- Add comments
COMMENT ON TABLE email_logs IS 'Tracks all emails sent by the system';
COMMENT ON COLUMN email_logs.provider_message_id IS 'Message ID from email service provider';

-- Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can read all email logs
CREATE POLICY "Admins can read email logs" ON email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service can insert email logs
CREATE POLICY "Service can insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (true);

