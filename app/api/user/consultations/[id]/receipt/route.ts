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
  if (!id) return notFound('Consultation not found');

  try {
    const supabase = createSupabaseAdmin();

    const { data: consultation, error } = await supabase
      .from('consultations')
      .select(`
        *,
        astrologers(full_name, display_name, phone, email),
        users(full_name, phone, email)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !consultation) {
      return notFound('Consultation not found');
    }

    // Get transaction details
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('consultation_id', id)
      .eq('type', 'debit')
      .single();

    const receipt = {
      receiptNumber: `RCP-${id.slice(0, 8).toUpperCase()}`,
      consultationId: consultation.id,
      date: consultation.created_at,
      status: consultation.status,
      
      // User details
      customer: {
        name: consultation.users?.full_name,
        email: consultation.users?.email,
        phone: consultation.users?.phone,
      },

      // Astrologer details
      astrologer: {
        name: consultation.astrologers?.display_name || consultation.astrologers?.full_name,
        email: consultation.astrologers?.email,
        phone: consultation.astrologers?.phone,
      },

      // Consultation details
      consultation: {
        type: consultation.type,
        scheduledAt: consultation.scheduled_at,
        startedAt: consultation.started_at,
        endedAt: consultation.ended_at,
        durationMinutes: consultation.duration_minutes,
      },

      // Pricing
      pricing: {
        ratePerMinute: parseFloat(consultation.rate_per_minute || '0'),
        duration: consultation.duration_minutes || 0,
        subtotal: parseFloat(consultation.total_amount || '0'),
        tax: 0, // Add tax calculation if needed
        total: parseFloat(consultation.total_amount || '0'),
      },

      // Payment details
      payment: {
        method: transaction?.payment_method || 'wallet',
        transactionId: transaction?.id,
        paymentGatewayId: transaction?.payment_gateway_id,
        paidAt: transaction?.created_at,
      },
    };

    return ok(receipt);
  } catch (err) {
    return serverError('Failed to generate receipt', (err as Error).message);
  }
}
