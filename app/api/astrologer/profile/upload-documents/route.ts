import { unauthorized, ok, serverError, badRequest } from '@/lib/server/http';
import { getAuthUser } from '@/lib/server/auth';
import { createSupabaseAdmin } from '@/lib/server/supabase';

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return badRequest('No files provided');
    }

    if (files.length > 5) {
      return badRequest('Maximum 5 documents allowed');
    }

    const supabase = createSupabaseAdmin();
    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type (PDF, images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        continue; // Skip invalid files
      }

      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files > 10MB
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `astrologer-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    // Update astrologer verification documents
    const { data: astrologer } = await supabase
      .from('astrologers')
      .select('verification_documents')
      .eq('id', user.id)
      .single();

    const existingDocs = astrologer?.verification_documents || [];
    const updatedDocs = [...existingDocs, ...uploadedUrls];

    const { error: updateError } = await supabase
      .from('astrologers')
      .update({ verification_documents: updatedDocs })
      .eq('id', user.id);

    if (updateError) {
      return serverError('Failed to update documents', updateError.message);
    }

    return ok({
      uploadedDocuments: uploadedUrls,
      totalDocuments: updatedDocs.length,
      message: 'Documents uploaded successfully',
    });
  } catch (err) {
    return serverError('Failed to upload documents', (err as Error).message);
  }
}
