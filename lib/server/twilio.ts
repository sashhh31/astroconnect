import twilio from 'twilio';
import { env } from './env';

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = env.TWILIO_ACCOUNT_SID;
    const authToken = env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }
    
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

export async function sendSMS(to: string, message: string): Promise<{ sid: string; status: string }> {
  const client = getTwilioClient();
  const fromNumber = env.TWILIO_PHONE_NUMBER;
  
  if (!fromNumber) {
    throw new Error('Twilio phone number not configured');
  }

  const result = await client.messages.create({
    body: message,
    from: fromNumber,
    to: to,
  });

  return {
    sid: result.sid,
    status: result.status,
  };
}

export async function sendOTP(to: string, otp: string): Promise<{ sid: string; status: string }> {
  const message = `Your AstroConnect verification code is: ${otp}. Valid for 5 minutes.`;
  return sendSMS(to, message);
}

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
