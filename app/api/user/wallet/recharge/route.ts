import { z } from 'zod';
import { ok, unauthorized, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const RechargeSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(['upi', 'card', 'netbanking']).default('upi'),
  paymentGatewayId: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const json = await req.json();
  const parsed = RechargeSchema.safeParse(json);
  if (!parsed.success) {
    return unprocessable('Validation Error', parsed.error.flatten());
  }

  const supabase = createSupabaseAdmin();

  // Get current balance
  const { data: userData } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', user.id)
    .single();

  const currentBalance = parseFloat(userData?.wallet_balance || '0');
  const newBalance = currentBalance + parsed.data.amount;

  // Update wallet balance
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', user.id);

  if (updateError) {
    return serverError('Failed to update balance', updateError.message);
  }

  // Create transaction record
  const { data: transaction, error: txnError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'credit',
      amount: parsed.data.amount,
      description: 'Wallet recharge',
      status: 'completed',
      payment_method: parsed.data.paymentMethod,
      payment_gateway_id: parsed.data.paymentGatewayId || null,
      wallet_balance_after: newBalance,
    })
    .select()
    .single();

  if (txnError) {
    return serverError('Failed to create transaction', txnError.message);
  }

  return ok({
    transactionId: transaction.id,
    amount: parsed.data.amount,
    newBalance,
    status: 'completed',
  });
}
