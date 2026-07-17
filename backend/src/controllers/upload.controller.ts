import { Response } from 'express';
import { supabase } from '../config/supabase';
import { cloudinaryService } from '../services/cloudinary/cloudinary.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const handleUpload = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { file, folder, fileName, mimeType, fileSize } = req.body;

    if (!user) return sendError(res, 'Unauthorized', 'Upload failed', 401);
    if (!file) return sendError(res, 'Missing base64 file data parameter in request body.', 'Bad request', 400);

    // 1. Upload to Cloudinary
    const cloudinaryResponse = await cloudinaryService.uploadFile(file, folder || 'learnforge');

    // 2. Track inside Supabase database
    const { data: uploadedRecord, error: dbErr } = await supabase
      .from('uploaded_files')
      .insert({
        user_id: user.profileId,
        file_name: fileName || 'unnamed_upload',
        file_url: cloudinaryResponse.url,
        file_size: fileSize || 0,
        mime_type: mimeType || 'image/png',
        provider: 'cloudinary'
      })
      .select()
      .single();

    if (dbErr) {
      console.warn('>>> [Upload Controller] Saved in Cloudinary but Supabase log failed:', dbErr.message);
    }

    return sendSuccess(
      res, 
      uploadedRecord || { url: cloudinaryResponse.url }, 
      'File uploaded successfully to Cloudinary.'
    );
  } catch (err: any) {
    return sendError(res, err.message || err, 'File upload failed');
  }
};
