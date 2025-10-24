import { unauthorized, ok, serverError, badRequest } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return badRequest('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return badRequest('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return badRequest('File size must be less than 5MB');
    }

    const supabase = createSupabaseAdmin();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return serverError('Failed to upload file', uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: urlData.publicUrl })
      .eq('id', user.id);

    if (updateError) {
      return serverError('Failed to update profile', updateError.message);
    }

    return ok({
      avatarUrl: urlData.publicUrl,
      message: 'Avatar uploaded successfully',
    });
  } catch (err) {
    return serverError('Failed to upload avatar', (err as Error).message);
  }
}
