# DummAir - Verifiable Dummy Flight Tickets

A comprehensive web application for generating verifiable dummy flight tickets. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Customer Features
- **Landing Page**: Clean, modern design with clear call-to-action
- **Multi-step Booking Flow**: 
  - Flight type selection (One-way/Return)
  - Flight details input (routes, dates, preferences)
  - Passenger information collection
  - Review and confirmation
  - Payment processing
- **Payment Integration**: Support for Stripe, Paystack, and Flutterwave
- **WhatsApp Support**: Direct customer support integration
- **Email Confirmations**: Automated email delivery system

### Admin Features
- **Order Management Dashboard**: View and manage all bookings
- **Order Status Tracking**: Pending, paid, and completed orders
- **Ticket Upload System**: Upload and send dummy tickets to customers
- **Email Management**: Resend confirmations and tickets
- **Order Details View**: Comprehensive order information display

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form with validation
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore (configured)
- **Email Service**: SendGrid (configured)
- **Payment Gateways**: Stripe, Paystack, Flutterwave

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for database)
- SendGrid account (for emails)
- Payment provider accounts (Stripe/Paystack/Flutterwave)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DummAir
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the `.env.local` file with your actual API keys and configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# WhatsApp Support
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890

# Payment Providers
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key

FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_your_flutterwave_secret_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@dummair.com
ADMIN_EMAIL=admin@dummair.com

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── orders/        # Order management
│   │   ├── payment/       # Payment processing
│   │   ├── webhooks/      # Payment webhooks
│   │   └── admin/         # Admin functions
│   ├── admin/             # Admin dashboard
│   ├── book/              # Booking flow
│   ├── confirmation/      # Payment confirmation
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── booking/           # Booking flow components
│   └── BookingFlow.tsx    # Main booking component
├── contexts/              # React Context providers
│   └── BookingContext.tsx # Booking state management
└── lib/                   # Utility functions
```

## API Endpoints

### Orders
- `POST /api/orders` - Create a new booking order
- `GET /api/orders/[id]` - Get order details

### Payment
- `POST /api/payment` - Initialize payment
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/paystack` - Paystack webhook handler
- `POST /api/webhooks/flutterwave` - Flutterwave webhook handler

### Admin
- `POST /api/admin/mark-completed` - Mark order as completed
- `POST /api/resend-email` - Resend confirmation/ticket email

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Features Implementation Status

- ✅ Landing page with hero section and WhatsApp support
- ✅ Multi-step booking flow (5 steps)
- ✅ Flight type selection
- ✅ Flight details form
- ✅ Passenger information collection
- ✅ Review and payment selection
- ✅ Payment processing page
- ✅ Confirmation page with order details
- ✅ Admin dashboard for order management
- ✅ Order details view
- ✅ API routes for all backend functions
- ✅ Responsive design for mobile and desktop
- ⏳ Form validation with React Hook Form + Yup
- ⏳ Firebase Firestore integration
- ⏳ SendGrid email integration
- ⏳ Payment gateway integrations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@dummair.com or join our WhatsApp support channel.

---

**Note**: This application is for generating dummy flight tickets for documentation purposes only. Ensure compliance with local laws and regulations regarding the use of such documents.