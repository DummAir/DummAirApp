-- Analytics Database Schema
-- This migration creates tables for comprehensive analytics tracking

-- 1. Sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(2), -- ISO country code
    city VARCHAR(100),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    is_new_user BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Page views table for detailed page tracking
CREATE TABLE IF NOT EXISTS analytics_pageviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_path VARCHAR(500) NOT NULL,
    page_title VARCHAR(500),
    referrer TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Events table for tracking specific user actions
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- checkout_start, payment_attempt, payment_success, etc.
    event_category VARCHAR(100), -- ecommerce, engagement, conversion
    event_action VARCHAR(100),
    event_label VARCHAR(200),
    event_value DECIMAL(10,2),
    properties JSONB, -- Additional event data
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Conversion funnel table for tracking checkout flow
CREATE TABLE IF NOT EXISTS analytics_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    funnel_step VARCHAR(50) NOT NULL, -- landing, checkout_start, payment_attempt, payment_success, completion
    step_order INTEGER NOT NULL,
    provider VARCHAR(50), -- stripe, flutterwave
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Revenue analytics table for aggregated revenue data
CREATE TABLE IF NOT EXISTS analytics_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    successful_payments INTEGER DEFAULT 0,
    failed_payments INTEGER DEFAULT 0,
    refunds_count INTEGER DEFAULT 0,
    refunds_amount DECIMAL(12,2) DEFAULT 0,
    stripe_revenue DECIMAL(12,2) DEFAULT 0,
    flutterwave_revenue DECIMAL(12,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, period_type)
);

-- 6. Email analytics table for tracking email performance
CREATE TABLE IF NOT EXISTS analytics_email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_log_id UUID REFERENCES email_logs(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- sent, delivered, opened, clicked, bounced, complained
    recipient_email VARCHAR(255) NOT NULL,
    email_type VARCHAR(100), -- payment_confirmation, payment_reminder, ticket_ready, etc.
    campaign_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WhatsApp analytics table
CREATE TABLE IF NOT EXISTS analytics_whatsapp_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- click, message_sent, message_received
    phone_number VARCHAR(20),
    message_type VARCHAR(50), -- support, order_inquiry, etc.
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_country ON analytics_sessions(country);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_device_type ON analytics_sessions(device_type);

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session_id ON analytics_pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_page_path ON analytics_pageviews(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_timestamp ON analytics_pageviews(timestamp);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_analytics_conversions_session_id ON analytics_conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_order_id ON analytics_conversions(order_id);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_funnel_step ON analytics_conversions(funnel_step);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_timestamp ON analytics_conversions(timestamp);

CREATE INDEX IF NOT EXISTS idx_analytics_revenue_date ON analytics_revenue(date);
CREATE INDEX IF NOT EXISTS idx_analytics_revenue_period_type ON analytics_revenue(period_type);

CREATE INDEX IF NOT EXISTS idx_analytics_email_events_email_log_id ON analytics_email_events(email_log_id);
CREATE INDEX IF NOT EXISTS idx_analytics_email_events_event_type ON analytics_email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_email_events_timestamp ON analytics_email_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_analytics_whatsapp_events_session_id ON analytics_whatsapp_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_whatsapp_events_event_type ON analytics_whatsapp_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_whatsapp_events_timestamp ON analytics_whatsapp_events(timestamp);

-- RLS Policies
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_whatsapp_events ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all analytics data
CREATE POLICY "Service role can access all analytics data" ON analytics_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all pageviews" ON analytics_pageviews
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all events" ON analytics_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all conversions" ON analytics_conversions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all revenue data" ON analytics_revenue
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all email events" ON analytics_email_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all whatsapp events" ON analytics_whatsapp_events
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for analytics
CREATE OR REPLACE FUNCTION update_analytics_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_duration
    BEFORE UPDATE ON analytics_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_session_duration();

-- Function to aggregate daily revenue data
CREATE OR REPLACE FUNCTION aggregate_daily_revenue(target_date DATE)
RETURNS VOID AS $$
DECLARE
    daily_data RECORD;
BEGIN
    -- Get revenue data for the target date
    SELECT 
        COALESCE(SUM(CASE WHEN status = 'paid' THEN payment_amount ELSE 0 END), 0) as total_revenue,
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN status = 'pending_payment' THEN 1 END) as failed_payments,
        COALESCE(AVG(CASE WHEN status = 'paid' THEN payment_amount END), 0) as avg_order_value
    INTO daily_data
    FROM orders
    WHERE DATE(created_at) = target_date;

    -- Insert or update revenue record
    INSERT INTO analytics_revenue (
        date, period_type, total_revenue, total_orders, 
        successful_payments, failed_payments, average_order_value
    ) VALUES (
        target_date, 'daily', daily_data.total_revenue, daily_data.total_orders,
        daily_data.successful_payments, daily_data.failed_payments, daily_data.avg_order_value
    )
    ON CONFLICT (date, period_type) 
    DO UPDATE SET
        total_revenue = EXCLUDED.total_revenue,
        total_orders = EXCLUDED.total_orders,
        successful_payments = EXCLUDED.successful_payments,
        failed_payments = EXCLUDED.failed_payments,
        average_order_value = EXCLUDED.avg_order_value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
