import cloudinary from '../../config/cloudinary';

export class CloudinaryService {
  /**
   * Upload a file from a file path, buffer, or base64 data URL.
   */
  async uploadFile(
    fileData: string, 
    folder: string = 'learnforge'
  ): Promise<{ url: string; publicId: string }> {
    try {
      console.log(`>>> [Cloudinary Service] Uploading asset to folder: ${folder}...`);
      const result = await cloudinary.uploader.upload(fileData, {
        folder,
        resource_type: 'auto'
      });

      console.log(`>>> [Cloudinary Service] Upload succeeded. URL: ${result.secure_url}`);
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error: any) {
      console.error('>>> [Cloudinary Service] Upload failed:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete an asset by its public ID.
   */
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      console.error('>>> [Cloudinary Service] Delete failed:', error);
      return false;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
