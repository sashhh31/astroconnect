import { unauthorized, ok, serverError } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function DELETE(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const supabase = createSupabaseAdmin();

    // Get current avatar URL
    const { data: userData } = await supabase
      .from('users')
      .select('profile_image_url')
      .eq('id', user.id)
      .single();

    // Remove avatar URL from profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: null })
      .eq('id', user.id);

    if (updateError) {
      return serverError('Failed to delete avatar', updateError.message);
    }

    // Optionally delete from storage (extract path from URL)
    if (userData?.profile_image_url) {
      const urlParts = userData.profile_image_url.split('/');
      const filePath = urlParts.slice(-2).join('/'); // avatars/filename
      await supabase.storage.from('profiles').remove([filePath]);
    }

    return ok({
      deleted: true,
      message: 'Avatar deleted successfully',
    });
  } catch (err) {
    return serverError('Failed to delete avatar', (err as Error).message);
  }
}
