import { createBrowserClient } from '@supabase/ssr';

// Client-side Supabase client for use in React components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a singleton instance
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Database types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          full_name: string | null;
          phone: string | null;
          phone_country_code: string | null;
          role: 'user' | 'admin';
          email_verified: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string | null;
          full_name?: string | null;
          phone?: string | null;
          phone_country_code?: string | null;
          role?: 'user' | 'admin';
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string | null;
          full_name?: string | null;
          phone?: string | null;
          phone_country_code?: string | null;
          role?: 'user' | 'admin';
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          metadata?: Record<string, unknown>;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: string;
          flight_type: 'one-way' | 'return';
          flight_from: string;
          flight_to: string;
          flight_depart_date: string;
          flight_return_date: string | null;
          flight_airline_pref: string | null;
          flight_travel_class: string | null;
          number_of_travelers: number;
          payment_provider: string | null;
          payment_reference: string | null;
          payment_amount: number | null;
          payment_currency: string;
          ticket_url: string | null;
          admin_notes: string | null;
          admin_assigned: boolean;
          created_at: string;
          paid_at: string | null;
          completed_at: string | null;
          expected_delivery_by: string | null;
          metadata: Record<string, unknown>;
        };
      };
    };
  };
};

