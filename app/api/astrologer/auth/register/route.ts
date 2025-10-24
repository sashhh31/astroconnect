import { z } from 'zod';
import { created, unprocessable, serverError, conflict } from '@/lib/server/http';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const RegisterSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100),
  displayName: z.string().min(2).max(100).optional(),
  experienceYears: z.number().int().min(0).default(0),
  education: z.string().optional(),
  bio: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    const supabase = createSupabaseAdmin();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone,
      email_confirm: false,
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes('already registered')) {
        return conflict('Astrologer already exists');
      }
      return serverError('Failed to create astrologer', authError?.message);
    }

    // Create astrologer profile
    const { error: profileError } = await supabase.from('astrologers').insert({
      id: authData.user.id,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password_hash: '',
      full_name: parsed.data.fullName,
      display_name: parsed.data.displayName || parsed.data.fullName,
      experience_years: parsed.data.experienceYears,
      education: parsed.data.education || null,
      bio: parsed.data.bio || null,
      status: 'pending_approval',
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return serverError('Failed to create profile', profileError.message);
    }

    return created({
      astrologerId: authData.user.id,
      otpSent: true,
      expiresIn: 300,
      status: 'pending_approval',
    });
  } catch (err) {
    return serverError('Failed to register', (err as Error).message);
  }
}
