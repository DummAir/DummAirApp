-- Allow logging of post-payment survey emails
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'email_logs'
  ) THEN
    -- Remove existing constraint if present
    EXECUTE 'ALTER TABLE email_logs DROP CONSTRAINT IF EXISTS email_logs_email_type_check';

    -- Recreate constraint with new email type
    EXECUTE $sql$
      ALTER TABLE email_logs
        ADD CONSTRAINT email_logs_email_type_check CHECK (
          email_type IN (
            'payment_confirmation',
            'ticket_delivery',
            'admin_notification',
            'password_reset',
            'welcome',
            'order_update',
            'payment_reminder',
            'receipt',
            'post_payment_survey'
          )
        )
    $sql$;
  ELSE
    RAISE NOTICE 'Skipping post-payment survey email type migration: email_logs table does not exist.';
  END IF;
END;
$$;

