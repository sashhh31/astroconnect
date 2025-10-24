# Quick Start Guide - AstroConnect Backend

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd astroconnect
pnpm install
```

### 2. Setup Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the entire `DATABASE_SCHEMA.sql` file
4. Go to **Settings** → **API** and copy your keys

### 3. Configure Environment

Create `.env.local` file:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Development Server

```bash
pnpm dev
```

API is now running at `http://localhost:3000/api`

---

## 🧪 Test the API

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "service": "astroconnect-backend",
  "status": "ok",
  "time": "2024-01-15T10:00:00.000Z"
}
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "password123",
    "fullName": "Test User"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "otpSent": true,
    "expiresIn": 300
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "test@example.com"
    }
  }
}
```

### 4. Get Profile (Protected Route)
```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### 5. List Astrologers
```bash
curl "http://localhost:3000/api/user/astrologers?page=1&limit=10"
```

---

## 📁 Project Structure

```
astroconnect/
├── app/
│   └── api/
│       ├── health/              # Health check
│       ├── user/                # User service endpoints
│       │   ├── auth/            # Authentication
│       │   ├── profile/         # Profile management
│       │   ├── wallet/          # Wallet & transactions
│       │   ├── astrologers/     # Astrologer discovery
│       │   ├── consultations/   # Consultation booking
│       │   ├── favorites/       # Favorites management
│       │   ├── horoscope/       # Horoscope
│       │   ├── notifications/   # Notifications
│       │   └── specialties/     # Specialties list
│       ├── astrologer/          # Astrologer service endpoints
│       │   ├── auth/            # Authentication
│       │   ├── profile/         # Profile management
│       │   ├── dashboard/       # Dashboard stats
│       │   ├── consultations/   # Consultation management
│       │   └── status/          # Online/offline status
│       └── communication/       # Communication service
│           └── chat/            # Chat messages
├── lib/
│   └── server/
│       ├── auth.ts              # Auth helper (JWT verification)
│       ├── supabase.ts          # Supabase client
│       ├── http.ts              # HTTP response helpers
│       └── env.ts               # Environment variables
├── DATABASE_SCHEMA.sql          # Complete database schema
├── API_ENDPOINTS.md             # Full API specification
├── BACKEND_ROUTES.md            # Implementation status
├── ENV_SETUP.md                 # Detailed setup guide
└── QUICK_START.md               # This file
```

---

## 🔑 Key Endpoints

### User Service
- **Auth**: `/api/user/auth/*`
- **Profile**: `/api/user/profile`
- **Wallet**: `/api/user/wallet/*`
- **Astrologers**: `/api/user/astrologers`
- **Consultations**: `/api/user/consultations/*`
- **Favorites**: `/api/user/favorites`
- **Horoscope**: `/api/user/horoscope/daily/:sign`

### Astrologer Service
- **Auth**: `/api/astrologer/auth/*`
- **Profile**: `/api/astrologer/profile`
- **Dashboard**: `/api/astrologer/dashboard`
- **Consultations**: `/api/astrologer/consultations`
- **Status**: `/api/astrologer/status/online|offline`

### Communication Service
- **Chat**: `/api/communication/chat/:consultationId/messages`

---

## 📊 Database Tables

The following tables are created by `DATABASE_SCHEMA.sql`:

- `users` - User profiles
- `astrologers` - Astrologer profiles
- `specialties` - Astrology specialties
- `astrologer_specialties` - Many-to-many relationship
- `astrologer_availability` - Availability schedule
- `consultations` - Consultation bookings
- `messages` - Chat messages
- `transactions` - Wallet transactions
- `reviews` - Reviews and ratings
- `user_favorites` - Favorite astrologers
- `notifications` - User notifications
- `referrals` - Referral system
- `horoscope_cache` - Cached horoscope data
- `system_settings` - System configuration

---

## 🔒 Authentication Flow

1. **Register**: `POST /api/user/auth/register`
   - Creates Supabase Auth user
   - Creates profile in `users` table
   - Returns userId and OTP sent status

2. **Login**: `POST /api/user/auth/login`
   - Authenticates with Supabase
   - Returns access token and refresh token

3. **Protected Routes**: Include header
   ```
   Authorization: Bearer <access_token>
   ```

4. **Refresh Token**: `POST /api/user/auth/refresh-token`
   - Refreshes expired access token

5. **Logout**: `POST /api/user/auth/logout`
   - Invalidates session

---

## 💡 Tips

- Use **Postman** or **Insomnia** for easier API testing
- Check `BACKEND_ROUTES.md` for full list of implemented endpoints
- See `ENV_SETUP.md` for detailed environment setup
- All responses follow format:
  ```json
  {
    "success": true|false,
    "data": {...},      // on success
    "message": "...",   // on error
    "errors": {...}     // validation errors
  }
  ```

---

## 🐛 Troubleshooting

### "Missing environment variables"
- Make sure `.env.local` exists with all required variables
- Restart dev server after adding env vars

### "Failed to fetch from Supabase"
- Check if `DATABASE_SCHEMA.sql` was run
- Verify Supabase URL and keys are correct
- Check Supabase project is active

### "Unauthorized" on protected routes
- Make sure to include `Authorization: Bearer <token>` header
- Check if token is expired (refresh it)
- Verify user exists in database

### "Validation Error"
- Check request body matches expected schema
- See error details in `errors` field of response

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)

---

## 🎯 Next Steps

1. ✅ Backend API is ready for frontend integration
2. 📱 Connect your frontend to these endpoints
3. 🔐 Add remaining auth endpoints (forgot password, etc.)
4. 📞 Integrate Agora for voice/video calls
5. 💳 Integrate Razorpay for payments
6. 📧 Add email/SMS notifications
7. 🧪 Write API tests

---

**Happy Coding! 🚀**
