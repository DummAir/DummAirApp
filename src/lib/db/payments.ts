import { createServiceClient } from '../supabase/server';

export interface CreatePaymentData {
  orderId: string;
  provider: 'stripe' | 'paystack' | 'flutterwave';
  reference: string;
  amount: number;
  currency: string;
  transactionId?: string;
}

export async function createPayment(data: CreatePaymentData) {
  const supabase = createServiceClient();

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      order_id: data.orderId,
      provider: data.provider,
      reference: data.reference,
      transaction_id: data.transactionId || null,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    throw new Error(error.message);
  }

  return payment;
}

export async function updatePaymentStatus(
  reference: string,
  status: string,
  additionalData?: {
    transactionId?: string;
    cardLast4?: string;
    cardBrand?: string;
    errorMessage?: string;
  }
) {
  const supabase = createServiceClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'succeeded') {
    updateData.completed_at = new Date().toISOString();
  }

  if (additionalData) {
    if (additionalData.transactionId) updateData.transaction_id = additionalData.transactionId;
    if (additionalData.cardLast4) updateData.card_last4 = additionalData.cardLast4;
    if (additionalData.cardBrand) updateData.card_brand = additionalData.cardBrand;
    if (additionalData.errorMessage) updateData.error_message = additionalData.errorMessage;
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('reference', reference)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function getPaymentByReference(reference: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reference', reference)
    .single();

  if (error) {
    console.error('Error fetching payment:', error);
    return null;
  }

  return data;
}


