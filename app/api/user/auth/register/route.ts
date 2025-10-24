import { z } from 'zod';
import { created, unprocessable, serverError, conflict } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name is too long'),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  occupation: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log('Registration request data:', json);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten());
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone,
      email_confirm: true, // Auto-confirm for development
      phone_confirm: true, // Auto-confirm for development
    });

    if (authError || !authData.user) {
      console.error('Auth creation error:', authError);
      if (authError?.message?.includes('already registered') || authError?.message?.includes('already exists')) {
        return conflict('User already exists');
      }
      return serverError('Failed to create user', authError?.message);
    }

    // Create user profile in users table
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password_hash: '', // Supabase Auth handles password
      full_name: parsed.data.fullName,
      date_of_birth: parsed.data.dateOfBirth || null,
      time_of_birth: parsed.data.timeOfBirth || null,
      place_of_birth: parsed.data.placeOfBirth || null,
      gender: parsed.data.gender || null,
      marital_status: parsed.data.maritalStatus || null,
      occupation: parsed.data.occupation || null,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Rollback: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return serverError('Failed to create profile', profileError.message);
    }
    
    console.log('User registered successfully:', authData.user.id);

    return created({
      userId: authData.user.id,
      otpSent: true,
      expiresIn: 300,
    });
  } catch (err) {
    return serverError('Failed to register', (err as Error).message);
  }
}
