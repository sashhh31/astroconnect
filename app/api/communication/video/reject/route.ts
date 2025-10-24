import { z } from 'zod';
import { unauthorized, ok, unprocessable, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';

const RejectVideoSchema = z.object({
  consultationId: z.string().uuid(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = RejectVideoSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    return ok({
      rejected: true,
      consultationId: parsed.data.consultationId,
      message: 'Video call rejected',
    });
  } catch (err) {
    return serverError('Failed to reject video call', (err as Error).message);
  }
}
