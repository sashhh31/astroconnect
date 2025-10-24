-- Anytime Pooja - Complete Database Schema
-- Supabase PostgreSQL Database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE astrologer_status AS ENUM ('active', 'inactive', 'pending_approval', 'suspended');
CREATE TYPE consultation_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE consultation_type AS ENUM ('chat', 'voice_call', 'video_call');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('wallet', 'upi', 'card', 'netbanking');
CREATE TYPE message_type AS ENUM ('text', 'image', 'audio', 'system');
CREATE TYPE notification_type AS ENUM ('consultation', 'payment', 'promotion', 'system');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');

-- =============================================
-- CORE TABLES
-- =============================================

-- Users Table (Customers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    time_of_birth TIME,
    place_of_birth VARCHAR(100),
    gender gender,
    marital_status marital_status,
    occupation VARCHAR(100),
    profile_image_url TEXT,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    total_consultations INTEGER DEFAULT 0,
    status user_status DEFAULT 'active',
    location GEOGRAPHY(POINT, 4326), -- For nearby astrologer suggestions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Astrologers Table
CREATE TABLE astrologers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    profile_image_url TEXT,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    languages TEXT[], -- Array of languages
    education TEXT,
    certifications TEXT[],
    
    -- Pricing
    chat_rate DECIMAL(8,2) DEFAULT 0.00, -- Per minute
    voice_rate DECIMAL(8,2) DEFAULT 0.00, -- Per minute
    video_rate DECIMAL(8,2) DEFAULT 0.00, -- Per minute
    
    -- Stats
    total_consultations INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    
    -- Status & Verification
    status astrologer_status DEFAULT 'pending_approval',
    is_online BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[],
    
    -- Location
    location GEOGRAPHY(POINT, 4326),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE
);

-- Specialties/Categories
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Astrologer Specialties (Many-to-Many)
CREATE TABLE astrologer_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(astrologer_id, specialty_id)
);

-- Astrologer Availability
CREATE TABLE astrologer_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultations
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    
    -- Session Details
    type consultation_type NOT NULL,
    status consultation_status DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    
    -- Pricing
    rate_per_minute DECIMAL(8,2) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Communication
    agora_channel_name VARCHAR(100), -- For voice/video calls
    agora_token TEXT,
    
    -- Feedback
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_review TEXT,
    astrologer_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages (Chat)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- Can be user_id or astrologer_id
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'astrologer', 'system')),
    
    -- Message Content
    type message_type DEFAULT 'text',
    content TEXT NOT NULL,
    media_url TEXT, -- For images/audio
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions (Wallet & Payments)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    
    -- Transaction Details
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    status transaction_status DEFAULT 'pending',
    
    -- Payment Details
    payment_method payment_method,
    payment_gateway_id VARCHAR(100), -- Razorpay/Stripe transaction ID
    gateway_response JSONB,
    
    -- Wallet Balance After Transaction
    wallet_balance_after DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews & Ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Favorites
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, astrologer_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    astrologer_id UUID REFERENCES astrologers(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data for the notification
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    bonus_amount DECIMAL(8,2) DEFAULT 100.00,
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Horoscope Cache (To reduce API calls)
CREATE TABLE horoscope_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zodiac_sign VARCHAR(20) NOT NULL,
    period VARCHAR(20) NOT NULL, -- daily, weekly, monthly
    date DATE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(zodiac_sign, period, date)
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_location ON users USING GIST(location);

-- Astrologers
CREATE INDEX idx_astrologers_email ON astrologers(email);
CREATE INDEX idx_astrologers_phone ON astrologers(phone);
CREATE INDEX idx_astrologers_status ON astrologers(status);
CREATE INDEX idx_astrologers_is_online ON astrologers(is_online);
CREATE INDEX idx_astrologers_location ON astrologers USING GIST(location);
CREATE INDEX idx_astrologers_rating ON astrologers(average_rating DESC);

-- Consultations
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_astrologer_id ON consultations(astrologer_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);

-- Messages
CREATE INDEX idx_messages_consultation_id ON messages(consultation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_astrologer_id ON reviews(astrologer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_astrologer_id ON notifications(astrologer_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =============================================
-- TRIGGERS FOR AUTO-UPDATES
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_astrologers_updated_at BEFORE UPDATE ON astrologers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update astrologer stats when review is added
CREATE OR REPLACE FUNCTION update_astrologer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE astrologers 
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM reviews 
            WHERE astrologer_id = NEW.astrologer_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE astrologer_id = NEW.astrologer_id
        )
    WHERE id = NEW.astrologer_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_astrologer_rating_trigger 
    AFTER INSERT ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_astrologer_rating();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE astrologers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Astrologers can only see their own data
CREATE POLICY "Astrologers can view own profile" ON astrologers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Astrologers can update own profile" ON astrologers FOR UPDATE USING (auth.uid() = id);

-- Consultations: Users and astrologers can see their own consultations
CREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Astrologers can view own consultations" ON consultations FOR SELECT USING (auth.uid() = astrologer_id);

-- Messages: Only consultation participants can see messages
CREATE POLICY "Consultation participants can view messages" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM consultations 
        WHERE id = consultation_id 
        AND (user_id = auth.uid() OR astrologer_id = auth.uid())
    )
);

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default specialties
INSERT INTO specialties (name, description, icon, color) VALUES
('Love', 'Relationship and love guidance', 'Heart', '#EC4899'),
('Career', 'Professional and career advice', 'Briefcase', '#3B82F6'),
('Health', 'Health and wellness predictions', 'HeartPulse', '#10B981'),
('Finance', 'Financial and money matters', 'DollarSign', '#F59E0B'),
('Marriage', 'Marriage and family guidance', 'Users', '#8B5CF6'),
('Education', 'Academic and learning guidance', 'GraduationCap', '#6366F1'),
('Property', 'Real estate and property advice', 'Home', '#F97316'),
('General', 'General life guidance', 'Sparkles', '#FF6B1A');

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('min_wallet_balance', '50', 'Minimum wallet balance required for consultations'),
('referral_bonus', '100', 'Bonus amount for successful referrals'),
('consultation_buffer_minutes', '5', 'Buffer time before consultation starts'),
('max_consultation_duration', '120', 'Maximum consultation duration in minutes'),
('platform_commission_percentage', '20', 'Platform commission percentage');