import { unauthorized, ok, notFound, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return notFound('Transaction not found');

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return notFound('Transaction not found');
    }

    return ok({
      id: data.id,
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      status: data.status,
      paymentMethod: data.payment_method,
      paymentGatewayId: data.payment_gateway_id,
      walletBalanceAfter: parseFloat(data.wallet_balance_after || '0'),
      consultationId: data.consultation_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (err) {
    return serverError('Failed to fetch transaction', (err as Error).message);
  }
}
