'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Package, User, Mail, CheckCircle, Upload } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  order_number: string;
  status: string;
  flight_from: string;
  flight_to: string;
  flight_type: string;
  flight_depart_date: string;
  flight_return_date?: string;
  number_of_travelers: number;
  payment_amount: number;
  guest_email: string;
  created_at: string;
  ticket_url?: string;
  user_id?: string;
}

interface Passenger {
  id: string;
  full_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  phone?: string;
  nationality?: string;
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== 'abiolayoung229@gmail.com') {
      router.push('/dashboard');
      return;
    }

    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      console.log('🔍 Admin: Fetching order details for:', orderId);
      
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('❌ Error fetching order:', orderError);
        throw orderError;
      }
      
      console.log('✅ Order fetched:', orderData.order_number);
      setOrder(orderData);

      // Fetch passengers
      const { data: passengersData, error: passengersError } = await supabase
        .from('passengers')
        .select('*')
        .eq('order_id', orderId)
        .order('passenger_number', { ascending: true });

      if (passengersError) {
        console.error('❌ Error fetching passengers:', passengersError);
        throw passengersError;
      }
      
      console.log('✅ Passengers fetched:', passengersData?.length || 0);
      console.log('📋 Passenger details:', passengersData);
      setPassengers(passengersData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    // Validate file is PDF
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', order.id);

      const response = await fetch('/api/admin/upload-ticket', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Upload failed:', data);
        throw new Error(data.error || 'Failed to upload ticket');
      }

      console.log('✅ Upload successful:', data);
      alert('Ticket uploaded successfully! Order marked as completed.');
      fetchOrderDetails(order.id);
    } catch (error: unknown) {
      console.error('❌ Error uploading ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to upload ticket: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!order) return;

    try {
      // Call API to mark as completed (uses service role)
      const response = await fetch('/api/admin/mark-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as completed');
      }

      alert('Order marked as completed!');
      fetchOrderDetails(order.id);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const handleSendEmail = async () => {
    if (!order) return;

    setIsSendingEmail(true);

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      alert(`Email sent successfully to ${data.recipient}`);
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to send email: ${errorMessage}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2472e0]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-[#dce0e5] mb-4" />
          <p className="text-[#647287]">Order not found</p>
          <Link href="/admin" className="text-[#2472e0] hover:underline mt-4 inline-block">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/admin"
            className="flex items-center gap-2 text-[#647287] hover:text-[#111417] transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#111417] mb-2">
                Order {order.order_number}
              </h1>
              <p className="text-[#647287]">
                Created on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#647287] mb-1">Route</p>
              <p className="text-lg font-semibold text-[#111417]">
                {order.flight_from} → {order.flight_to}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#647287] mb-1">Flight Type</p>
              <p className="text-lg font-semibold text-[#111417] capitalize">
                {order.flight_type.replace('-', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#647287] mb-1">Departure Date</p>
              <p className="text-lg font-semibold text-[#111417]">
                {new Date(order.flight_depart_date).toLocaleDateString()}
              </p>
            </div>
            {order.flight_return_date && (
              <div>
                <p className="text-sm text-[#647287] mb-1">Return Date</p>
                <p className="text-lg font-semibold text-[#111417]">
                  {new Date(order.flight_return_date).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-[#647287] mb-1">Travelers</p>
              <p className="text-lg font-semibold text-[#111417]">
                {order.number_of_travelers}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#647287] mb-1">Amount</p>
              <p className="text-lg font-semibold text-[#111417]">
                ${order.payment_amount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#111417] mb-6">Passengers</h2>
          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <div key={passenger.id} className="border border-[#dce0e5] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#e0f2fe] rounded-full flex items-center justify-center">
                    <User size={20} className="text-[#2472e0]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111417]">
                    Passenger {index + 1}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#647287]">Name</p>
                    <p className="font-semibold text-[#111417]">{passenger.full_name}</p>
                  </div>
                  <div>
                    <p className="text-[#647287]">Email</p>
                    <p className="font-semibold text-[#111417]">{passenger.email}</p>
                  </div>
                  <div>
                    <p className="text-[#647287]">Gender</p>
                    <p className="font-semibold text-[#111417] capitalize">{passenger.gender}</p>
                  </div>
                  <div>
                    <p className="text-[#647287]">Date of Birth</p>
                    <p className="font-semibold text-[#111417]">
                      {new Date(passenger.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  {passenger.phone && (
                    <div>
                      <p className="text-[#647287]">Phone</p>
                      <p className="font-semibold text-[#111417]">{passenger.phone}</p>
                    </div>
                  )}
                  {passenger.nationality && (
                    <div>
                      <p className="text-[#647287]">Nationality</p>
                      <p className="font-semibold text-[#111417]">{passenger.nationality}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#111417]">Actions</h2>
              <p className="text-sm text-[#647287] mt-1">
                {order.user_id ? '👤 Registered User Order' : '👥 Guest Order'}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Mark as Completed - Show for all orders if not completed */}
            {order.status !== 'completed' && (
              <button
                onClick={handleMarkCompleted}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={20} />
                Mark as Completed
              </button>
            )}

            {/* Upload Ticket - ONLY for registered users (have dashboards to download) */}
            {order.user_id && (
              <label className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                isUploading 
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#2472e0] text-white hover:bg-[#1e5bb8]'
              }`}>
                <Upload size={20} />
                {isUploading ? 'Uploading...' : 'Upload Ticket'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}

            {/* Send Email - Show for all orders */}
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isSendingEmail
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              <Mail size={20} />
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </button>
          </div>

          {/* Info message for guest orders */}
          {!order.user_id && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-[#111417]">
                <strong>Guest Order:</strong> This customer doesn&apos;t have an account. 
                Ticket will be sent via email only. Upload feature is not available for guest orders.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
