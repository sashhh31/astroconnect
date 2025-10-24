# Anytime Pooja - API Endpoints Documentation

## 🚀 Base URLs
- **User Service**: `http://localhost:3001/api/user`
- **Astrologer Service**: `http://localhost:3002/api/astrologer`
- **Communication Service**: `http://localhost:3003/api/communication`

---

## 👤 USER SERVICE ENDPOINTS

### Authentication
```http
POST   /api/user/auth/register
POST   /api/user/auth/login
POST   /api/user/auth/verify-otp
POST   /api/user/auth/resend-otp
POST   /api/user/auth/forgot-password
POST   /api/user/auth/reset-password
POST   /api/user/auth/refresh-token
POST   /api/user/auth/logout
```

### Profile Management
```http
GET    /api/user/profile
PUT    /api/user/profile
POST   /api/user/profile/upload-avatar
DELETE /api/user/profile/avatar
GET    /api/user/profile/birth-chart
```

### Wallet & Transactions
```http
GET    /api/user/wallet/balance
POST   /api/user/wallet/recharge
GET    /api/user/wallet/transactions
GET    /api/user/wallet/transactions/:id
POST   /api/user/wallet/payment/verify
```

### Astrologer Discovery
```http
GET    /api/user/astrologers
GET    /api/user/astrologers/:id
GET    /api/user/astrologers/nearby
GET    /api/user/astrologers/search
GET    /api/user/astrologers/filter
GET    /api/user/specialties
```

### Consultations
```http
GET    /api/user/consultations
POST   /api/user/consultations/book
GET    /api/user/consultations/:id
PUT    /api/user/consultations/:id/cancel
POST   /api/user/consultations/:id/review
GET    /api/user/consultations/:id/receipt
```

### Favorites
```http
GET    /api/user/favorites
POST   /api/user/favorites/:astrologerId
DELETE /api/user/favorites/:astrologerId
```

### Horoscope
```http
GET    /api/user/horoscope/daily/:sign
GET    /api/user/horoscope/weekly/:sign
GET    /api/user/horoscope/monthly/:sign
GET    /api/user/horoscope/compatibility
POST   /api/user/horoscope/birth-chart
```

### Referrals
```http
GET    /api/user/referrals
POST   /api/user/referrals/generate-code
POST   /api/user/referrals/apply-code
```

### Notifications
```http
GET    /api/user/notifications
PUT    /api/user/notifications/:id/read
PUT    /api/user/notifications/mark-all-read
DELETE /api/user/notifications/:id
```

---

## 🔮 ASTROLOGER SERVICE ENDPOINTS

### Authentication
```http
POST   /api/astrologer/auth/register
POST   /api/astrologer/auth/login
POST   /api/astrologer/auth/verify-otp
POST   /api/astrologer/auth/refresh-token
POST   /api/astrologer/auth/logout
```

### Profile Management
```http
GET    /api/astrologer/profile
PUT    /api/astrologer/profile
POST   /api/astrologer/profile/upload-avatar
POST   /api/astrologer/profile/upload-documents
PUT    /api/astrologer/profile/specialties
PUT    /api/astrologer/profile/pricing
```

### Dashboard & Analytics
```http
GET    /api/astrologer/dashboard
GET    /api/astrologer/analytics/earnings
GET    /api/astrologer/analytics/consultations
GET    /api/astrologer/analytics/ratings
GET    /api/astrologer/analytics/performance
```

### Availability Management
```http
GET    /api/astrologer/availability
PUT    /api/astrologer/availability
POST   /api/astrologer/availability/bulk-update
PUT    /api/astrologer/status/online
PUT    /api/astrologer/status/offline
```

### Consultation Management
```http
GET    /api/astrologer/consultations
GET    /api/astrologer/consultations/pending
GET    /api/astrologer/consultations/today
GET    /api/astrologer/consultations/:id
PUT    /api/astrologer/consultations/:id/accept
PUT    /api/astrologer/consultations/:id/reject
PUT    /api/astrologer/consultations/:id/start
PUT    /api/astrologer/consultations/:id/end
POST   /api/astrologer/consultations/:id/notes
```

### Client Management
```http
GET    /api/astrologer/clients
GET    /api/astrologer/clients/:id
GET    /api/astrologer/clients/:id/history
POST   /api/astrologer/clients/:id/notes
```

### Earnings & Payouts
```http
GET    /api/astrologer/earnings
GET    /api/astrologer/earnings/summary
POST   /api/astrologer/earnings/withdraw
GET    /api/astrologer/earnings/transactions
```

### Reviews & Feedback
```http
GET    /api/astrologer/reviews
GET    /api/astrologer/reviews/stats
POST   /api/astrologer/reviews/:id/reply
```

---

## 💬 COMMUNICATION SERVICE ENDPOINTS

### Chat Management
```http
GET    /api/communication/chat/:consultationId/messages
POST   /api/communication/chat/:consultationId/message
PUT    /api/communication/chat/:consultationId/read
POST   /api/communication/chat/:consultationId/typing
GET    /api/communication/chat/:consultationId/history
```

### Voice Call Management
```http
POST   /api/communication/call/initiate
POST   /api/communication/call/accept
POST   /api/communication/call/reject
POST   /api/communication/call/end
GET    /api/communication/call/:consultationId/token
POST   /api/communication/call/:consultationId/record
```

### Video Call Management
```http
POST   /api/communication/video/initiate
POST   /api/communication/video/accept
POST   /api/communication/video/reject
POST   /api/communication/video/end
GET    /api/communication/video/:consultationId/token
POST   /api/communication/video/:consultationId/record
```

### Real-time Events
```http
POST   /api/communication/events/consultation-started
POST   /api/communication/events/consultation-ended
POST   /api/communication/events/user-joined
POST   /api/communication/events/user-left
```

### Notifications
```http
POST   /api/communication/notifications/send
POST   /api/communication/notifications/push
POST   /api/communication/notifications/email
POST   /api/communication/notifications/sms
```

---

## 📋 REQUEST/RESPONSE EXAMPLES

### User Registration
```json
POST /api/user/auth/register
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "securePassword123",
  "fullName": "John Doe",
  "dateOfBirth": "1990-05-15",
  "timeOfBirth": "14:30:00",
  "placeOfBirth": "Mumbai, Maharashtra",
  "gender": "male",
  "maritalStatus": "single",
  "occupation": "Software Engineer"
}

Response:
{
  "success": true,
  "message": "OTP sent to your phone number",
  "data": {
    "userId": "uuid",
    "otpSent": true,
    "expiresIn": 300
  }
}
```

### Book Consultation
```json
POST /api/user/consultations/book
{
  "astrologerId": "uuid",
  "type": "chat",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 30
}

Response:
{
  "success": true,
  "message": "Consultation booked successfully",
  "data": {
    "consultationId": "uuid",
    "totalAmount": 450.00,
    "walletBalanceAfter": 550.00,
    "agoraChannelName": "consultation_uuid",
    "scheduledAt": "2024-01-15T10:00:00Z"
  }
}
```

### Send Chat Message
```json
POST /api/communication/chat/:consultationId/message
{
  "content": "Hello, I need guidance about my career",
  "type": "text"
}

Response:
{
  "success": true,
  "data": {
    "messageId": "uuid",
    "content": "Hello, I need guidance about my career",
    "type": "text",
    "senderId": "uuid",
    "senderType": "user",
    "createdAt": "2024-01-15T10:05:00Z"
  }
}
```

### Get Nearby Astrologers
```json
GET /api/user/astrologers/nearby?lat=19.0760&lng=72.8777&radius=10

Response:
{
  "success": true,
  "data": {
    "astrologers": [
      {
        "id": "uuid",
        "fullName": "Dr. Rajesh Sharma",
        "displayName": "Dr. Rajesh",
        "profileImageUrl": "https://...",
        "specialties": ["Vedic Astrology", "Career"],
        "averageRating": 4.8,
        "totalReviews": 1250,
        "experienceYears": 15,
        "isOnline": true,
        "chatRate": 25.00,
        "voiceRate": 30.00,
        "videoRate": 40.00,
        "distance": 2.5,
        "languages": ["Hindi", "English"]
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```

---

## 🔐 Authentication Headers

All protected endpoints require authentication:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📊 Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## 🔄 Real-time Events (WebSocket)

### Supabase Realtime Subscriptions

```javascript
// Chat messages
supabase
  .channel(`consultation:${consultationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `consultation_id=eq.${consultationId}`
  }, (payload) => {
    // Handle new message
  })
  .subscribe()

// Consultation status updates
supabase
  .channel(`consultation_status:${consultationId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'consultations',
    filter: `id=eq.${consultationId}`
  }, (payload) => {
    // Handle status change
  })
  .subscribe()
```