export async function initializeFlutterwavePayment(data: {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}) {
  const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!flutterwaveSecretKey) {
    throw new Error('FLUTTERWAVE_SECRET_KEY is not set');
  }

  // Check for required NEXT_PUBLIC_APP_URL environment variable
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error('❌ NEXT_PUBLIC_APP_URL is not set in environment variables');
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is required for Flutterwave payments. Please set it in Vercel dashboard.');
  }

  console.log('🟣 Flutterwave: Initializing payment', {
    orderId: data.orderId,
    amount: data.amount,
    email: data.customerEmail,
    appUrl: appUrl,
  });

  // Generate unique transaction reference
  const txRef = `DUM-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const redirectUrl = `${appUrl}/confirmation?orderId=${data.orderId}&provider=flutterwave&tx_ref=${txRef}`;
  console.log('🟣 Flutterwave: Redirect URL:', redirectUrl);

  const requestBody = {
    tx_ref: txRef,
    amount: data.amount.toString(),
    currency: 'USD',
    redirect_url: redirectUrl,
    payment_options: 'card',
    customer: {
      email: data.customerEmail,
      name: data.customerName,
      phonenumber: data.customerPhone || '0000000000',
    },
    customizations: {
      title: 'DummAir Flight Ticket',
      description: `Dummy Flight Ticket - Order ${data.orderId}`,
      logo: 'https://via.placeholder.com/150/2472e0/ffffff?text=DummAir',
    },
    meta: {
      orderId: data.orderId,
      service: 'dummy_flight_ticket',
    },
  };

  console.log('🟣 Flutterwave: Request body', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('🟣 Flutterwave: Response status', response.status);

    const responseText = await response.text();
    console.log('🟣 Flutterwave: Raw response (first 300 chars)', responseText.substring(0, 300));

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Flutterwave: Failed to parse JSON', parseError);
      throw new Error('Flutterwave returned invalid response');
    }

    console.log('🟣 Flutterwave: Parsed response', result);

    if (result.status !== 'success') {
      console.error('❌ Flutterwave: API returned error', result);
      throw new Error(result.message || 'Flutterwave payment initialization failed');
    }

    if (!result.data || !result.data.link) {
      console.error('❌ Flutterwave: No payment link in response', result);
      throw new Error('Flutterwave did not return a payment link');
    }

    console.log('✅ Flutterwave: Payment initialized successfully');
    console.log('🟣 Flutterwave: Payment link', result.data.link);

    return {
      payment_link: result.data.link,
      tx_ref: txRef,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Flutterwave: Initialization failed', errorMessage);
    throw error;
  }
}
