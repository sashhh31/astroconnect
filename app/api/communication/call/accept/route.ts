import { z } from 'zod';
import { unauthorized, ok, unprocessable, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';

const AcceptCallSchema = z.object({
  consultationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const json = await req.json();
    const parsed = AcceptCallSchema.safeParse(json);
    if (!parsed.success) {
      return unprocessable('Validation Error', parsed.error.flatten());
    }

    // TODO: Verify consultation and generate Agora token

    return ok({
      accepted: true,
      consultationId: parsed.data.consultationId,
      message: 'Call accepted',
    });
  } catch (err) {
    return serverError('Failed to accept call', (err as Error).message);
  }
}
