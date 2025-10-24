import { z } from 'zod';
import { ok, unauthorized, notFound, serverError, unprocessable } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { id } = params;
  if (!id) return notFound('Consultation not found');

  const json = await req.json();
  const parsed = ReviewSchema.safeParse(json);
  if (!parsed.success) {
    return unprocessable('Validation Error', parsed.error.flatten());
  }

  const supabase = createSupabaseAdmin();

  // Verify consultation exists and belongs to user
  const { data: consultation, error: consultError } = await supabase
    .from('consultations')
    .select('astrologer_id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (consultError || !consultation) {
    return notFound('Consultation not found');
  }

  // Update consultation with rating and review
  const { error: updateError } = await supabase
    .from('consultations')
    .update({
      user_rating: parsed.data.rating,
      user_review: parsed.data.review || null,
    })
    .eq('id', id);

  if (updateError) {
    return serverError('Failed to submit review', updateError.message);
  }

  // Create review record
  await supabase.from('reviews').insert({
    consultation_id: id,
    user_id: user.id,
    astrologer_id: consultation.astrologer_id,
    rating: parsed.data.rating,
    review_text: parsed.data.review || null,
  });

  return ok({ submitted: true, rating: parsed.data.rating });
}
