# Anytime Pooja - System Design & Architecture

## 🏗️ System Overview

### Architecture Pattern
- **Frontend**: Single Next.js app with dual interfaces (User + Astrologer)
- **Backend**: Separate microservices for User & Astrologer operations
- **Database**: Shared Supabase PostgreSQL database
- **Real-time**: Agora SDK for voice/video calls + Supabase Realtime for chat
- **Location**: OpenStreetMap for nearby astrologer suggestions
- **Horoscope**: External Horoscope API integration

## 🎯 Core Services

### 1. User Service (Port: 3001)
```
/api/user/
├── auth/          # Login, signup, OTP verification
├── profile/       # User profile management
├── wallet/        # Wallet operations, transactions
├── consultations/ # Book, manage consultations
├── favorites/     # Favorite astrologers
├── horoscope/     # Daily/weekly/monthly horoscope
└── location/      # Nearby astrologers
```

### 2. Astrologer Service (Port: 3002)
```
/api/astrologer/
├── auth/          # Astrologer login, signup
├── profile/       # Professional profile, specialties
├── availability/  # Schedule management
├── consultations/ # Manage client sessions
├── earnings/      # Revenue tracking
├── clients/       # Client management
└── analytics/     # Performance metrics
```

### 3. Communication Service (Port: 3003)
```
/api/communication/
├── chat/          # Real-time messaging
├── call/          # Voice call management (Agora)
├── video/         # Video call management (Agora)
├── notifications/ # Push notifications
└── feedback/      # Session ratings & reviews
```

## 🗄️ Database Architecture

### Core Entities
1. **Users** - Customer profiles
2. **Astrologers** - Professional profiles
3. **Consultations** - Session management
4. **Transactions** - Payment tracking
5. **Messages** - Chat history
6. **Reviews** - Feedback system
7. **Specialties** - Astrologer expertise areas

## 🔧 Technology Stack

### Backend Services
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime + Agora SDK
- **File Storage**: Supabase Storage
- **API Documentation**: Swagger/OpenAPI

### External Integrations
- **Agora**: Voice/Video calling
- **OpenStreetMap**: Location services
- **Horoscope API**: Daily predictions
- **Payment Gateway**: Razorpay/Stripe
- **SMS**: Twilio for OTP

## 📱 API Architecture

### RESTful Endpoints
```
User Service:
POST   /api/user/auth/login
POST   /api/user/auth/signup
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/wallet/balance
POST   /api/user/wallet/recharge
GET    /api/user/consultations
POST   /api/user/consultations/book

Astrologer Service:
POST   /api/astrologer/auth/login
GET    /api/astrologer/dashboard
PUT    /api/astrologer/availability
GET    /api/astrologer/consultations
PUT    /api/astrologer/consultation/:id/status

Communication Service:
GET    /api/communication/chat/:consultationId
POST   /api/communication/chat/message
POST   /api/communication/call/initiate
POST   /api/communication/video/start
```

## 🔄 Data Flow

### Consultation Booking Flow
1. User searches/browses astrologers
2. User selects astrologer & time slot
3. Payment processing via wallet
4. Consultation created in database
5. Real-time notification to astrologer
6. Session starts (chat/call/video)
7. Session completion & feedback

### Real-time Communication
1. **Chat**: Supabase Realtime subscriptions
2. **Voice/Video**: Agora SDK integration
3. **Notifications**: Real-time updates via WebSocket

## 🛡️ Security & Authentication

### User Authentication
- JWT tokens via Supabase Auth
- OTP verification for phone numbers
- Role-based access control (User/Astrologer)

### Data Security
- Row Level Security (RLS) in Supabase
- API rate limiting
- Input validation & sanitization
- HTTPS encryption

## 📊 Monitoring & Analytics

### Performance Metrics
- API response times
- Database query performance
- Real-time connection stability
- User engagement analytics

### Business Metrics
- Consultation completion rates
- Revenue tracking
- User retention
- Astrologer performance

## 🚀 Deployment Strategy

### Development Environment
- Local development with Docker Compose
- Supabase local development setup
- Environment-specific configurations

### Production Deployment
- Containerized microservices
- Load balancing for high availability
- Database connection pooling
- CDN for static assets

## 📈 Scalability Considerations

### Horizontal Scaling
- Microservices can scale independently
- Database read replicas for heavy queries
- Caching layer (Redis) for frequently accessed data

### Performance Optimization
- Database indexing strategy
- API response caching
- Image optimization for profiles
- Lazy loading for mobile app