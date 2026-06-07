'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Convert the file to a buffer for cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nanohana-lodge',
          use_filename: true,
          unique_filename: true,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as any);
        }
      );
      stream.end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { error: error.message || 'Upload failed' };
  }
}

export async function getUploadedImages() {
  try {
    const result = await cloudinary.search
      .expression('folder:nanohana-lodge')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    return {
      success: true,
      images: result.resources.map((r: any) => ({
        name: r.filename || r.public_id.split('/').pop(),
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        createdAt: r.created_at,
      })),
    };
  } catch (error: any) {
    console.error('Cloudinary fetch error:', error);
    return { error: error.message || 'Failed to fetch images' };
  }
}
