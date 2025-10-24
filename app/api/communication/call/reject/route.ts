import { z } from 'zod';
import { unauthorized, ok, unprocessable, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';

const RejectCallSchema = z.object({
  consultationId: z.string().uuid(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = RejectCallSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // TODO: Update consultation status and notify other party

    return ok({
      rejected: true,
      consultationId: parsed.data.consultationId,
      message: 'Call rejected',
    });
  } catch (err) {
    return serverError('Failed to reject call', (err as Error).message);
  }
}
