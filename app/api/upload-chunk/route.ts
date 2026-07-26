import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/supabase-server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory store for accumulating chunks during upload session
const uploadChunksMap = new Map<string, Buffer[]>();

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch (err: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string || '0');
    const totalChunks = parseInt(formData.get('totalChunks') as string || '1');
    const uploadId = formData.get('uploadId') as string;

    if (!chunk || !uploadId) {
      return NextResponse.json({ error: 'Invalid chunk data' }, { status: 400 });
    }

    const arrayBuffer = await chunk.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!uploadChunksMap.has(uploadId)) {
      uploadChunksMap.set(uploadId, new Array(totalChunks));
    }

    const chunks = uploadChunksMap.get(uploadId)!;
    chunks[chunkIndex] = buffer;

    // Check if all chunks have been received
    const receivedCount = chunks.filter(Boolean).length;
    const isComplete = receivedCount === totalChunks;

    if (isComplete) {
      const fullBuffer = Buffer.concat(chunks);
      uploadChunksMap.delete(uploadId); // Clean up memory

      // Upload accumulated video buffer directly to Cloudinary stream
      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'nanohana-lodge',
            resource_type: 'video',
            use_filename: true,
            unique_filename: true,
          },
          (error, res) => {
            if (error) reject(error);
            else resolve(res as any);
          }
        );
        stream.end(fullBuffer);
      });

      return NextResponse.json({
        success: true,
        complete: true,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    return NextResponse.json({
      success: true,
      complete: false,
      chunkIndex,
      totalChunks,
    });
  } catch (error: any) {
    console.error('Chunked upload error:', error);
    return NextResponse.json({ error: error.message || 'Chunk upload failed' }, { status: 500 });
  }
}
