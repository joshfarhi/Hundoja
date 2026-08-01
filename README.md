# HUNDOJA - Premium Streetwear E-commerce

A modern e-commerce website built with Next.js, featuring Clerk authentication, Stripe payments, and Aceternity UI components. Inspired by premium streetwear brands with a focus on clean design and user experience.

## 🚀 Features

- **Modern Design**: Dark theme inspired by premium streetwear brands like Cutthroat LA and When Smoke Clears
- **Authentication**: Complete user management with Clerk (sign up, sign in, user dashboard)
- **E-commerce**: Full shopping cart functionality with persistent state
- **Payments**: Secure checkout process with Stripe integration
- **Responsive**: Mobile-first design with smooth animations
- **Premium UI**: Built with Aceternity UI components and Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.2 with App Router
- **Authentication**: Clerk
- **Payments**: Stripe
- **UI Components**: Aceternity UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hundoja
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.local.example` to `.env.local` and fill in your keys:
   
   ```bash
   cp .env.local.example .env.local
   ```
   
   Required environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   
   # Stripe Payment Processing
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Next.js
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Lock page email and phone capture
   # Fine-grained GitHub token with Contents read/write access to this repo.
   GITHUB_EMAIL_LOG_TOKEN=github_pat_...
   LOCK_EMAIL_LOG_PATH=lock-emails.txt
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Setup Guide

### Clerk Authentication Setup

1. Create a [Clerk](https://clerk.dev) account
2. Create a new application
3. Copy the publishable key and secret key to your `.env.local`
4. Configure sign-in/sign-up URLs in your Clerk dashboard

### Stripe Setup

1. Create a [Stripe](https://stripe.com) account
2. Get your publishable and secret keys from the dashboard
3. Set up webhooks for payment confirmation (optional)
4. Add the keys to your `.env.local`

### Deployment on Vercel

1. Push your code to a Git repository
2. Import your project in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

## 🎨 Design Features

- **Dark Theme**: Black and white color scheme inspired by premium streetwear
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Smooth transitions and micro-interactions
- **Mobile-First**: Responsive design that works on all devices
- **Premium Feel**: High-quality images and professional layout

## 📁 Project Structure

```
hundoja/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── about/             # About page
│   ├── checkout/          # Checkout and success pages
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard
│   ├── products/          # Product catalog and details
│   └── api/               # API routes
├── components/            # Reusable UI components
├── contexts/             # React contexts (Cart)
├── data/                 # Static data (products)
├── lib/                  # Utility functions (Stripe)
└── public/               # Static assets
```

## 🛍 Key Components

- **Navigation**: Responsive header with cart and authentication
- **Hero**: Full-screen landing section with call-to-action
- **Product Grid**: Filterable product catalog
- **Cart**: Persistent shopping cart with sidebar
- **Checkout**: Secure Stripe payment integration
- **Dashboard**: User account management and order history

## 🚀 Deployment

The project is configured for deployment on Vercel:

```bash
npm run build  # Build the project
npm start      # Start production server
```

Environment variables must be configured in your deployment platform.

## 📝 License

This project is for demonstration purposes. Customize as needed for your specific use case.

---

**Built with ❤️ using Next.js, Clerk, Stripe, and Aceternity UI**
