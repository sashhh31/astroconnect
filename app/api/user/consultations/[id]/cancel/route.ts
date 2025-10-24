import { ok, unauthorized, notFound, serverError, badRequest } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function PUT(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return notFound('Consultation not found');

  const supabase = createSupabaseAdmin();

  // Fetch consultation
  const { data: consultation, error: fetchError } = await supabase
    .from('consultations')
    .select('*, users(wallet_balance)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !consultation) {
    return notFound('Consultation not found');
  }

  if (consultation.status !== 'pending' && consultation.status !== 'confirmed') {
    return badRequest('Cannot cancel consultation in current status');
  }

  // Update status to cancelled
  const { error: updateError } = await supabase
    .from('consultations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (updateError) {
    return serverError('Failed to cancel consultation', updateError.message);
  }

  // Refund to wallet
  const refundAmount = parseFloat(consultation.total_amount || '0');
  const currentBalance = parseFloat(consultation.users?.wallet_balance || '0');
  const newBalance = currentBalance + refundAmount;

  await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id);

  await supabase.from('transactions').insert({
    user_id: user.id,
    consultation_id: id,
    type: 'credit',
    amount: refundAmount,
    description: 'Consultation cancellation refund',
    status: 'completed',
    payment_method: 'wallet',
    wallet_balance_after: newBalance,
  });

  return ok({ cancelled: true, refundAmount, walletBalance: newBalance });
}
