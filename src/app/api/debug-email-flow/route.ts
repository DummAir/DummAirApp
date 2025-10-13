import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/service';

/**
 * Comprehensive debugging endpoint
 * This will check EVERYTHING about your email configuration
 */
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {},
    tests: {},
  };

  try {
    // ============================================================================
    // CHECK 1: Environment Variables
    // ============================================================================
    console.log('\n🔍 CHECK 1: Environment Variables');
    
    const envVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };

    results.checks = {
      hasResendKey: !!envVars.RESEND_API_KEY,
      resendKeyLength: envVars.RESEND_API_KEY?.length || 0,
      resendKeyPreview: envVars.RESEND_API_KEY ? envVars.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET',
      fromEmail: envVars.RESEND_FROM_EMAIL || 'NOT SET',
      fromName: envVars.RESEND_FROM_NAME || 'DummAir Support (default)',
      adminEmail: envVars.ADMIN_EMAIL || 'NOT SET (using default)',
      appUrl: envVars.NEXT_PUBLIC_APP_URL || 'NOT SET',
    };

    console.log('Environment Variables:', results.checks);

    // ============================================================================
    // CHECK 2: Database Connection
    // ============================================================================
    console.log('\n🔍 CHECK 2: Database Connection');
    
    const supabase = await createServiceClient();
    const { data: testQuery, error: dbError } = await supabase
      .from('email_logs')
      .select('count')
      .limit(1);

    results.checks = {
      ...results.checks as object,
      databaseConnected: !dbError,
      databaseError: dbError?.message || null,
    };

    console.log('Database:', !dbError ? '✅ Connected' : '❌ Error: ' + dbError?.message);

    // ============================================================================
    // CHECK 3: Email Logs Table
    // ============================================================================
    console.log('\n🔍 CHECK 3: Recent Email Logs');
    
    const { data: recentEmails, error: emailLogError } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    results.tests = {
      ...results.tests as object,
      recentEmailsFound: recentEmails?.length || 0,
      recentEmails: recentEmails?.map(e => ({
        created: e.created_at,
        type: e.email_type,
        recipient: e.recipient,
        status: e.status,
        error: e.error_message,
      })) || [],
    };

    console.log(`Found ${recentEmails?.length || 0} recent email logs`);

    // Check for admin notification emails specifically
    const { data: adminEmails } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_type', 'admin_notification')
      .order('created_at', { ascending: false })
      .limit(5);

    results.tests = {
      ...results.tests as object,
      adminNotificationsFound: adminEmails?.length || 0,
      adminNotifications: adminEmails?.map(e => ({
        created: e.created_at,
        recipient: e.recipient,
        status: e.status,
        error: e.error_message,
        messageId: e.provider_message_id,
      })) || [],
    };

    console.log(`Found ${adminEmails?.length || 0} admin notification emails`);

    // ============================================================================
    // CHECK 4: Send Test Email to Admin
    // ============================================================================
    console.log('\n🔍 CHECK 4: Sending Test Email to Admin');
    
    const adminEmail = envVars.ADMIN_EMAIL || 'payment@dummair.com';

    if (!envVars.RESEND_API_KEY) {
      results.tests = {
        ...results.tests as object,
        testEmailSent: false,
        testEmailError: 'RESEND_API_KEY not set',
      };
    } else {
      const testResult = await sendEmail({
        to: adminEmail,
        subject: '🧪 DEBUG TEST - Admin Email Working!',
        html: `
          <h1 style="color: #dc2626;">✅ Admin Email System Working!</h1>
          <p>This is a test email sent at ${new Date().toISOString()}</p>
          <hr>
          <h3>Configuration Details:</h3>
          <ul>
            <li>Admin Email: ${adminEmail}</li>
            <li>From Email: ${envVars.RESEND_FROM_EMAIL}</li>
            <li>Resend Key: ${envVars.RESEND_API_KEY?.substring(0, 10)}...</li>
          </ul>
          <p><strong>If you received this, your admin email system is working correctly!</strong></p>
        `,
      });

      results.tests = {
        ...results.tests as object,
        testEmailSent: testResult.success,
        testEmailMessageId: testResult.messageId,
        testEmailError: testResult.error,
        testEmailRecipient: adminEmail,
      };

      console.log('Test email result:', testResult.success ? '✅ SUCCESS' : '❌ FAILED');
      if (testResult.error) {
        console.error('Test email error:', testResult.error);
      }
    }

    // ============================================================================
    // CHECK 5: Recent Orders
    // ============================================================================
    console.log('\n🔍 CHECK 5: Recent Orders');
    
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, order_number, status, guest_email, created_at, paid_at')
      .order('created_at', { ascending: false })
      .limit(5);

    results.tests = {
      ...results.tests as object,
      recentOrdersFound: recentOrders?.length || 0,
      recentOrders: recentOrders?.map(o => ({
        orderNumber: o.order_number,
        status: o.status,
        email: o.guest_email,
        created: o.created_at,
        paid: o.paid_at,
      })) || [],
    };

    console.log(`Found ${recentOrders?.length || 0} recent orders`);

    // ============================================================================
    // SUMMARY
    // ============================================================================
    console.log('\n📊 SUMMARY:');
    console.log('✅ Checks completed');
    
    const allGood = 
      (results.checks as any).hasResendKey &&
      (results.checks as any).databaseConnected &&
      (results.tests as any).testEmailSent;

    results.summary = {
      allSystemsGo: allGood,
      criticalIssues: [] as string[],
      warnings: [] as string[],
    };

    if (!(results.checks as any).hasResendKey) {
      (results.summary.criticalIssues as string[]).push('RESEND_API_KEY not set');
    }
    if (!(results.checks as any).databaseConnected) {
      (results.summary.criticalIssues as string[]).push('Database connection failed');
    }
    if (!(results.tests as any).testEmailSent) {
      (results.summary.criticalIssues as string[]).push('Test email failed to send');
    }
    if (!(results.checks as any).adminEmail || (results.checks as any).adminEmail === 'NOT SET (using default)') {
      (results.summary.warnings as string[]).push('ADMIN_EMAIL not set (using default: payment@dummair.com)');
    }

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('❌ Debug endpoint failed:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : String(error),
      results: results,
    }, { status: 500 });
  }
}

