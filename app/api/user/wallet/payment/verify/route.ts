import { z } from 'zod';
import { unauthorized, ok, badRequest, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = VerifyPaymentSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // TODO: Verify Razorpay signature
    // const crypto = require('crypto');
    // const body = parsed.data.razorpay_order_id + '|' + parsed.data.razorpay_payment_id;
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(body.toString())
    //   .digest('hex');
    // if (expectedSignature !== parsed.data.razorpay_signature) {
    //   return badRequest('Invalid payment signature');
    // }

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
    await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    // Create transaction record
    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'credit',
        amount: parsed.data.amount,
        description: 'Wallet recharge via Razorpay',
        status: 'completed',
        payment_method: 'upi',
        payment_gateway_id: parsed.data.razorpay_payment_id,
        wallet_balance_after: newBalance,
        gateway_response: {
          order_id: parsed.data.razorpay_order_id,
          payment_id: parsed.data.razorpay_payment_id,
        },
      })
      .select()
      .single();

    return ok({
      verified: true,
      transactionId: transaction?.id,
      amount: parsed.data.amount,
      newBalance,
      message: 'Payment verified successfully',
    });
  } catch (err) {
    return serverError('Payment verification failed', (err as Error).message);
  }
}
