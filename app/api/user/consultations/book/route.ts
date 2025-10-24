import { z } from 'zod';
import { created, unprocessable, serverError, badRequest, unauthorized } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const BookSchema = z.object({
  astrologerId: z.string().uuid(),
  type: z.enum(['chat', 'voice_call', 'video_call']).default('chat'),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().positive().default(15),
});

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorized();

    const json = await req.json();
    const parsed = BookSchema.safeParse(json);
    if (!parsed.success) return unprocessable('Validation Error', parsed.error.flatten());

    const supabase = createSupabaseAdmin();

    // Fetch astrologer rates
    const { data: astrologer, error: astroError } = await supabase
      .from('astrologers')
      .select('chat_rate, voice_rate, video_rate')
      .eq('id', parsed.data.astrologerId)
      .single();

    if (astroError || !astrologer) {
      return badRequest('Astrologer not found');
    }

    // Calculate rate based on consultation type
    const ratePerMinute = parsed.data.type === 'chat' 
      ? parseFloat(astrologer.chat_rate || '0')
      : parsed.data.type === 'voice_call'
      ? parseFloat(astrologer.voice_rate || '0')
      : parseFloat(astrologer.video_rate || '0');

    const totalAmount = ratePerMinute * parsed.data.duration;

    // Check wallet balance
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    const walletBalance = parseFloat(userData?.wallet_balance || '0');
    if (walletBalance < totalAmount) {
      return badRequest('Insufficient wallet balance');
    }

    // Create consultation
    const scheduledAt = parsed.data.scheduledAt || new Date().toISOString();
    const agoraChannelName = `consultation_${crypto.randomUUID()}`;

    const { data: consultation, error: consultError } = await supabase
      .from('consultations')
      .insert({
        user_id: user.id,
        astrologer_id: parsed.data.astrologerId,
        type: parsed.data.type,
        scheduled_at: scheduledAt,
        rate_per_minute: ratePerMinute,
        total_amount: totalAmount,
        agora_channel_name: agoraChannelName,
        status: 'pending',
      })
      .select()
      .single();

    if (consultError || !consultation) {
      return serverError('Failed to book consultation', consultError?.message);
    }

    // Deduct from wallet and create transaction
    const newBalance = walletBalance - totalAmount;
    await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id);

    await supabase.from('transactions').insert({
      user_id: user.id,
      consultation_id: consultation.id,
      type: 'debit',
      amount: totalAmount,
      description: `Consultation booking - ${parsed.data.type}`,
      status: 'completed',
      payment_method: 'wallet',
      wallet_balance_after: newBalance,
    });

    return created({
      consultationId: consultation.id,
      totalAmount,
      walletBalanceAfter: newBalance,
      agoraChannelName,
      scheduledAt,
    });
  } catch (err) {
    return serverError('Failed to book consultation', (err as Error).message);
  }
}
