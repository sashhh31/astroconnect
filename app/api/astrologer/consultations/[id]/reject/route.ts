import { unauthorized, ok, badRequest, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return badRequest('Consultation ID required');

  try {
    const supabase = createSupabaseAdmin();

    // Verify consultation and get details for refund
    const { data: consultation } = await supabase
      .from('consultations')
      .select('status, user_id, total_amount')
      .eq('id', id)
      .eq('astrologer_id', user.id)
      .single();

    if (!consultation) {
      return badRequest('Consultation not found');
    }

    if (consultation.status !== 'pending' && consultation.status !== 'confirmed') {
      return badRequest('Consultation cannot be rejected in current status');
    }

    // Update status to cancelled
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (updateError) {
      return serverError('Failed to reject consultation', updateError.message);
    }

    // Refund to user wallet
    const refundAmount = parseFloat(consultation.total_amount || '0');
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', consultation.user_id)
      .single();

    const newBalance = parseFloat(userData?.wallet_balance || '0') + refundAmount;

    await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', consultation.user_id);

    await supabase.from('transactions').insert({
      user_id: consultation.user_id,
      consultation_id: id,
      type: 'credit',
      amount: refundAmount,
      description: 'Consultation rejected - refund',
      status: 'completed',
      payment_method: 'wallet',
      wallet_balance_after: newBalance,
    });

    // TODO: Send notification to user

    return ok({ rejected: true, refunded: refundAmount });
  } catch (err) {
    return serverError('Failed to reject consultation', (err as Error).message);
  }
}
