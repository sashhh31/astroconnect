import { z } from 'zod';
import { unauthorized, ok, unprocessable, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';

const AcceptVideoSchema = z.object({
  consultationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = AcceptVideoSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    return ok({
      accepted: true,
      consultationId: parsed.data.consultationId,
      message: 'Video call accepted',
    });
  } catch (err) {
    return serverError('Failed to accept video call', (err as Error).message);
  }
}
