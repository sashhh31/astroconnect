export const env = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  
  // Agora
  AGORA_APP_ID: process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID || '',
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || '',
  AGORA_API_KEY: process.env.AGORA_API_KEY || '',
  AGORA_API_SECRET: process.env.AGORA_API_SECRET || '',
  
  // SMTP / Email
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '465',
  SMTP_USERNAME: process.env.SMTP_USERNAME || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'AstroConnect',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || '',
  
  // Twilio (Alternative for SMS)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  
  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  
  // Horoscope API
  VEDIC_ASTROLOGY_API_KEY: process.env.VEDIC_ASTROLOGY_API_KEY || '',
  ASTROLOGY_API_BASE_URL: process.env.ASTROLOGY_API_BASE_URL || 'https://json.astrologyapi.com/v1',
  
  // File Storage - Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  
  // File Storage - AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || 'ap-south-1',
  AWS_BUCKET: process.env.AWS_BUCKET || '',
  
  // File Storage - Supabase
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'avatars',
  
  // Firebase (Push Notifications)
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
  FCM_PROJECT_ID: process.env.FCM_PROJECT_ID || '',
  FCM_PRIVATE_KEY: process.env.FCM_PRIVATE_KEY || '',
  FCM_CLIENT_EMAIL: process.env.FCM_CLIENT_EMAIL || '',
  
  // SendGrid (Alternative Email)
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || '',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || '',
  
  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Business Configuration
  PLATFORM_COMMISSION_PERCENTAGE: parseInt(process.env.PLATFORM_COMMISSION_PERCENTAGE || '20'),
  MIN_WALLET_BALANCE: parseInt(process.env.MIN_WALLET_BALANCE || '50'),
  REFERRAL_BONUS_AMOUNT: parseInt(process.env.REFERRAL_BONUS_AMOUNT || '100'),
  FREE_CONSULTATION_MINUTES: parseInt(process.env.FREE_CONSULTATION_MINUTES || '5'),
  MAX_CONSULTATION_DURATION_MINUTES: parseInt(process.env.MAX_CONSULTATION_DURATION_MINUTES || '120'),
  DEFAULT_CHAT_RATE: parseInt(process.env.DEFAULT_CHAT_RATE || '15'),
  DEFAULT_VOICE_RATE: parseInt(process.env.DEFAULT_VOICE_RATE || '20'),
  DEFAULT_VIDEO_RATE: parseInt(process.env.DEFAULT_VIDEO_RATE || '25'),
};

export function ensureEnv(keys: (keyof typeof env)[]) {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
