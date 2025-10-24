# 🚀 AstroConnect - Complete Setup Guide

**Last Updated:** October 24, 2025

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Third-Party Services](#third-party-services)
6. [Running the Application](#running-the-application)
7. [Verification Checklist](#verification-checklist)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Software
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version

### Verify Installation
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 📦 Installation

### 1. Clone the Repository (if not already done)
```bash
cd c:\Users\saswa\Downloads\astroconnect\astroconnect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Critical Packages
Check that these packages are installed (already in package.json):

✅ **Already Installed:**
- `@supabase/supabase-js` (v2.45.0) - Database
- `agora-rtc-sdk-ng` (v4.24.0) - Voice/Video calls
- `agora-access-token` (v2.0.4) - Agora token generation
- `twilio` (v5.3.4) - SMS/OTP
- `bcryptjs` (v2.4.3) - Password hashing
- `jose` (v5.9.2) - JWT tokens
- `zod` (v3.25.76) - Validation
- `next` (v15.2.4) - Framework
- `react` (v19) - UI library

**Status:** ✅ All required packages are already installed!

---

## 🔐 Environment Variables

### 1. Create Environment File
Create a `.env.local` file in the root directory:

```bash
# Navigate to project root
cd c:\Users\saswa\Downloads\astroconnect\astroconnect

# Create .env.local file
New-Item -Path .env.local -ItemType File
```

### 2. Add Required Variables

Copy and paste this into your `.env.local` file:

```env
# ============================================
# SUPABASE (Required)
# ============================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# AGORA (Required for Voice/Video Calls)
# ============================================
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate

# ============================================
# TWILIO (Required for SMS/OTP)
# ============================================
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# FIREBASE (Optional - for Push Notifications)
# ============================================
FCM_PROJECT_ID=your-firebase-project-id
FCM_PRIVATE_KEY=your-firebase-private-key
FCM_CLIENT_EMAIL=your-firebase-client-email

# ============================================
# SENDGRID (Optional - for Email)
# ============================================
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# RAZORPAY (Required for Payments)
# ============================================
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### 3. Environment Variables Checklist

**Critical (Must Have):**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `AGORA_APP_ID`
- [ ] `AGORA_APP_CERTIFICATE`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`

**Optional (For Full Features):**
- [ ] `FCM_PROJECT_ID` (Push notifications)
- [ ] `FCM_PRIVATE_KEY` (Push notifications)
- [ ] `FCM_CLIENT_EMAIL` (Push notifications)
- [ ] `SENDGRID_API_KEY` (Email)
- [ ] `SENDGRID_FROM_EMAIL` (Email)

---

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** AstroConnect
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 2. Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values to your `.env.local`:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  date_of_birth DATE,
  time_of_birth TIME,
  place_of_birth VARCHAR(255),
  avatar_url TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ASTROLOGERS TABLE
-- ============================================
CREATE TABLE astrologers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  specialization TEXT[],
  languages TEXT[],
  experience INTEGER,
  qualification VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_consultations INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  available_balance DECIMAL(10, 2) DEFAULT 0.00,
  is_online BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  chat_rate DECIMAL(10, 2),
  call_rate DECIMAL(10, 2),
  video_rate DECIMAL(10, 2),
  bank_account_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc_code VARCHAR(20),
  pan_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('chat', 'call', 'video')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER, -- in seconds
  rate DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'astrologer')),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('recharge', 'consultation', 'refund')),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EARNINGS TABLE
-- ============================================
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('consultation', 'withdrawal', 'bonus')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, astrologer_id)
);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(astrologer_id, day_of_week)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- OTP TABLE
-- ============================================
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_astrologers_email ON astrologers(email);
CREATE INDEX idx_astrologers_is_online ON astrologers(is_online);
CREATE INDEX idx_consultations_user ON consultations(user_id);
CREATE INDEX idx_consultations_astrologer ON consultations(astrologer_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_messages_consultation ON messages(consultation_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_earnings_astrologer ON earnings(astrologer_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_otps_phone ON otps(phone);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_astrologers_updated_at BEFORE UPDATE ON astrologers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE astrologers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Create policies (service role bypasses RLS)
-- These are basic policies - adjust based on your security needs
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Astrologers can view their own data" ON astrologers
  FOR SELECT USING (auth.uid() = id);
```

---

## 🔧 Third-Party Services Setup

### 1. Agora (Voice/Video Calls)

**Setup Steps:**
1. Go to [https://console.agora.io](https://console.agora.io)
2. Sign up / Log in
3. Create a new project:
   - **Project Name:** AstroConnect
   - **Authentication:** Secured mode (APP ID + Token)
4. Copy credentials:
   - **App ID** → `AGORA_APP_ID`
   - **App Certificate** → `AGORA_APP_CERTIFICATE`

**Cost:** Free tier includes 10,000 minutes/month

### 2. Twilio (SMS/OTP)

**Setup Steps:**
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up / Log in
3. Get a phone number:
   - Go to **Phone Numbers** → **Buy a Number**
   - Choose a number with SMS capability
4. Copy credentials from Console:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
   - **Phone Number** → `TWILIO_PHONE_NUMBER`

**Cost:** Trial account includes $15 credit

### 3. Razorpay (Payments)

**Setup Steps:**
1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up / Log in
3. Complete KYC verification
4. Go to **Settings** → **API Keys**
5. Generate keys:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

**Note:** Use test mode keys for development

### 4. SendGrid (Optional - Email)

**Setup Steps:**
1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Sign up / Log in
3. Create API Key:
   - Go to **Settings** → **API Keys**
   - Create new key with **Full Access**
4. Verify sender email:
   - Go to **Settings** → **Sender Authentication**
   - Verify your email address
5. Copy credentials:
   - **API Key** → `SENDGRID_API_KEY`
   - **Verified Email** → `SENDGRID_FROM_EMAIL`

**Cost:** Free tier includes 100 emails/day

### 5. Firebase (Optional - Push Notifications)

**Setup Steps:**
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create new project
3. Go to **Project Settings** → **Service Accounts**
4. Generate new private key
5. Copy from downloaded JSON:
   - `project_id` → `FCM_PROJECT_ID`
   - `private_key` → `FCM_PRIVATE_KEY`
   - `client_email` → `FCM_CLIENT_EMAIL`

---

## 🚀 Running the Application

### 1. Development Mode

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

### 2. Build for Production

```bash
npm run build
npm start
```

### 3. Lint Code

```bash
npm run lint
```

---

## ✅ Verification Checklist

### Environment Setup
- [ ] Node.js v18+ installed
- [ ] All npm packages installed successfully
- [ ] `.env.local` file created with all required variables

### Database
- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] All tables created (11 tables)
- [ ] Indexes created
- [ ] RLS enabled

### Third-Party Services
- [ ] Agora account created and credentials added
- [ ] Twilio account created and phone number purchased
- [ ] Razorpay account created (test mode keys added)
- [ ] SendGrid account created (optional)
- [ ] Firebase project created (optional)

### Application
- [ ] Development server starts without errors
- [ ] Can access `http://localhost:3000`
- [ ] No console errors on page load

### API Endpoints
Test these endpoints to verify backend is working:

```bash
# Health check
curl http://localhost:3000/api/health

# Should return: {"status":"ok"}
```

### Frontend Pages
Verify these pages load:
- [ ] `/` - Landing page
- [ ] `/login` - User login
- [ ] `/signup` - User signup
- [ ] `/astrologer/login` - Astrologer login
- [ ] `/astrologer/signup` - Astrologer signup

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment variables not loading
- Ensure `.env.local` is in the root directory
- Restart the development server after adding variables
- Check for typos in variable names

#### 3. Supabase connection errors
- Verify `SUPABASE_URL` and keys are correct
- Check if Supabase project is active
- Ensure database schema is created

#### 4. Agora token generation fails
- Verify `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE`
- Ensure project is in "Secured mode"
- Check App Certificate is enabled

#### 5. Twilio SMS not sending
- Verify phone number format: `+1234567890`
- Check Twilio account balance
- Ensure phone number has SMS capability

#### 6. Database queries failing
- Check RLS policies
- Verify service role key is used for admin operations
- Check table names and column names match schema

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Check the `BACKEND_ROUTES.md` for API documentation
4. Review the integration documentation files

---

## 📚 Additional Resources

### Documentation Files
- `BACKEND_ROUTES.md` - Complete API documentation
- `COMPLETE_INTEGRATION_FINAL.md` - Integration status
- `INTEGRATION_100_PERCENT_COMPLETE.md` - Feature completion

### API Client
- Location: `/lib/client/api.ts`
- Contains 100+ methods for frontend-backend communication

### Server Utilities
- `/lib/server/env.ts` - Environment variable management
- `/lib/server/supabase.ts` - Supabase client
- `/lib/server/agora.ts` - Agora token generation
- `/lib/server/twilio.ts` - Twilio SMS
- `/lib/server/auth.ts` - JWT authentication

---

## 🎉 Next Steps

Once setup is complete:

1. **Test User Flow:**
   - Sign up as a user
   - Browse astrologers
   - Book a consultation

2. **Test Astrologer Flow:**
   - Sign up as an astrologer
   - Complete profile
   - Go online and accept consultations

3. **Test Payments:**
   - Recharge wallet (use Razorpay test cards)
   - Book paid consultation
   - Verify transaction

4. **Deploy to Production:**
   - Set up Vercel/Netlify account
   - Add production environment variables
   - Deploy the application

---

**Setup Complete! Your AstroConnect application is ready to run! 🚀**

For any issues, refer to the troubleshooting section or check the documentation files.
